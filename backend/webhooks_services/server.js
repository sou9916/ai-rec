import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from "./db/webhookdb.js";
import webhookRoutes from "./routes/webhooks.js";
import appRoutes from "./routes/apps.js";
import recommendRoutes from "./routes/recommend.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// ✅ Mount both route groups
app.use("/api/webhooks", webhookRoutes);
app.use("/api/apps", appRoutes);
app.use("/api/recommend", recommendRoutes);


app.get("/", (req, res) => res.send("Webhook service running 🚀"));

app.listen(PORT, () =>
  console.log(`✅ Webhook service running at http://localhost:${PORT}`)
);

(async () => {
  const apps = await db.all("SELECT * FROM apps");
  console.log("🔍 Existing apps in DB:", apps);
})();