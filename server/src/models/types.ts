export type Protocol = "TCP" | "UDP";
export type RuleMatchType = "IP" | "PORT" | "PROTOCOL";
export type RuleAction = "ALLOW" | "BLOCK";

export interface Packet {
  id: string;
  sourceIp: string;
  destinationIp: string;
  port: number;
  protocol: Protocol;
}

export interface Rule {
  id: string;
  matchType: RuleMatchType;
  value: string;
  action: RuleAction;
  priority: number;
  enabled: boolean;
}

export interface Decision {
  packetId: string;
  decision: RuleAction;
  matchedRuleId: string | null;
  reason: string;
}

export interface LogEntry {
  packet: Packet;
  result: Decision;
  createdAt: string;
}
