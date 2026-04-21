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

function packetDetails(packet: Packet) {
  return `${packet.sourceIp} -> ${packet.destinationIp}`;
}

function phaseLabel(phase: Phase, decision: DecisionResult | null) {
  if (phase === "INSPECTING") return "Inspecting packet against the firewall rules...";
  if (phase === "DECIDED" && decision?.decision === "ALLOW") return "Packet cleared the firewall and continues forward.";
  if (phase === "DECIDED" && decision?.decision === "BLOCK") return "Packet was denied and stopped at the firewall.";
  if (phase === "MOVING") return "Packet is moving toward the firewall.";
  return "Waiting for traffic...";
}

export function FirewallVisualizationPanel({ activePacket, phase, decision }: FirewallVisualizationPanelProps) {
  const isInspecting = phase === "INSPECTING";
  const decisionColor =
    decision?.decision === "ALLOW" ? "bg-allow" : decision?.decision === "BLOCK" ? "bg-block" : "bg-muted";
  const packetTone =
    phase === "DECIDED" && decision?.decision === "ALLOW"
      ? "from-allow to-emerald-400"
      : phase === "DECIDED" && decision?.decision === "BLOCK"
        ? "from-block to-rose-400"
        : "from-slate-500 to-slate-400";
  const packetX = phase === "MOVING" ? 280 : phase === "DECIDED" && decision?.decision === "ALLOW" ? 560 : 280;
  const trailWidth =
    phase === "IDLE"
      ? "0%"
      : phase === "MOVING"
        ? "46%"
        : phase === "DECIDED" && decision?.decision === "ALLOW"
          ? "100%"
          : "46%";

  return (
    <section className="rounded-panel border border-stone-200 bg-ivory p-4 shadow-soft">
      <h2 className="mb-3 text-xl">Firewall Visualization</h2>
      <div className="relative overflow-hidden rounded-panel border border-stone-300 bg-[radial-gradient(circle_at_top_left,_rgba(201,100,66,0.08),_transparent_35%),linear-gradient(180deg,_rgba(255,255,255,0.95),_rgba(245,244,237,0.92))] px-4 py-4">
        <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-muted">
          <span>Incoming Traffic</span>
          <span>Firewall Decision</span>
          <span>Protected Network</span>
        </div>

        <div className="relative h-64 overflow-hidden rounded-xl border border-stone-200 bg-white/80">
          <div className="absolute inset-x-5 top-1/2 h-[2px] -translate-y-1/2 bg-stone-200" />

          <motion.div
            className="absolute left-5 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-accent/70"
            initial={false}
            animate={{ width: trailWidth, opacity: phase === "IDLE" ? 0 : 1 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />

          <div className="absolute left-5 top-6 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-muted">
            Source
          </div>
          <div className="absolute right-5 top-6 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-muted">
            Destination
          </div>

          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-left">
            <div className="text-xs uppercase tracking-[0.18em] text-muted">Entry</div>
            <div className="text-sm font-medium text-ink">Packet arrives</div>
          </div>

          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-right">
            <div className="text-xs uppercase tracking-[0.18em] text-muted">Exit</div>
            <div className="text-sm font-medium text-ink">Network side</div>
          </div>

          <div className="absolute left-1/2 top-1/2 z-10 h-36 w-24 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              key={isInspecting ? "firewall-inspecting" : "firewall-resting"}
              initial={false}
              animate={{
                scale: isInspecting ? [1, 1.06, 1] : 1,
                boxShadow:
                  isInspecting
                    ? [
                        "0 0 0 rgba(201,100,66,0.12)",
                        "0 0 0 14px rgba(201,100,66,0.08)",
                        "0 0 0 rgba(201,100,66,0.12)",
                      ]
                    : "0 10px 30px rgba(20,20,19,0.08)",
              }}
              transition={{
                duration: isInspecting ? 1.1 : 0.25,
                repeat: isInspecting ? Number.POSITIVE_INFINITY : 0,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-[28px] border border-stone-400 bg-gradient-to-b from-stone-100 via-stone-200 to-stone-300"
            />
            <div className="absolute inset-x-4 top-4 h-2 rounded-full bg-stone-400/70" />
            <div className="absolute inset-x-4 bottom-4 h-2 rounded-full bg-stone-500/70" />
            <div className="absolute inset-y-8 left-1/2 w-[2px] -translate-x-1/2 bg-stone-500/60" />

          </div>

          <AnimatePresence mode="wait">
            {activePacket && (
              <motion.div
                key={activePacket.id}
                initial={{ x: 0, opacity: 0, scale: 0.92 }}
                animate={{
                  x: packetX,
                  opacity: phase === "DECIDED" && decision?.decision === "BLOCK" ? 0.22 : 1,
                  scale: phase === "INSPECTING" ? 1.06 : 1,
                  y: phase === "INSPECTING" ? -6 : 0,
                }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.85, ease: "easeInOut" }}
                className="absolute left-5 top-1/2 z-20 -translate-y-1/2"
              >
                <div className={`rounded-2xl bg-gradient-to-r ${packetTone} px-4 py-3 text-white shadow-lg`}>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">Packet</div>
                  <div className="text-sm font-semibold">{packetLabel(activePacket)}</div>
                  <div className="mt-1 text-[11px] text-white/80">{packetDetails(activePacket)}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
            <div className="min-w-0 rounded-xl border border-stone-200 bg-white/90 px-3 py-2 text-xs text-muted shadow-sm">
              {decision?.reason ?? phaseLabel(phase, decision)}
            </div>
            <div className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${decisionColor}`}>
              {phase === "IDLE"
                ? "IDLE"
                : phase === "MOVING"
                  ? "TRANSIT"
                  : phase === "INSPECTING"
                    ? "CHECKING"
                    : decision?.decision ?? "DECIDED"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
