# Authentication System – Implementation Note for Another Project

Use this note when prompting to add **the same JWT-based login/signup authentication system** into a project that **already has a login page UI** but no backend auth. Copy or reference this in the other project so the assistant can wire your existing UI to this auth flow.

---

## 1. What to Implement (Summary)

- **Backend:** Node/Express API with signup, login, JWT, MongoDB user model, request validation.
- **Frontend:** Connect existing login (and signup if present) UI to the API; store JWT and user info; protect private routes; restore auth state on refresh.

---

## 2. Backend Requirements

### 2.1 Tech Stack

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **bcrypt** (password hashing)
- **jsonwebtoken** (JWT)
- **Joi** (request body validation)
- **dotenv** (env vars)
- **cors**, **body-parser**

### 2.2 Environment Variables

Create a `.env` in the backend root (do not commit):

- `PORT` – e.g. `8080`
- `MONGO_CONN` – MongoDB connection string
- `JWT_SECRET` – strong secret for signing JWTs

### 2.3 Folder Structure

```
backend/
├── models/
│   ├── db.js          # Mongoose connect using process.env.MONGO_CONN
│   └── user.js        # User schema
├── controllers/
│   └── AuthController.js   # signup, login
├── routes/
│   └── AuthRoute.js   # POST /auth/signup, POST /auth/login
├── middlewares/
│   └── AuthValidation.js   # Joi validation for signup & login
├── index.js           # Express app, cors, body-parser, require db, mount /auth
└── .env
```

### 2.4 User Model (Mongoose)

- Fields: `name` (String, required), `email` (String, required, unique), `password` (String, required).
- Export the model.

### 2.5 Auth Controller

**Signup:**

1. Read `name`, `email`, `password` from `req.body`.
2. If user with same `email` exists → `409` with `{ message: "User already exists", success: false }`.
3. Hash password with `bcrypt.hash(password, 10)`.
4. Create and save user with hashed password.
5. Respond `201` with `{ message: "Signup successful", success: true }`.
6. On server error → `500` with `{ message: "Internal server error", success: false }`.

**Login:**

1. Read `email`, `password` from `req.body`.
2. Find user by `email`. If not found → `403` with `{ message: "Auth failed", success: false }`.
3. Compare password with `bcrypt.compare(password, existingUser.password)`. If no match → `403` with `{ message: "password didnt match", success: false }`.
4. Create JWT: `jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' })`.
5. Respond `200` with:
   - `{ message: "login successful", success: true, jwttoken, email, name: existingUser.name }`.
6. On server error → `500` with `{ message: "Internal server error", success: false }`.

### 2.6 Validation Middleware (Joi)

- **Signup:** Validate `req.body`: `name` (string, min 3, max 30), `email` (email), `password` (string, min 3, max 30). On error → `400` with `{ message: "BAD REQUEST", error: error.details[0].message }`.
- **Login:** Same for `email` and `password` only.
- Call `next()` when valid.

### 2.7 Routes

- `POST /auth/signup` → signupValidation middleware, then signup controller.
- `POST /auth/login` → loginValidation middleware, then login controller.

### 2.8 Main App (index.js)

- `require('dotenv').config()` at top.
- Require `./models/db` so MongoDB connects on startup.
- `express()`, `app.use(bodyParser.json())`, `app.use(cors())`.
- `app.use("/auth", AuthRoute)`.
- Optional: `app.get("/", (req, res) => res.send("pong")).
- `app.listen(PORT)` with `PORT` from env or default 8080.

---

## 3. API Contract (So Frontend Can Be Wired)

### POST /auth/signup

- **Body:** `{ name, email, password }`
- **Success (201):** `{ message: "Signup successful", success: true }`
- **Conflict (409):** `{ message: "User already exists", success: false }`
- **Validation (400):** `{ message: "BAD REQUEST", error: "<Joi message>" }`

### POST /auth/login

- **Body:** `{ email, password }`
- **Success (200):** `{ message: "login successful", success: true, jwttoken, email, name }`
- **Auth failure (403):** `{ message: "Auth failed" | "password didnt match", success: false }`
- **Validation (400):** `{ message: "BAD REQUEST", error: "<Joi message>" }`

Use the **same response shapes** so the frontend can reuse the same handling (e.g. `success`, `message`, `error`, `jwttoken`, `name`).

---

## 4. Frontend Integration (For Existing Login/Signup UI)

### 4.1 Assumptions

- The other project already has:
  - Login page (and optionally signup) with form UI.
  - React + React Router (and ideally something like react-toastify for toasts).

### 4.2 What to Add or Change

1. **API base URL**  
   Use the same backend URL (e.g. `http://localhost:8080`) for auth calls. Prefer a constant or env (e.g. `VITE_API_URL`) so it can be changed per environment.

2. **Login form submit handler**  
   - On submit: `POST` to `http://localhost:8080/auth/login` with `{ email, password }`, `Content-Type: application/json`.
   - On success (`result.success` and `result.jwttoken`):
     - Store `result.jwttoken` in `localStorage.setItem("token", result.jwttoken)`.
     - Store `result.name` in `localStorage.setItem("loggedInUser", result.name)` (or equivalent).
     - Show success message, then redirect to the app’s “home” or dashboard route.
   - On error: show `result.error` (validation) or `result.message` (auth failure) to the user (e.g. toast).

3. **Signup form submit handler (if signup exists)**  
   - On submit: `POST` to `http://localhost:8080/auth/signup` with `{ name, email, password }`, `Content-Type: application/json`.
   - On success: show success message, then redirect to login (or auto-login if you add that later).
   - On error: show `result.error` or `result.message`.

4. **Protected routes**  
   - Keep an `isAuthenticated` (or similar) state, derived from “do we have a valid token?”.
   - For routes that require login (e.g. home/dashboard): if not authenticated, redirect to login (e.g. `<Navigate to="/login" replace />`).
   - Optional: for backend-protected APIs later, send header `Authorization: Bearer <token>` with the JWT from localStorage.

5. **Restore auth on refresh**  
   - On app load (e.g. in a small component or in the root layout), read `localStorage.getItem("token")`.
   - If token exists, set `isAuthenticated` to true.
   - If token exists and the user is on `/`, `/login`, or `/signup`, redirect to the home/dashboard route so they don’t stay on login after refresh.
   - This can be a “RefreshHandler” component that runs once and uses `setIsAuthenticated` and `navigate` (from React Router).

6. **Logout**  
   - Remove `token` and `loggedInUser` from localStorage, show a short success message, redirect to `/login`.

7. **Toast/error helpers**  
   - If the project doesn’t have them, add small helpers that show success/error toasts (e.g. using react-toastify) so login/signup can show `handlesuccess(message)` and `handleError(message)` style feedback consistent with the reference project.

### 4.3 Frontend Details From Reference Project

- **Login response usage:** `const { success, message, error, jwttoken, name } = result;` then `localStorage.setItem("token", jwttoken); localStorage.setItem("loggedInUser", name);` and redirect.
- **Signup response usage:** `const { success, message, error } = result;` then show message and redirect to login.
- **Protected route pattern:** `isAuthenticated ? <ProtectedPage /> : <Navigate to="/login" replace />`.
- **Refresh handler:** On mount, if `localStorage.getItem("token")` exists, set auth to true and, when path is `/` or `/login` or `/signup`, `navigate("/home", { replace: true })` (replace `/home` with your app’s post-login route).

---

## 5. Security Notes (Keep in Mind)

- Passwords are hashed with bcrypt (salt rounds 10); never store plain text.
- JWT secret must be in env, not in code.
- Auth is enforced by the backend; frontend checks are for UX and redirects only.
- For future protected API routes, verify JWT in backend middleware and reject requests without a valid token.

---

## 6. What This System Does *Not* Include

- OAuth (Google/GitHub).
- Refresh tokens; single JWT with 24h expiry.
- Session-based auth.
- Role-based access control (RBAC).
- MFA/OTP.

These can be added later.

---

## 7. One-Line Prompt You Can Use in the Other Project

You can paste something like this when you open the other project:

**Short version:**

> “Implement the same JWT login/signup authentication as in my LOGIN-SIGNUP project: add a Node/Express backend with MongoDB, Mongoose, bcrypt, JWT, Joi validation, and signup/login routes under /auth. Wire my existing login (and signup) page to these APIs: on success store jwttoken and user name in localStorage, protect private routes, and restore auth state on page refresh using the logic in AUTH-IMPLEMENTATION-NOTE.md.”

**Long version (if you copy the note into the other repo):**

> “I have a project that already has a login page UI but no authentication. I want the same authentication system as in my LOGIN-SIGNUP project. I’ve added AUTH-IMPLEMENTATION-NOTE.md to this repo—please read it and implement: (1) Backend: Express server with MongoDB/Mongoose user model, bcrypt, JWT, Joi validation, and POST /auth/signup and POST /auth/login matching the API contract in the note. (2) Frontend: Connect our existing login and signup forms to these endpoints, store token and loggedInUser in localStorage, add protected routes and a refresh handler so auth state is restored on reload, and add logout that clears storage and redirects to login. Keep our existing UI; only wire it to the new auth APIs and flow.”

---

*Generated from the LOGIN-SIGNUP authentication project so the same system can be replicated in another project with an existing login UI.*
