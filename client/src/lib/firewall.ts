import { DecisionResult, Packet, Rule } from "./types";

const normalizeIp = (value: string) => value.trim();

function packetMatchesRule(packet: Packet, rule: Rule): boolean {
  if (!rule.enabled) return false;

  if (rule.matchType === "PORT") {
    return packet.port === Number(rule.value);
  }

  if (rule.matchType === "PROTOCOL") {
    return packet.protocol.toUpperCase() === rule.value.toUpperCase();
  }

  const packetIps = [normalizeIp(packet.sourceIp), normalizeIp(packet.destinationIp)];
  return packetIps.includes(normalizeIp(rule.value));
}

export function evaluatePacket(packet: Packet, rules: Rule[]): DecisionResult {
  const sorted = [...rules].sort((a, b) => a.priority - b.priority);

  for (let i = 0; i < sorted.length; i += 1) {
    const rule = sorted[i];
    if (packetMatchesRule(packet, rule)) {
      return {
        packetId: packet.id,
        decision: rule.action,
        matchedRuleId: rule.id,
        matchedRuleIndex: i,
        reason: `${rule.action} due to rule #${i + 1} (${rule.matchType} = ${rule.value})`,
        timestamp: Date.now(),
      };
    }
  }

  return {
    packetId: packet.id,
    decision: "BLOCK",
    matchedRuleId: null,
    matchedRuleIndex: null,
    reason: "BLOCK due to default policy (no rule match)",
    timestamp: Date.now(),
  };
}

export function generateRandomPacket(): Packet {
  const protocol = Math.random() > 0.5 ? "TCP" : "UDP";
  const sourceIp = `192.168.1.${Math.floor(Math.random() * 240) + 10}`;
  const destinationIp = `10.0.0.${Math.floor(Math.random() * 240) + 10}`;
  const portPool = [22, 53, 80, 443, 8080, 3306];
  const port = portPool[Math.floor(Math.random() * portPool.length)];

  return {
    id: crypto.randomUUID(),
    sourceIp,
    destinationIp,
    port,
    protocol,
    createdAt: Date.now(),
  };
}
