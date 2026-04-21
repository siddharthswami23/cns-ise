import { useEffect, useMemo, useState } from "react";
import { ActivityTimeline } from "../components/ActivityTimeline";
import { FirewallVisualizationPanel } from "../components/FirewallVisualizationPanel";
import { RulesPanel } from "../components/RulesPanel";
import { StatsPanel } from "../components/StatsPanel";
import { TrafficInputPanel } from "../components/TrafficInputPanel";
import { evaluatePacket, generateRandomPacket } from "../lib/firewall";
import { DecisionResult, Packet, Protocol, Rule, RuleAction, RuleMatchType } from "../lib/types";

type Mode = "MANUAL" | "AUTO" | "ATTACK";
type Phase = "IDLE" | "MOVING" | "INSPECTING" | "DECIDED";

const initialRules: Rule[] = [
  { id: crypto.randomUUID(), matchType: "PORT", value: "22", action: "BLOCK", priority: 1, enabled: true },
  { id: crypto.randomUUID(), matchType: "PROTOCOL", value: "TCP", action: "ALLOW", priority: 2, enabled: true },
];

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

function reprioritize(rules: Rule[]): Rule[] {
  return rules.map((rule, index) => ({ ...rule, priority: index + 1 }));
}

function sortRulesByPriority(input: Rule[]) {
  return [...input].sort((a, b) => a.priority - b.priority);
}

async function evaluateThroughApi(packet: Packet, sortedRules: Rule[]): Promise<DecisionResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(packet),
    });

    if (!response.ok) {
      return evaluatePacket(packet, sortedRules);
    }

    const data = (await response.json()) as Omit<DecisionResult, "matchedRuleIndex" | "timestamp">;
    return {
      ...data,
      matchedRuleIndex: data.matchedRuleId ? sortedRules.findIndex((rule) => rule.id === data.matchedRuleId) : null,
      timestamp: Date.now(),
    };
  } catch {
    return evaluatePacket(packet, sortedRules);
  }
}

export function FirewallSimulatorPage() {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [mode, setMode] = useState<Mode>("MANUAL");
  const [queue, setQueue] = useState<Packet[]>([]);
  const [activePacket, setActivePacket] = useState<Packet | null>(null);
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [decision, setDecision] = useState<DecisionResult | null>(null);
  const [activeRuleIndex, setActiveRuleIndex] = useState<number | null>(null);

  const [packetInput, setPacketInput] = useState({
    sourceIp: "192.168.1.15",
    destinationIp: "10.0.0.88",
    port: "443",
    protocol: "TCP" as Protocol,
  });

  const [newRule, setNewRule] = useState({
    matchType: "PORT" as RuleMatchType,
    value: "",
    action: "BLOCK" as RuleAction,
  });

  const [logs, setLogs] = useState<Array<{ packet: Packet; result: DecisionResult }>>([]);
  const [stats, setStats] = useState({ total: 0, allowed: 0, blocked: 0 });

  const sortedRules = useMemo(() => [...rules].sort((a, b) => a.priority - b.priority), [rules]);

  useEffect(() => {
    async function loadRules() {
      try {
        const response = await fetch(`${API_BASE_URL}/rules`);
        if (!response.ok) return;
        const serverRules = (await response.json()) as Rule[];
        if (serverRules.length > 0) {
          setRules(sortRulesByPriority(serverRules));
        }
      } catch {
        // Local fallback mode if backend is not reachable.
      }
    }

    void loadRules();
  }, []);

  useEffect(() => {
    if (mode === "MANUAL") return;

    const ms = mode === "AUTO" ? 1700 : 450;
    const handle = window.setInterval(() => {
      setQueue((prev) => [...prev, generateRandomPacket()]);
    }, ms);

    return () => window.clearInterval(handle);
  }, [mode]);

  useEffect(() => {
    if (activePacket || queue.length === 0) return;
    setActivePacket(queue[0]);
    setQueue((prev) => prev.slice(1));
  }, [queue, activePacket]);

  useEffect(() => {
    if (!activePacket) return;

    setPhase("MOVING");
    let cancelled = false;
    let resolveTimer: number | null = null;
    let finishTimer: number | null = null;

    const inspectTimer = window.setTimeout(() => {
      setPhase("INSPECTING");

      void evaluateThroughApi(activePacket, sortedRules).then((result) => {
        if (cancelled) return;
        setDecision(result);
        setActiveRuleIndex(result.matchedRuleIndex);

        resolveTimer = window.setTimeout(() => {
          if (cancelled) return;
          setPhase("DECIDED");

          finishTimer = window.setTimeout(() => {
            if (cancelled) return;
            setLogs((prev) => [{ packet: activePacket, result }, ...prev].slice(0, 20));
            setStats((prev) => ({
              total: prev.total + 1,
              allowed: prev.allowed + (result.decision === "ALLOW" ? 1 : 0),
              blocked: prev.blocked + (result.decision === "BLOCK" ? 1 : 0),
            }));

            setActivePacket(null);
            setDecision(null);
            setActiveRuleIndex(null);
            setPhase("IDLE");
          }, 700);
        }, 650);
      });
    }, 1000);

    return () => {
      cancelled = true;
      window.clearTimeout(inspectTimer);
      if (resolveTimer) window.clearTimeout(resolveTimer);
      if (finishTimer) window.clearTimeout(finishTimer);
    };
  }, [activePacket, sortedRules]);

  function enqueuePacket(packet: Packet) {
    setQueue((prev) => [...prev, packet]);
  }

  function handleManualSend() {
    enqueuePacket({
      id: crypto.randomUUID(),
      sourceIp: packetInput.sourceIp,
      destinationIp: packetInput.destinationIp,
      port: Number(packetInput.port),
      protocol: packetInput.protocol,
      createdAt: Date.now(),
    });
  }

  function addRule() {
    if (!newRule.value.trim()) return;

    const draftRule = {
      matchType: newRule.matchType,
      value: newRule.value.trim(),
      action: newRule.action,
      enabled: true,
    };

    void (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/rules`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draftRule),
        });

        if (response.ok) {
          const inserted = (await response.json()) as Rule;
          setRules((prev) => reprioritize([...prev, inserted]));
        } else {
          setRules((prev) =>
            reprioritize([
              ...prev,
              {
                id: crypto.randomUUID(),
                matchType: draftRule.matchType,
                value: draftRule.value,
                action: draftRule.action,
                priority: prev.length + 1,
                enabled: true,
              },
            ])
          );
        }
      } catch {
        setRules((prev) =>
          reprioritize([
            ...prev,
            {
              id: crypto.randomUUID(),
              matchType: draftRule.matchType,
              value: draftRule.value,
              action: draftRule.action,
              priority: prev.length + 1,
              enabled: true,
            },
          ])
        );
      }
    })();

    setNewRule((prev) => ({ ...prev, value: "" }));
  }

  function removeRule(id: string) {
    void fetch(`${API_BASE_URL}/rules/${id}`, { method: "DELETE" }).catch(() => undefined);
    setRules((prev) => reprioritize(prev.filter((rule) => rule.id !== id)));
  }

  function moveRule(ruleIndex: number, direction: -1 | 1) {
    const target = ruleIndex + direction;
    if (target < 0 || target >= sortedRules.length) return;

    const copied = [...sortedRules];
    const [rule] = copied.splice(ruleIndex, 1);
    copied.splice(target, 0, rule);

    const nextRules = reprioritize(copied);
    setRules(nextRules);
    void fetch(`${API_BASE_URL}/rules/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ruleIds: nextRules.map((item) => item.id) }),
    }).catch(() => undefined);
  }

  return (
    <div className="min-h-screen bg-parchment p-6 text-ink">
      <header className="mb-6">
        <h1 className=" text-3xl font-medium">Interactive Firewall Simulator</h1>
        <p className="mt-2 text-sm text-muted">Watch packet decisions unfold rule-by-rule in real time.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_1.6fr_1.1fr]">
        <TrafficInputPanel
          packetInput={packetInput}
          mode={mode}
          onPacketInputChange={setPacketInput}
          onSendPacket={handleManualSend}
          onRandomPacket={() => enqueuePacket(generateRandomPacket())}
          onModeChange={setMode}
        />

        <FirewallVisualizationPanel activePacket={activePacket} phase={phase} decision={decision} />

        <RulesPanel
          newRule={newRule}
          sortedRules={sortedRules}
          activeRuleIndex={activeRuleIndex}
          onNewRuleChange={setNewRule}
          onAddRule={addRule}
          onMoveRule={moveRule}
          onRemoveRule={removeRule}
        />
      </div>

      <section className="mt-4 h-[40vh] grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_2fr]">
        <StatsPanel stats={stats} />
        <ActivityTimeline logs={logs} />
      </section>
    </div>
  );
}
