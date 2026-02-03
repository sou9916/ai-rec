import crypto from "crypto";
import db from "../db/webhookdb.js";

// ✅ Register a new external app
export const registerApp = async (req, res) => {
  try {
    const { app_name, webhook_url } = req.body;

    if (!app_name || !webhook_url) {
      return res
        .status(400)
        .json({ error: "App name and webhook URL are required" });
    }

    const apiKey = crypto.randomBytes(16).toString("hex");

    await db.run(
      "INSERT INTO webhooks.apps (app_name, webhook_url, api_key) VALUES ($1, $2, $3) RETURNING id",
      [app_name, webhook_url, apiKey]
    );

    console.log("✅ App registered:", { app_name, webhook_url, apiKey });

    res.json({
      success: true,
      message: "App registered successfully",
      app_name,
      webhook_url,
      api_key: apiKey, // 👈 make sure this key is spelled exactly like this
    });
  } catch (err) {
    console.error("❌ registerApp error:", err);
    res.status(500).json({ error: "Failed to register app" });
  }
};

// ✅ Simple dummy analytics route
export const getAppUsage = async (req, res) => {
  try {
    const usage = await db.all("SELECT * FROM webhooks.usage", []);
    res.json(usage || []);
  } catch (error) {
    console.error("getAppUsage error:", error);
    res.status(500).json({ error: "Failed to get app usage" });
  }
};
