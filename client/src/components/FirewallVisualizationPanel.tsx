import { AnimatePresence, motion } from "framer-motion";
import { DecisionResult, Packet } from "../lib/types";

type Phase = "IDLE" | "MOVING" | "INSPECTING" | "DECIDED";

interface FirewallVisualizationPanelProps {
  activePacket: Packet | null;
  phase: Phase;
  decision: DecisionResult | null;
}

function packetLabel(packet: Packet) {
  return `${packet.protocol}:${packet.port}`;
}

export function FirewallVisualizationPanel({ activePacket, phase, decision }: FirewallVisualizationPanelProps) {
  const decisionColor =
    decision?.decision === "ALLOW" ? "bg-allow" : decision?.decision === "BLOCK" ? "bg-block" : "bg-muted";

  return (
    <section className="rounded-panel border border-stone-200 bg-ivory p-4 shadow-soft">
      <h2 className="mb-3  text-xl">Firewall Visualization</h2>
      <div className="relative h-56 rounded-panel border border-stone-300 bg-white/70 px-4">
        <div className="absolute left-2 right-2 top-1/2 h-[2px] -translate-y-1/2 bg-stone-300" />

        <motion.div
          animate={{ scale: phase === "INSPECTING" ? 1.06 : 1 }}
          className="absolute left-1/2 top-1/2 z-10 h-24 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-stone-500 bg-stone-200"
        />

        <AnimatePresence>
          {activePacket && (
            <motion.div
              key={activePacket.id}
              initial={{ x: 0, opacity: 0 }}
              animate={{
                x: phase === "MOVING" ? 260 : phase === "DECIDED" && decision?.decision === "ALLOW" ? 500 : 260,
                opacity: phase === "DECIDED" && decision?.decision === "BLOCK" ? 0.2 : 1,
                scale: phase === "INSPECTING" ? 1.1 : 1,
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className={`absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-semibold text-white ${phase === "IDLE" || phase === "MOVING" ? "bg-muted" : decisionColor}`}
            >
              {packetLabel(activePacket)}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-3 left-3 text-xs text-muted">
          {phase === "INSPECTING" ? "Inspecting packet..." : decision?.reason ?? "Waiting for traffic..."}
        </div>
      </div>
    </section>
  );
}
