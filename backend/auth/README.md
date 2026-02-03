# Auth Service

JWT-based signup/login API. Uses PostgreSQL and follows the contract in `AUTH-IMPLEMENTATION-NOTE.md`.

## Setup

1. Copy `.env.example` to `.env` and set:
   - `PORT` – e.g. `8080`
   - `DATABASE_URL` – PostgreSQL connection string (e.g. `postgresql://localhost:5432/auth_db`)
   - `JWT_SECRET` – strong secret for signing JWTs (do not commit)

2. Install and run:

```bash
npm install
npm start
```

- `POST /auth/signup` – body: `{ name, email, password }`
- `POST /auth/login` – body: `{ email, password }` → returns `jwttoken`, `name`, `email`
