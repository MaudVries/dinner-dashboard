import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

const NOTE_ID = 1;
const TYPING_TTL_MS = 2000;
const STOP_TYPING_DELAY_MS = 1200;

export default function QuickNotes() {
  const [content, setContent] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [someoneElseTyping, setSomeoneElseTyping] = useState(false);

  const saveTimeoutRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const presenceCheckIntervalRef = useRef(null);
  const skipNextSaveRef = useRef(false);
  const channelRef = useRef(null);
  const clientIdRef = useRef(crypto.randomUUID());

  useEffect(() => {
    const clientId = clientIdRef.current;

    async function loadNote() {
      const { data, error } = await supabase
        .from("notes")
        .select("id, content")
        .eq("id", NOTE_ID)
        .maybeSingle();

      if (error) {
        console.error("Fout bij ophalen van notes:", error);
        return;
      }

      setContent(data?.content || "");
      setIsLoaded(true);
    }

    function updateTypingIndicator(channel) {
      const state = channel.presenceState();
      const now = Date.now();

      const othersAreTyping = Object.entries(state).some(([key, entries]) => {
        if (key === clientId) return false;

        return entries.some((entry) => {
          if (!entry.typing) return false;
          if (!entry.typing_at) return false;

          const age = now - new Date(entry.typing_at).getTime();
          return age < TYPING_TTL_MS;
        });
      });

      setSomeoneElseTyping(othersAreTyping);
    }

    loadNote();

    const channel = supabase.channel(`notes-room-${NOTE_ID}`, {
      config: {
        presence: {
          key: clientId,
        },
      },
    });

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
          filter: `id=eq.${NOTE_ID}`,
        },
        (payload) => {
          const nextContent = payload.new?.content ?? "";
          skipNextSaveRef.current = true;
          setContent(nextContent);
        }
      )
      .on("presence", { event: "sync" }, () => {
        updateTypingIndicator(channel);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            clientId,
            typing: false,
            typing_at: new Date().toISOString(),
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    // fallback checker (voor stale typing)
    presenceCheckIntervalRef.current = setInterval(() => {
      if (channelRef.current) {
        updateTypingIndicator(channelRef.current);
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (presenceCheckIntervalRef.current) {
        clearInterval(presenceCheckIntervalRef.current);
      }

      if (channelRef.current) {
        channelRef.current.track({
          clientId,
          typing: false,
          typing_at: new Date().toISOString(),
          online_at: new Date().toISOString(),
        });
      }

      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      const { error } = await supabase.from("notes").upsert({
        id: NOTE_ID,
        content,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Fout bij opslaan van notes:", error);
      }
    }, 400);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, isLoaded]);

  async function handleTyping(nextValue) {
    const clientId = clientIdRef.current;

    setContent(nextValue);

    if (!channelRef.current) return;

    await channelRef.current.track({
      clientId,
      typing: true,
      typing_at: new Date().toISOString(),
      online_at: new Date().toISOString(),
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      if (!channelRef.current) return;

      await channelRef.current.track({
        clientId,
        typing: false,
        typing_at: new Date().toISOString(),
        online_at: new Date().toISOString(),
      });
    }, STOP_TYPING_DELAY_MS);
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
  <h2 className="text-2xl font-semibold">Quick notes</h2>

  {someoneElseTyping && (
    <div className="text-sm text-red-500 font-medium animate-pulse sm:text-right">
      Iemand anders typt...
    </div>
  )}
</div>

      <textarea
        className="mt-4 w-full min-h-[220px] rounded-2xl border border-stone-200 px-4 py-3"
        value={content}
        onChange={(e) => handleTyping(e.target.value)}
        placeholder="Typ hier je notities..."
      />
    </div>
  );
}