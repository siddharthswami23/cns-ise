import { Request, Response } from "express";
import { addRule, deleteRule, getRules, reorderRules } from "../models/firewallStore.js";
import { Rule } from "../models/types.js";

export function listRules(_req: Request, res: Response): void {
  res.json(getRules());
}

export function createRule(req: Request, res: Response): void {
  const payload = req.body as Omit<Rule, "id" | "priority">;
  if (!payload?.matchType || !payload?.value || !payload?.action) {
    res.status(400).json({ error: "Invalid rule payload" });
    return;
  }

  const inserted = addRule(payload);
  res.status(201).json(inserted);
}

export function removeRule(req: Request, res: Response): void {
  const { id } = req.params;
  deleteRule(id);
  res.status(204).send();
}

export function reorderRuleList(req: Request, res: Response): void {
  const orderedRuleIds = req.body?.ruleIds as string[] | undefined;
  if (!Array.isArray(orderedRuleIds) || orderedRuleIds.length === 0) {
    res.status(400).json({ error: "ruleIds must be a non-empty array" });
    return;
  }

  const updated = reorderRules(orderedRuleIds);
  res.json(updated);
}
