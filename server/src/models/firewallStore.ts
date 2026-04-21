import { Decision, LogEntry, Packet, Rule } from "./types.js";

let memoryRules: Rule[] = [
  { id: crypto.randomUUID(), matchType: "PORT", value: "22", action: "BLOCK", priority: 1, enabled: true },
  { id: crypto.randomUUID(), matchType: "PROTOCOL", value: "TCP", action: "ALLOW", priority: 2, enabled: true },
];

const memoryLogs: LogEntry[] = [];

export function sortRules(inputRules: Rule[]): Rule[] {
  return [...inputRules].sort((a, b) => a.priority - b.priority);
}

export function getRules(): Rule[] {
  return sortRules(memoryRules);
}

export function addRule(payload: Omit<Rule, "id" | "priority">): Rule {
  const nextRule: Rule = {
    id: crypto.randomUUID(),
    matchType: payload.matchType,
    value: payload.value,
    action: payload.action,
    enabled: payload.enabled ?? true,
    priority: memoryRules.length + 1,
  };

  memoryRules = [...memoryRules, nextRule];
  return nextRule;
}

export function deleteRule(ruleId: string): void {
  memoryRules = memoryRules
    .filter((rule) => rule.id !== ruleId)
    .map((rule, index) => ({ ...rule, priority: index + 1 }));
}

export function reorderRules(orderedRuleIds: string[]): Rule[] {
  const map = new Map(memoryRules.map((rule) => [rule.id, rule]));
  const nextRules: Rule[] = [];

  for (let i = 0; i < orderedRuleIds.length; i += 1) {
    const found = map.get(orderedRuleIds[i]);
    if (found) {
      nextRules.push({ ...found, priority: i + 1 });
    }
  }

  memoryRules = nextRules;
  return getRules();
}

function matchRule(packet: Packet, rule: Rule): boolean {
  if (!rule.enabled) return false;
  if (rule.matchType === "PORT") return packet.port === Number(rule.value);
  if (rule.matchType === "PROTOCOL") return packet.protocol.toUpperCase() === rule.value.toUpperCase();
  return [packet.sourceIp, packet.destinationIp].includes(rule.value);
}

export function evaluatePacket(packet: Packet): Decision {
  const orderedRules = getRules();

  for (let i = 0; i < orderedRules.length; i += 1) {
    const rule = orderedRules[i];
    if (matchRule(packet, rule)) {
      return {
        packetId: packet.id,
        decision: rule.action,
        matchedRuleId: rule.id,
        reason: `${rule.action} due to rule #${i + 1} (${rule.matchType} = ${rule.value})`,
      };
    }
  }

  return {
    packetId: packet.id,
    decision: "BLOCK",
    matchedRuleId: null,
    reason: "BLOCK due to default policy (no rule match)",
  };
}

export function addLog(packet: Packet, result: Decision): void {
  memoryLogs.unshift({ packet, result, createdAt: new Date().toISOString() });
  memoryLogs.splice(40);
}

export function getLogs(): LogEntry[] {
  return memoryLogs;
}
