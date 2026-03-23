  import { useEffect, useRef, useState } from "react";
  import { supabase } from "../lib/supabase";
  
  const NOTE_ID = 1;
  
  export default function QuickNotes() {
    const [content, setContent] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const saveTimeoutRef = useRef(null);
    const skipNextSaveRef = useRef(false);
  
    useEffect(() => {
      async function loadNote() {
        const { data, error } = await supabase
          .from("notes")
          .select("id, content")
          .eq("id", NOTE_ID)
          .single();
  
        if (error) {
          console.error("Fout bij ophalen van notes:", error);
          return;
        }
  
        setContent(data?.content || "");
        setIsLoaded(true);
      }
  
      loadNote();
  
      const channel = supabase
        .channel("notes-realtime")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "notes",
            filter: `id=eq.${NOTE_ID}`,
          },
          (payload) => {
            skipNextSaveRef.current = true;
            setContent(payload.new.content || "");
          }
        )
        .subscribe();
  
      return () => {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
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
        const { error } = await supabase
          .from("notes")
          .update({
            content,
            updated_at: new Date().toISOString(),
          })
          .eq("id", NOTE_ID);
  
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
  
    return (
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5">
        <h2 className="text-2xl font-semibold">Quick notes</h2>
  
        <textarea
          className="mt-4 w-full min-h-[220px] rounded-2xl border border-stone-200 px-4 py-3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Typ hier je notities..."
        />
      </div>
    );
  }