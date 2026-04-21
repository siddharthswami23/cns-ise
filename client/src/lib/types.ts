export type Protocol = "TCP" | "UDP";
export type RuleMatchType = "IP" | "PORT" | "PROTOCOL";
export type RuleAction = "ALLOW" | "BLOCK";

export interface Packet {
  id: string;
  sourceIp: string;
  destinationIp: string;
  port: number;
  protocol: Protocol;
  createdAt: number;
}

export interface Rule {
  id: string;
  matchType: RuleMatchType;
  value: string;
  action: RuleAction;
  priority: number;
  enabled: boolean;
}

export interface DecisionResult {
  packetId: string;
  decision: RuleAction;
  matchedRuleId: string | null;
  matchedRuleIndex: number | null;
  reason: string;
  timestamp: number;
}
