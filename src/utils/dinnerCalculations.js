import { PHASES } from "../data/phases";

export function getTotalSpent(items) {
  return items
    .filter((item) => item.bought)
    .reduce((sum, item) => sum + Number(item.qty) * Number(item.price), 0);
}

export function getSpentDrank(items) {
  return items
    .filter((item) => item.bought && item.category === "Drank")
    .reduce((sum, item) => sum + Number(item.qty) * Number(item.price), 0);
}

export function getSpentEten(items) {
  return items
    .filter(
      (item) =>
        item.bought && (item.category === "Eten" || item.category === "Food")
    )
    .reduce((sum, item) => sum + Number(item.qty) * Number(item.price), 0);
}

export function getGroupedByPhase(items) {
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.phase]) {
      acc[item.phase] = {
        phase: item.phase,
        drank: [],
        eten: [],
      };
    }

    if (item.category === "Drank") {
      acc[item.phase].drank.push(item);
    } else if (item.category === "Eten" || item.category === "Food") {
      acc[item.phase].eten.push(item);
    }

    return acc;
  }, {});

  return PHASES
    .filter((phase) => grouped[phase])
    .map((phase) => ({
      ...grouped[phase],
      drank: [...grouped[phase].drank].sort(
        (a, b) => Number(a.bought) - Number(b.bought)
      ),
      eten: [...grouped[phase].eten].sort(
        (a, b) => Number(a.bought) - Number(b.bought)
      ),
    }));
}

export function getPhaseTotals(items) {
  return PHASES.map((phase) => ({
    phase,
    total: items
      .filter((item) => item.phase === phase)
      .reduce((sum, item) => sum + Number(item.qty) * Number(item.price), 0),
  }));
}

export function getBoughtCount(items) {
  return items.filter((item) => item.bought).length;
}

export function getProgress(items) {
  const boughtCount = getBoughtCount(items);
  return Math.round((boughtCount / items.length) * 100) || 0;
}

export function getDoneTasks(tasks) {
  return tasks.filter((task) => task.completed).length;
}

export function getSortedTasks(tasks) {
  return [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));
}