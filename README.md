# 🚗 Car Rental System

Full-stack car rental app: React frontend, Express + MySQL backend.

```
car-rental-system/
├── Backend/          Express API (auth, cars, bookings)
├── Frontend/          React app (Login, SignUp, Fleet, Bookings)
├── Database/          schema.sql + seed.sql
└── README.md
```

## Prerequisites

- Node.js (v18+ recommended)
- MySQL Server, running locally

## 1. Set up the database

```bash
mysql -u root -p < Database/schema.sql
mysql -u root -p car_rental < Database/seed.sql
```

This creates the `car_rental` database with `users`, `cars`, and `bookings` tables, plus demo cars and two demo users.

> **Note:** if your MySQL password contains special characters like `$`, wrap it in quotes on the command line, e.g. `mysql -u root -p'yourpass$123'`.

## 2. Set up and run the backend

```bash
cd Backend
npm install
cp .env.example .env
```

Edit `.env` and fill in your real MySQL credentials:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=car_rental
JWT_SECRET=change_this_to_a_long_random_string
```

Then start it:

```bash
npm start
```

You should see:
```
🚗 Car Rental Backend running on http://localhost:5000
✅ Connected to MySQL database: car_rental
```

Check it's alive: open `http://localhost:5000/api/health` in a browser — it should say `{"status":"ok","database":"connected"}`.

## 3. Set up and run the frontend

In a **second terminal** (keep the backend running):

```bash
cd Frontend
npm install
npm start
```

This opens `http://localhost:3000` in your browser automatically.

## 4. Log in and try it out

Demo account:
- Email: `aarav.sharma@example.com`
- Password: `password1`

Flow: Login → Fleet (browse cars, pick dates, book) → Bookings (view / cancel).

## Troubleshooting

**"Connection error. Is backend running?"** — the backend on port 5000 isn't up, or crashed. Check its terminal for errors.

**Backend logs `❌ Could not connect to MySQL`** — MySQL isn't running, or `.env` credentials are wrong.

**`EADDRINUSE` on port 3000 or 5000** — something else is already using that port. Find and stop it:
```bash
# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```
```bash
# macOS/Linux
lsof -i :3000
kill -9 <pid>
```

**"Invalid email or password"** — make sure you ran `seed.sql` so the demo user exists.

**`Cannot find module` errors** — re-run `npm install` in that folder (`Backend` or `Frontend`).

## What was fixed / added in this pass

- Split the loose uploaded files into proper `Backend/` and `Frontend/` project folders.
- Added a complete, working React app scaffold for `Frontend` (`package.json`, `public/index.html`, `src/index.js`) — previously only the page components existed with no way to actually run them.
- Wrote `src/pages/Fleet.jsx` from scratch — it was imported by `App.jsx` but was never included in the uploaded files, so the app couldn't compile at all before.
- Removed an unused `BrowserRouter` import from `App.jsx` and wrapped the app with `<BrowserRouter>` in `index.js` instead (where `useNavigate` actually needs it).
- Backend: wrapped each DB query block in `try/finally` so pooled connections are always released, even on error (previously a thrown error would leak the connection).
- Backend: added a friendly `GET /` route and a `GET /api/health` route so you can quickly confirm the server and DB are both up, instead of seeing a bare "Cannot GET /".
- Backend: added a startup check that connects to MySQL immediately and logs a clear success/failure message.
- Backend: added a catch-all 404 handler with a useful JSON message instead of Express's default HTML error page.
- Added `.env.example` (Backend) and `.gitignore` files (Backend, Frontend, root) so secrets and `node_modules`/`build` don't get committed to GitHub.

## Next up

Ready for git init / first commit whenever you are — just make sure `.env` stays out of it (it's already gitignored).
