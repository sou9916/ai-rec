import express from "express";
import { registerApp, getAppUsage } from "../controllers/appController.js";
import db from "../db/webhookdb.js";

const router = express.Router();

// ✅ Get all registered apps
router.get("/", async (req, res) => {
  try {
    const apps = await db.all("SELECT * FROM webhooks.apps ORDER BY created_at DESC", []);
    res.json(apps || []);
  } catch (error) {
    console.error("Error fetching apps:", error);
    res.status(500).json({ error: "Failed to load apps" });
  }
});

// ✅ Register new app
router.post("/register", registerApp);

// ✅ Get usage
router.get("/usage", getAppUsage);

export default router;
