import { Router } from "express";
import { listLogs, simulatePacket } from "../controllers/simulationController.js";

export const simulationRoutes = Router();

simulationRoutes.post("/simulate", simulatePacket);
simulationRoutes.get("/logs", listLogs);
