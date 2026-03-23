export default function DashboardHeader({
  guestCount,
  setGuestCount,
  budget,
  setBudget,
}) {
  return (
    <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-red-500">
          06/06/2026
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          23 Dinner Dashboard
        </h1>
        <p className="mt-2 text-stone-500">
          Voor budget, boodschappen- en To Do lijst — allemaal op één plek.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:flex md:gap-4">
        <div className="min-w-[140px] rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-stone-500">Gasten</div>
          <input
            type="number"
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2 text-xl font-semibold"
          />
        </div>

        <div className="min-w-[140px] rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-stone-500">Budget (€)</div>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2 text-xl font-semibold"
          />
        </div>
      </div>
    </div>
  );
}