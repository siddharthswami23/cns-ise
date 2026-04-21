interface Stats {
  total: number;
  allowed: number;
  blocked: number;
}

interface StatsPanelProps {
  stats: Stats;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="rounded-panel border border-stone-200 bg-ivory p-4 shadow-soft">
      <h3 className=" text-lg">Stats</h3>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg border border-stone-300 bg-white p-2">
          <div className="text-muted">Total</div>
          <div className="text-xl">{stats.total}</div>
        </div>
        <div className="rounded-lg border border-stone-300 bg-white p-2">
          <div className="text-muted">Allowed</div>
          <div className="text-xl text-allow">{stats.allowed}</div>
        </div>
        <div className="rounded-lg border border-stone-300 bg-white p-2">
          <div className="text-muted">Blocked</div>
          <div className="text-xl text-block">{stats.blocked}</div>
        </div>
      </div>
    </div>
  );
}
