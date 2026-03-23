export default function BudgetOverview({
    budget,
    spentDrank,
    spentEten,
    drankBudgetPct,
    etenBudgetPct,
    isOverBudget,
    phaseTotals,
  }) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5">
        <h2 className="text-2xl font-semibold">Budget overzicht</h2>
        <p className="text-stone-500 text-sm mt-1">
          Bekijk hoeveel van je budget al naar drank en eten is gegaan.
        </p>
  
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">Budgetverdeling</span>
            <span className={isOverBudget ? "text-red-600 font-semibold" : ""}>
              € {(spentDrank + spentEten).toFixed(2)} van € {budget.toFixed(2)} uitgegeven
            </span>
          </div>
  
          <div className="relative h-6 rounded-full border border-stone-200 bg-stone-100 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full"
              style={{
                width: `${drankBudgetPct}%`,
                backgroundColor: isOverBudget ? "#dc2626" : "#ef4444",
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(255,255,255,0.95) 0 6px, rgba(255,255,255,0) 6px 12px)",
              }}
            />
  
            <div
              className="absolute top-0 h-full"
              style={{
                left: `${drankBudgetPct}%`,
                width: `${etenBudgetPct}%`,
                backgroundColor: "#ef4444",
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.95) 1.2px, transparent 1.2px)",
                backgroundSize: "10px 10px",
              }}
            />
          </div>
  
          {isOverBudget && (
            <div className="mt-2 text-sm text-red-600 font-medium">
              ⚠️ Je zit over je budget
            </div>
          )}
  
          <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-3 py-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-4 w-4 rounded-sm border border-red-500"
                  style={{
                    backgroundColor: isOverBudget ? "#dc2626" : "#ef4444",
                    backgroundImage:
                      "repeating-linear-gradient(45deg, rgba(255,255,255,0.95) 0 6px, rgba(255,255,255,0) 6px 12px)",
                  }}
                />
                <span>Drank</span>
              </div>
              <span>
                € {spentDrank.toFixed(2)} · {drankBudgetPct.toFixed(0)}%
              </span>
            </div>
  
            <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-3 py-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-4 w-4 rounded-sm border border-red-500"
                  style={{
                    backgroundColor: "#ef4444",
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.95) 1.2px, transparent 1.2px)",
                    backgroundSize: "10px 10px",
                  }}
                />
                <span>Eten</span>
              </div>
              <span>
                € {spentEten.toFixed(2)} · {etenBudgetPct.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
  
        <div className="mt-6 grid md:grid-cols-2 gap-3">
          {phaseTotals.map((entry) => (
            <div
              key={entry.phase}
              className="rounded-2xl border border-stone-200 p-3 bg-stone-50"
            >
              <div className="text-sm text-stone-500">{entry.phase}</div>
              <div className="text-lg font-semibold mt-1">
                € {entry.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }