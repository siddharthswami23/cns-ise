import { DecisionResult, Packet } from "../lib/types";

interface ActivityTimelineProps {
  logs: Array<{ packet: Packet; result: DecisionResult }>;
}

export function ActivityTimeline({ logs }: ActivityTimelineProps) {
  return (
    <div className="rounded-panel  border border-stone-200 bg-ivory p-4 shadow-soft">
      <h3 className=" text-lg">Activity Timeline</h3>
      <div className="mt-3 max-h-[35vh] space-y-2 overflow-y-auto pr-1 text-sm">
        {logs.length === 0 && <div className="text-muted">No traffic yet. Send a packet to start.</div>}
        {logs.map(({ packet, result }) => (
          <div key={result.packetId + result.timestamp} className="rounded-lg border border-stone-300 bg-white p-2">
            <div className="font-medium">
              {packet.sourceIp} → {packet.destinationIp} ({packet.protocol}:{packet.port})
            </div>
            <div className={result.decision === "ALLOW" ? "text-allow" : "text-block"}>{result.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
