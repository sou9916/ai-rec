import axios from "axios";
import db from "../db/webhookdb.js";

export const registerWebhook = async (req, res) => {
  try {
    const { app_name, webhook_url } = req.body;
    if (!app_name || !webhook_url)
      return res.status(400).json({ error: "Missing app_name or webhook_url" });

    // Use the centralized apps table
    const result = await db.run("INSERT INTO webhooks.apps (app_name, webhook_url) VALUES ($1, $2) RETURNING id", [app_name, webhook_url]);
    res.json({ id: result.lastID, message: "Webhook registered successfully" });
  } catch (err) {
    console.error("registerWebhook error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const listWebhooks = async (req, res) => {
  try {
    const rows = await db.all("SELECT * FROM webhooks.apps", []);
    res.json(rows);
  } catch (err) {
    console.error("listWebhooks error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const triggerWebhooks = async (req, res) => {
  try {
    const { event, data } = req.body;
    const rows = await db.all("SELECT webhook_url FROM webhooks.apps", []);

    const results = [];
    for (const { webhook_url } of rows) {
      try {
        await axios.post(webhook_url, { event, data });
        results.push({ webhook_url, status: "success" });
      } catch (error) {
        results.push({ webhook_url, status: "failed", error: error.message });
      }
    }
    res.json({ message: "Webhooks triggered", results });
  } catch (err) {
    console.error("triggerWebhooks error:", err);
    res.status(500).json({ error: err.message });
  }
};
