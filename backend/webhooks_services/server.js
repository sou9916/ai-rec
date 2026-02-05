import "./loadEnv.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { db, ready } from "./db/index.js";
import webhookRoutes from "./routes/webhooks.js";
import appRoutes from "./routes/apps.js";
import recommendRoutes from "./routes/recommend.js";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/webhooks", webhookRoutes);
app.use("/api/apps", appRoutes);
app.use("/api/recommend", recommendRoutes);

app.get("/", (req, res) => res.send("Webhook service running 🚀"));

(async () => {
  await ready;
  app.listen(PORT, () =>
    console.log(`Webhook service running at http://localhost:${PORT}`)
  );
})();