import express from "express";
import db from "../db/webhookdb.js";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  const { project_id, item_title, user_id } = req.body;
  const apiKey = req.headers["x-api-key"];

  console.log("📥 Incoming request:", { project_id, item_title, user_id });

  if (!apiKey) {
    console.log("❌ Missing API key");
    return res.status(401).json({ error: "Missing API key" });
  }

  try {
    // 1️⃣ Validate API key
    console.log("🔑 Validating API key...");
    const app = await db.get("SELECT * FROM apps WHERE api_key = ?", [apiKey]);
    if (!app) {
      console.log("❌ Invalid API key");
      return res.status(403).json({ error: "Invalid API key" });
    }
    console.log("✅ API key valid for app:", app.app_name);

    // 2️⃣ Call FastAPI recommender
    const fastapiUrl = `http://localhost:8000/project/${project_id}/recommendations`;
    const params = {};
    if (item_title) params.item_title = item_title;
    if (user_id) params.user_id = user_id;

    console.log("📡 Calling FastAPI:", fastapiUrl, params);
    const recRes = await axios.get(fastapiUrl, { params });
    const recData = recRes.data;
    console.log("✅ FastAPI response:", Object.keys(recData));

    // 3️⃣ Log usage
    await db.run(
      `INSERT INTO usage (app_name, usage_count)
       VALUES (?, 1)
       ON CONFLICT(app_name)
       DO UPDATE SET usage_count = usage_count + 1;`,
      [app.app_name]
    );

    // 4️⃣ Send response to frontend (so UI shows it!)
    res.json({
      success: true,
      app_name: app.app_name,
      model_type: recData.model_type || recData.data?.model_type || "content",
      recommendations: recData.recommendations || recData.data?.recommendations || [],
    });

    // 5️⃣ Send webhook notification asynchronously
    axios.post(app.webhook_url, {
      success: true,
      app_name: app.app_name,
      model_type: recData.model_type || recData.data?.model_type || "content",
      recommendations: recData.recommendations || recData.data?.recommendations || [],
    })
      .then(() => console.log(`✅ Webhook sent to ${app.webhook_url}`))
      .catch((err) => console.warn(`⚠️ Webhook push failed: ${err.message}`));
  } catch (err) {
    console.error("🚨 Recommend route error:", err);
    
    // Handle axios errors specifically
    if (err.response) {
      const status = err.response.status;
      const errorData = err.response.data;
      console.error("❌ FastAPI error:", status, errorData);
      
      if (status === 404) {
        return res.status(404).json({ 
          error: "Project not found or not ready", 
          details: errorData?.detail || "The project ID you specified doesn't exist or isn't ready" 
        });
      }
      
      return res.status(status).json({ 
        error: "Failed to get recommendations", 
        details: errorData?.detail || err.message 
      });
    }
    
    res.status(500).json({ error: "Failed to get recommendations", details: err.message });
  }
});

export default router;
