import { Router } from "express";
import { createRule, listRules, removeRule, reorderRuleList } from "../controllers/rulesController.js";

export const ruleRoutes = Router();

ruleRoutes.get("/rules", listRules);
ruleRoutes.post("/rules", createRule);
ruleRoutes.delete("/rules/:id", removeRule);
ruleRoutes.put("/rules/reorder", reorderRuleList);
