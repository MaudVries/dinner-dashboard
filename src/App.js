import React, { useEffect, useMemo, useState } from "react";
import { PHASES } from "./data/phases";
import { supabase } from "./lib/supabase";
import {
  getDoneTasks,
  getGroupedByPhase,
  getPhaseTotals,
  getProgress,
  getSortedTasks,
  getSpentDrank,
  getSpentEten,
  getTotalSpent,
} from "./utils/dinnerCalculations";
import TodoSection from "./components/TodoSection";
import QuickNotes from "./components/QuickNotes";
import StatsGrid from "./components/StatsGrid";
import DashboardHeader from "./components/DashboardHeader";
import PrintShoppingList from "./components/PrintShoppingList";
import BudgetOverview from "./components/BudgetOverview";
import ShoppingListSection from "./components/ShoppingListSection";
import ShoppingPhaseCard from "./components/ShoppingPhaseCard";

const EMPTY_NEW_ITEM = {
  phase: "",
  category: "",
  name: "",
  qty: "",
  unit: "",
  price: "",
  notes: "",
};

export default function ItalianDinnerDashboard() {
  const [guestCount, setGuestCount] = useState(0);
  const [budget, setBudget] = useState(0);
  const [settingsId, setSettingsId] = useState(null);

  const [items, setItems] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [newItem, setNewItem] = useState(EMPTY_NEW_ITEM);
  const [newTask, setNewTask] = useState({ title: "" });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    async function loadInitialData() {
      await Promise.all([
        fetchTasks(),
        fetchItems(),
        fetchDashboardSettings(),
      ]);
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-settings-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "dashboard_settings",
        },
        () => {
          fetchDashboardSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("tasks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("items-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "items",
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fout bij ophalen taken:", error);
      return;
    }

    setTasks(data || []);
  }

  async function fetchItems() {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fout bij ophalen items:", error);
      return;
    }

    setItems(data || []);
  }

  async function fetchDashboardSettings() {
    const { data, error } = await supabase
      .from("dashboard_settings")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1);
  
    if (error) {
      console.error("Fout bij ophalen dashboard settings:", error);
      return null;
    }
  
    if (!data || data.length === 0) {
      const { data: insertedData, error: insertError } = await supabase
        .from("dashboard_settings")
        .insert([{ guest_count: 20, budget: 650 }])
        .select()
        .single();
  
      if (insertError) {
        console.error("Fout bij aanmaken dashboard settings:", insertError);
        return null;
      }
  
      setSettingsId(insertedData.id);
      setGuestCount(Number(insertedData.guest_count) || 0);
      setBudget(Number(insertedData.budget) || 0);
  
      return insertedData;
    }
  
    const settings = data[0];
  
    setSettingsId(settings.id);
    setGuestCount(Number(settings.guest_count) || 0);
    setBudget(Number(settings.budget) || 0);
  
    return settings;
  }
  
  async function updateGuestCount(value) {
    const numericValue = Number(value) || 0;
    setGuestCount(numericValue);
  
    let currentSettingsId = settingsId;
  
    if (!currentSettingsId) {
      const settings = await fetchDashboardSettings();
      if (!settings) return;
      currentSettingsId = settings.id;
    }
  
    const { error } = await supabase
      .from("dashboard_settings")
      .update({ guest_count: numericValue })
      .eq("id", currentSettingsId);
  
    if (error) {
      console.error("Fout bij updaten guest_count:", error);
    }
  }
  
  async function updateBudget(value) {
    const numericValue = Number(value) || 0;
    setBudget(numericValue);
  
    let currentSettingsId = settingsId;
  
    if (!currentSettingsId) {
      const settings = await fetchDashboardSettings();
      if (!settings) return;
      currentSettingsId = settings.id;
    }
  
    const { error } = await supabase
      .from("dashboard_settings")
      .update({ budget: numericValue })
      .eq("id", currentSettingsId);
  
    if (error) {
      console.error("Fout bij updaten budget:", error);
    }
  }
  
  async function addItem() {
    if (!newItem.name.trim()) return;

    const itemToInsert = {
      phase: newItem.phase,
      category: newItem.category,
      name: newItem.name,
      qty: Number(newItem.qty) || 0,
      unit: newItem.unit,
      price: Number(newItem.price) || 0,
      notes: newItem.notes,
      bought: false,
    };

    const { data, error } = await supabase
      .from("items")
      .insert([itemToInsert])
      .select();

    if (error) {
      console.error("Fout bij toevoegen item:", error);
      return;
    }

    setItems((prev) => [...data, ...prev]);
    setNewItem(EMPTY_NEW_ITEM);
  }

  async function updateItem(id, field, value) {
    const updatedValue =
      field === "qty" || field === "price" ? Number(value) : value;

    const { error } = await supabase
      .from("items")
      .update({ [field]: updatedValue })
      .eq("id", id);

    if (error) {
      console.error("Fout bij updaten item:", error);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: updatedValue } : item
      )
    );
  }

  async function toggleBought(id) {
    const currentItem = items.find((item) => item.id === id);
    if (!currentItem) return;

    const newBoughtValue = !currentItem.bought;

    const { error } = await supabase
      .from("items")
      .update({ bought: newBoughtValue })
      .eq("id", id);

    if (error) {
      console.error("Fout bij updaten item:", error);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, bought: newBoughtValue } : item
      )
    );
  }

  async function removeItem(id) {
    const { error } = await supabase
      .from("items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Fout bij verwijderen item:", error);
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function addTask() {
    if (!newTask.title.trim()) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ title: newTask.title, completed: false }])
      .select();

    if (error) {
      console.error("Fout bij toevoegen taak:", error);
      return;
    }

    setTasks((prev) => [...data, ...prev]);
    setNewTask({ title: "" });
  }

  async function updateTask(id, value) {
    const { error } = await supabase
      .from("tasks")
      .update({ title: value })
      .eq("id", id);

    if (error) {
      console.error("Fout bij updaten taak:", error);
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, title: value } : task
      )
    );
  }

  async function toggleTask(id) {
    const currentTask = tasks.find((task) => task.id === id);
    if (!currentTask) return;

    const newCompletedValue = !currentTask.completed;

    const { error } = await supabase
      .from("tasks")
      .update({ completed: newCompletedValue })
      .eq("id", id);

    if (error) {
      console.error("Fout bij updaten taak:", error);
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: newCompletedValue }
          : task
      )
    );
  }

  async function removeTask(id) {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Fout bij verwijderen taak:", error);
      return;
    }

    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function handlePrint() {
    window.print();
  }

  const doneTasks = useMemo(() => getDoneTasks(tasks), [tasks]);
  const filteredTasks = useMemo(() => getSortedTasks(tasks), [tasks]);

  const totalSpent = useMemo(() => getTotalSpent(items), [items]);
  const spentDrank = useMemo(() => getSpentDrank(items), [items]);
  const spentEten = useMemo(() => getSpentEten(items), [items]);

  const drankBudgetPct = budget ? Math.min((spentDrank / budget) * 100, 100) : 0;
  const etenBudgetPct = budget ? Math.min((spentEten / budget) * 100, 100) : 0;
  const remainingBudget = budget - totalSpent;
  const isOverBudget = spentDrank + spentEten > budget;

  const progress = useMemo(() => getProgress(items), [items]);
  const pricePerPerson = guestCount ? budget / guestCount : 0;

  const groupedByPhase = useMemo(() => getGroupedByPhase(items), [items]);
  const phaseTotals = useMemo(() => getPhaseTotals(items), [items]);

  const stats = [
    { label: "Uitgegeven", value: `€ ${totalSpent.toFixed(2)}` },
    { label: "Resterend", value: `€ ${remainingBudget.toFixed(2)}` },
    { label: "Prijs p.p.", value: `€ ${pricePerPerson.toFixed(2)}` },
    { label: "Boodschappen binnen", value: `${progress}%` },
    { label: "Taken afgerond", value: `${doneTasks}/${tasks.length}` },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <DashboardHeader
          guestCount={guestCount}
          setGuestCount={updateGuestCount}
          budget={budget}
          setBudget={updateBudget}
        />

        <PrintShoppingList items={items} phases={PHASES} />

        <StatsGrid stats={stats} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <BudgetOverview
              budget={budget}
              spentDrank={spentDrank}
              spentEten={spentEten}
              drankBudgetPct={drankBudgetPct}
              etenBudgetPct={etenBudgetPct}
              isOverBudget={isOverBudget}
              phaseTotals={phaseTotals}
            />

            <ShoppingListSection
              handlePrint={handlePrint}
              newItem={newItem}
              setNewItem={setNewItem}
              addItem={addItem}
            >
              {groupedByPhase.map((group) => (
                <ShoppingPhaseCard
                  key={group.phase}
                  group={group}
                  editingItemId={editingItemId}
                  setEditingItemId={setEditingItemId}
                  updateItem={updateItem}
                  toggleBought={toggleBought}
                  removeItem={removeItem}
                />
              ))}
            </ShoppingListSection>
          </div>

          <div className="space-y-6">
            <TodoSection
              newTask={newTask}
              setNewTask={setNewTask}
              addTask={addTask}
              filteredTasks={filteredTasks}
              editingTaskId={editingTaskId}
              setEditingTaskId={setEditingTaskId}
              toggleTask={toggleTask}
              updateTask={updateTask}
              removeTask={removeTask}
            />

            <QuickNotes />
          </div>
        </div>
      </div>
    </div>
  );
}