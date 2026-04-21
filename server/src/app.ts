import cors from "cors";
import express from "express";
import { healthRoutes } from "./routes/healthRoutes.js";
import { ruleRoutes } from "./routes/ruleRoutes.js";
import { simulationRoutes } from "./routes/simulationRoutes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use(healthRoutes);
app.use(ruleRoutes);
app.use(simulationRoutes);
