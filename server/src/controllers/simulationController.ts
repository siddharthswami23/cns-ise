import { Request, Response } from "express";
import { addLog, evaluatePacket, getLogs } from "../models/firewallStore.js";
import { Packet } from "../models/types.js";

export function simulatePacket(req: Request, res: Response): void {
  const packet = req.body as Packet;

  if (!packet?.id || !packet?.sourceIp || !packet?.destinationIp || !packet?.protocol || !packet?.port) {
    res.status(400).json({ error: "Invalid packet payload" });
    return;
  }

  const result = evaluatePacket(packet);
  addLog(packet, result);
  res.json(result);
}

export function listLogs(_req: Request, res: Response): void {
  res.json(getLogs());
}
