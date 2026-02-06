import express from "express";
import { registerApp, getAppUsage } from "../controllers/appController.js";
import { db } from "../db/index.js";
import { apps } from "../db/schema.js";
import { desc } from "drizzle-orm";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const rows = await db.select().from(apps).orderBy(desc(apps.created_at));
    res.json(rows || []);
  } catch (error) {
    console.error("Error fetching apps:", error);
    res.status(500).json({ error: "Failed to load apps" });
  }
});

router.post("/register", registerApp);

router.get("/usage", getAppUsage);

export default router;
