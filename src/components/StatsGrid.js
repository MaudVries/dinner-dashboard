export default function StatsGrid({ stats }) {
    return (
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5"
          >
            <div className="text-sm text-stone-500">{stat.label}</div>
            <div className="text-3xl font-semibold mt-2">{stat.value}</div>
          </div>
        ))}
      </div>
    );
  }