import express from "express";
import { prisma } from "../db/prismaClient";
import redisClient from "../config/redis";

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

router.get("/deep", async (req, res) => {
  try {
    // Example Postgres check
    await prisma.$queryRaw`SELECT 1`;

    // Example Redis check
    await redisClient.ping();

    res.status(200).json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ status: "error", message: (error as Error).message });
  }
});

export default router;