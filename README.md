# AiREC – Recommender as a Service

A full-stack **recommendation platform** with ML models (content-based, collaborative, hybrid), webhook notifications, and auth. Upload datasets, train models, register external apps with API keys, and get recommendations via the web UI or REST API.

---

## Prerequisites

- **Node.js** (v18+)
- **Python** (3.9+)
- **PostgreSQL** (local or [Neon](https://neon.tech))

---

## Project structure

```
ai-rec/
├── backend/
│   ├── auth/              # Auth API (login, signup, JWT)
│   ├── back2/             # FastAPI ML recommender + MLflow
│   └── webhooks_services/ # App registration + webhooks + recommend proxy
├── frontend/s/            # React (Vite) dashboard
├── xternal_client/        # Demo clients (MovieRec, MusicRec)
├── scripts/               # One-time DB schema setup (Neon)
└── example_datasets/      # Sample CSVs for movies/songs
```

---

## Environment setup

Each backend service needs a `.env` file. Use the same PostgreSQL instance (or Neon) and set the connection string per service.

### 1. Auth (`backend/auth/.env`)

```env
PORT=8080
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-strong-secret-change-in-production
```

### 2. ML recommender (`backend/back2/.env`)

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
MLFLOW_TRACKING_URI=postgresql://user:pass@host:5432/dbname
```

Use the same DB (or one with a `recommender` schema). Tables are created on startup.

### 3. Webhooks service (`backend/webhooks_services/.env`)

```env
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

Optional: `FASTAPI_URL=http://localhost:8000` if the ML backend is on another host.

### 4. Frontend (optional)

Create `frontend/s/.env` if auth runs on a different URL:

```env
VITE_AUTH_API_URL=http://localhost:8080
```

Defaults in code: Auth `http://localhost:8080`, ML `http://localhost:8000`, Webhooks `http://localhost:3001`.

---

## One-time database setup (Neon / single DB)

If you use **one Neon database** with separate schemas (`auth`, `webhooks`, `recommender`), run the schema script once. See **[NEON-SETUP.md](NEON-SETUP.md)** for step-by-step instructions.

**Windows (PowerShell):**

```powershell
cd backend\webhooks_services
npm install
$env:DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
node ..\..\scripts\init-neon-schemas.mjs
```

**Mac/Linux:**

```bash
cd backend/webhooks_services
npm install
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" node ../../scripts/init-neon-schemas.mjs
```

---

## Execution steps (run in order)

Use **4 terminals** (5 if you run MLflow UI).

### Terminal 1 – Auth service

```bash
cd backend/auth
npm install
npm start
```

→ **http://localhost:8080**

### Terminal 2 – ML recommender (FastAPI)

```bash
cd backend/back2
pip install -r requirements.txt
uvicorn saas_api:app --reload
```

→ **http://localhost:8000**

### Terminal 3 – Webhooks & app registration

```bash
cd backend/webhooks_services
npm install
npm start
```

→ **http://localhost:3001**

### Terminal 4 – Frontend

```bash
cd frontend/s
npm install
npm run dev
```

→ **http://localhost:5173**

### Terminal 5 (optional) – MLflow UI

```bash
cd backend/back2
mlflow ui --backend-store-uri $env:MLFLOW_TRACKING_URI --default-artifact-root ./mlflow_artifacts
```

On Windows CMD use `set MLFLOW_TRACKING_URI=...` then the same `mlflow ui` command.

→ **http://localhost:5000**

---


For Xternal_Client: npx serve xternal_client/MovieRec

## Using the application

1. Open **http://localhost:5173** in your browser.
2. **Sign up** or **log in** (auth uses the service on port 8080).
3. In the app:
   - **Recommender Studio:** Create a project, upload content and/or interaction CSVs from `example_datasets/`, map columns, choose model type (content / collaborative / hybrid). Wait until status is **Ready**, then get recommendations (by item title and/or user id).
   - **Webhook Dashboard:** Register an external app (name + webhook URL). Copy the **API key** and use it in the external client or in API calls.
4. **Recommendations API** (with API key):
   - `POST http://localhost:3001/api/recommend`  
   - Headers: `Content-Type: application/json`, `x-api-key: YOUR_API_KEY`  
   - Body: `{ "project_id": 1, "item_title": "Some Movie", "user_id": "123" }` (omit `user_id` for content-only; omit `item_title` for collaborative-only).

---

## External demo clients

- **MovieRec:** open `xternal_client/MovieRec/index.html` in a browser. In `app.js` set `API_KEY` (from Webhook Dashboard) and `PROJECT` to an **existing** project ID (create a project in the Dashboard first; list IDs: `GET http://localhost:8000/projects/`).
- **MusicRec:** open `xternal_client/MusicRec/index.html` for the music demo.

---

## Port summary

| Service        | Port | Purpose                    |
|----------------|------|----------------------------|
| Auth           | 8080 | Login, signup, JWT         |
| ML recommender | 8000 | Projects, train, recommend |
| Webhooks       | 3001 | Apps, API key, recommend  |
| Frontend       | 5173 | React UI                   |
| MLflow UI      | 5000 | Optional model registry    |

---

## Troubleshooting

- **CORS / connection errors:** Ensure Auth (8080), back2 (8000), and webhooks (3001) are running before using the frontend.
- **"Project not found" (404 from FastAPI):** The `project_id` you use (e.g. in MovieRec’s `PROJECT` or in the recommend API body) must exist in the ML backend. Create a project in the Dashboard, wait until status is **Ready**, then use that project’s ID (or list IDs with `GET http://localhost:8000/projects/`).
- **"Project not found or not ready":** Wait until the project status is **Ready** after uploading data and training.
- **Database errors:** Run the schema script (see [One-time database setup](#one-time-database-setup-neon--single-db)) and check `DATABASE_URL` (and `MLFLOW_TRACKING_URI` for back2) in each `.env`.
