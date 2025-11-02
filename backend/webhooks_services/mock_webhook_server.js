// mock_webhook_server.js
import express from "express";

const app = express();
app.use(express.json());

// Endpoint to receive webhooks
app.post("/api/music", (req, res) => {
  console.log("🎧 Webhook received recommendations:");
  console.log(JSON.stringify(req.body, null, 2)); // Pretty print the payload
  res.json({ received: true });
});

// Run on port 4000
app.listen(4000, () => {
  console.log("🎧 Mock webhook listener running on http://localhost:4000/api/music");
});
