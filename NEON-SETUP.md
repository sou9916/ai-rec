# Neon Setup (One Database, Separate Schemas)

Use one Neon PostgreSQL database with schemas: `auth`, `webhooks`, `recommender`. MLflow uses the default schema.

---

## 1. Get the connection string

1. Go to [console.neon.tech](https://console.neon.tech) → sign in.
2. Create or open a project → **Connection details**.
3. Copy the connection string (starts with `postgresql://`). **Keep** `?sslmode=require` at the end.

Example: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

---

## 2. One-time schema setup

From the project root (folder containing `backend`, `frontend`, `scripts`):

```bash
cd backend/webhooks_services
npm install
```

Then run (replace `YOUR_NEON_CONNECTION_STRING` with your URL):

**Windows (PowerShell):**
```powershell
$env:DATABASE_URL="YOUR_NEON_CONNECTION_STRING"
node ../../scripts/init-neon-schemas.mjs
```

**Mac/Linux:**
```bash
DATABASE_URL="YOUR_NEON_CONNECTION_STRING" node ../../scripts/init-neon-schemas.mjs
```

You should see: `✅ Schemas created: auth, webhooks, recommender`.

---

## 3. Configure `.env` files

Use the **same** Neon connection string everywhere.

| Service | File | Contents |
|--------|------|----------|
| Auth | `backend/auth/.env` | `PORT=8080`<br>`DATABASE_URL=YOUR_NEON_CONNECTION_STRING`<br>`JWT_SECRET=your-strong-secret` |
| Webhooks | `backend/webhooks_services/.env` | `PORT=3001`<br>`DATABASE_URL=YOUR_NEON_CONNECTION_STRING` |
| Back2 (ML) | `backend/back2/.env` | `DATABASE_URL=YOUR_NEON_CONNECTION_STRING`<br>`MLFLOW_TRACKING_URI=YOUR_NEON_CONNECTION_STRING` |

Use a file named **`.env`** (lowercase), not `.ENV`.

---

## 4. Start services

See **[README.md](README.md#execution-steps-run-in-order)** for full steps. In short:

| Terminal | Directory | Command |
|----------|------------|---------|
| 1 | `backend/auth` | `npm install` then `npm start` |
| 2 | `backend/back2` | `pip install -r requirements.txt` then `uvicorn saas_api:app --reload` |
| 3 | `backend/webhooks_services` | `npm install` then `npm start` |
| 4 | `frontend/s` | `npm install` then `npm run dev` |

Open **http://localhost:5173**. Sign up, create a project, register an app → all data goes to Neon.

---

## 5. Optional: MLflow UI

```bash
cd backend/back2
# Set MLFLOW_TRACKING_URI to your Neon URL (or use .env)
mlflow ui --backend-store-uri $env:MLFLOW_TRACKING_URI --default-artifact-root ./mlflow_artifacts
```
Then open **http://localhost:5000**. (On Mac/Linux use `$MLFLOW_TRACKING_URI` after `export`.)

---

## Troubleshooting

- **"Set DATABASE_URL"** → Set `DATABASE_URL` in the same terminal before running the schema script; use the full URL including `?sslmode=require`.
- **Connection / SSL error** → No extra spaces in the URL; keep `?sslmode=require`.
- **Webhooks/auth not loading DB** → File must be named `.env` (lowercase).
- **Schema script not found** → Run from `backend/webhooks_services`; the script path is `../../scripts/init-neon-schemas.mjs`.
