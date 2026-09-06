# Aurelia Fine Jewelry Academy

A mobile-first fine-jewelry retail learning and sales-coaching platform for jewelry
sales associates, luxury client advisors, bridal specialists, cruise/travel-retail
specialists, gemologist-sellers, store managers, district leaders, and retail sales
trainers.

Built with Next.js 16 (App Router, TypeScript), Tailwind CSS v4, and a self-contained
SQLite database (via `better-sqlite3`) that seeds itself with realistic demo data on
first run — no external services, API keys, or database server required.

---

## 1. Requirements

- **Node.js 20.x or newer** (Node 22 is what this project was built and tested on).
  Check with `node -v`.
- **npm 10.x or newer** (ships with Node 20+). Check with `npm -v`.
- A Unix-like OS (Linux or macOS) or Windows. `better-sqlite3` ships prebuilt native
  binaries for Linux, macOS, and Windows (x64 and arm64), so no C++ build toolchain
  should be needed on common platforms.
- No database server, no Redis, no external API keys. Everything — auth sessions,
  content, seed data — lives in a single SQLite file created automatically at
  `data/aurelia.db`.

---

## 2. Install and run locally (development)

```bash
# 1. Get the code
git clone https://github.com/neildi/arena.git
cd arena

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

> **If `npm install` fails while building `better-sqlite3`** (an error mentioning
> `node-gyp rebuild` and a failed download from `nodejs.org`): this package already
> ships prebuilt native binaries for Linux/macOS/Windows (x64 and arm64), so the
> compile step isn't actually needed — it just needs to be skipped. This happens on
> networks that allow `npmjs.org`/`github.com` but block `nodejs.org` (some corporate
> networks, CI runners, and sandboxes). Fix it with:
> ```bash
> npm install --ignore-scripts
> ```
> This was verified to work cleanly and produce a fully working app.

Open **http://localhost:3000** in your browser. The app will:

- Create `data/aurelia.db` automatically (an ignored, local-only file).
- Apply the schema from `src/lib/schema.sql`.
- Seed demo data automatically on first request (organization, locations, users,
  courses, lessons, quizzes, role-play scenarios, toolkit resources, badges,
  certificates, coaching notes, assignments, and demo KPI records).

You do not need to run a separate "seed" command — visiting any page the first time
triggers the seed if the database is empty.

### Demo login accounts

All demo accounts share the password:

```
Aurelia2026!
```

| Role | Email |
|---|---|
| Learner (new associate) | `mia.alvarez@aureliademo.com` |
| Learner (bridal specialist) | `priya.natarajan@aureliademo.com` |
| Learner (luxury advisor) | `julian.cross@aureliademo.com` |
| Learner (cruise/travel-retail specialist) | `ana.bautista@aureliademo.com` |
| Learner (gemologist-seller) | `devon.osei@aureliademo.com` |
| Store Manager | `renee.whitfield@aureliademo.com` |
| District Leader | `marcus.ferreira@aureliademo.com` |
| Trainer / L&D Lead | `sofia.marchetti@aureliademo.com` |
| Administrator | `taylor.kim@aureliademo.com` |

You can also create a new account from the **Sign up** page, which walks through the
onboarding flow (role, experience, goals) and recommends a learning path.

### Resetting the demo data

The database is a single file. To wipe everything and reseed from scratch:

```bash
# stop the dev server first, then:
rm -f data/aurelia.db data/aurelia.db-wal data/aurelia.db-shm
npm run dev
```

---

## 3. Environment variables (optional)

The app runs with sensible defaults out of the box. One variable is worth setting for
anything beyond local development:

| Variable | Required? | Default | Purpose |
|---|---|---|---|
| `AUTH_SECRET` | Recommended for production | a built-in dev fallback string | Signs session JWTs (via `jose`). **Set a long random value in production** so sessions aren't forgeable and aren't invalidated by app restarts. |
| `NODE_ENV` | Set automatically by Next.js | `development` / `production` | Controls whether the session cookie is marked `secure` (HTTPS-only) — this is set to `production` automatically by `npm run build && npm start`. |

Generate a strong secret:

```bash
openssl rand -base64 48
```

Set it via a `.env.local` file (already covered by `.gitignore` — never commit real
secrets) or via your hosting platform's environment variable settings:

```bash
# .env.local
AUTH_SECRET=paste-your-generated-secret-here
```

No other environment variables, API keys, or third-party service credentials are
needed. The AI role-play "coach" and skill scoring are implemented with deterministic,
local heuristics (`src/lib/roleplay-engine.ts`) — there is no external LLM call to
configure.

---

## 4. Production build and run

```bash
npm run build   # compiles and optimizes the app
npm start       # runs the production server (defaults to port 3000)
```

To run on a different port:

```bash
PORT=8080 npm start
```

> **Note on the sandboxed dev environment used to build this app:** if you ever see a
> build error about fetching Google Fonts (`Inter` / `Playfair Display`), it means the
> machine running `npm run build` has no outbound internet access. On a normal server
> or your own machine with internet access this is not an issue. If you must build
> fully offline, switch `src/app/layout.tsx` from `next/font/google` to
> `next/font/local` with bundled font files, or set `HTTP_PROXY`/`HTTPS_PROXY`.

### Persisting data across restarts/deploys

The SQLite file at `data/aurelia.db` **is** your database. For any real (non-demo)
deployment:

- Make sure `data/` is on a **persistent volume/disk**, not an ephemeral filesystem.
  Platforms that reset the filesystem on every deploy or restart (e.g. many
  serverless/edge platforms) will lose all data — this app is not compatible with
  serverless/edge deployment as-is because it needs a writable, persistent disk for
  SQLite.
- Back up `data/aurelia.db` (a single file) on whatever schedule fits your needs —
  a simple `cp` while the app is stopped, or use SQLite's `.backup` command for a
  live backup.

---

## 5. Distribution options

Pick whichever fits your audience. All three assume a server/VM/container with a
persistent disk (see note above) — this is **not** deployable to Vercel/Netlify/edge
functions as-is because of the local SQLite file.

### Option A — Share the source (simplest, for developers)

1. Push your working branch or tag a release in Git, or zip the repo:
   ```bash
   git archive --format=zip -o aurelia-academy.zip HEAD
   ```
   (`git archive` automatically excludes `.gitignore`'d files like `node_modules`
   and `data/*.db`.)
2. The recipient follows the **Install and run locally** steps above
   (`npm install`, then `npm run dev` or `npm run build && npm start`).

### Option B — Docker (recommended for handing off a runnable app)

This repo doesn't ship a Dockerfile yet; add one like this at the project root:

```dockerfile
# Dockerfile
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src/lib/schema.sql ./src/lib/schema.sql
VOLUME ["/app/data"]
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t aurelia-academy .
docker run -d -p 3000:3000 \
  -e AUTH_SECRET="$(openssl rand -base64 48)" \
  -v aurelia_data:/app/data \
  --name aurelia-academy \
  aurelia-academy
```

The `-v aurelia_data:/app/data` volume is what makes the SQLite database (and thus
all learner progress, coaching notes, certificates, etc.) survive container restarts
and upgrades.

For a docker-compose setup:

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - AUTH_SECRET=${AUTH_SECRET}
    volumes:
      - aurelia_data:/app/data
    restart: unless-stopped
volumes:
  aurelia_data:
```

### Option C — Plain VM / VPS with a process manager

1. Provision a small Linux VM (1 vCPU / 1GB RAM is plenty for a demo/pilot; scale up
   for real traffic).
2. Install Node.js 20+ (e.g. via [nvm](https://github.com/nvm-sh/nvm) or your distro's
   package manager).
3. Clone the repo, `npm install`, `npm run build`.
4. Run it under a process manager so it restarts on crash/reboot — either:
   - **pm2**:
     ```bash
     npm install -g pm2
     AUTH_SECRET=... pm2 start npm --name aurelia-academy -- start
     pm2 save
     pm2 startup   # follow the printed instructions to enable on boot
     ```
   - or a **systemd** unit:
     ```ini
     # /etc/systemd/system/aurelia-academy.service
     [Unit]
     Description=Aurelia Fine Jewelry Academy
     After=network.target

     [Service]
     WorkingDirectory=/opt/aurelia-academy
     Environment=NODE_ENV=production
     Environment=AUTH_SECRET=replace-with-a-real-secret
     ExecStart=/usr/bin/npm start
     Restart=always
     User=www-data

     [Install]
     WantedBy=multi-user.target
     ```
     ```bash
     sudo systemctl daemon-reload
     sudo systemctl enable --now aurelia-academy
     ```
5. Put a reverse proxy (nginx or Caddy) in front for TLS/HTTPS and your domain name.
   Example nginx snippet:
   ```nginx
   server {
     listen 443 ssl;
     server_name academy.example.com;
     location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_set_header Host $host;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
     }
   }
   ```
6. Make sure `/opt/aurelia-academy/data` is on real, backed-up disk.

---

## 6. Updating an existing deployment

```bash
git pull
npm install        # picks up any new/updated dependencies
npm run build
# restart the process (pm2 restart aurelia-academy / systemctl restart aurelia-academy / docker restart <container>)
```

The SQLite schema (`src/lib/schema.sql`) uses `CREATE TABLE IF NOT EXISTS`, so
existing databases are left intact across updates — new tables added in a future
version will be created automatically, but this project does not currently include a
migration system for altering existing table columns, so plan schema changes
accordingly if you fork and extend it.

---

## 7. Project structure (for anyone extending it)

```
src/
  app/
    (app)/            # authenticated app shell + all feature pages (dashboard,
                       # learning, roleplay, toolkit, quizzes, tasks, certificates,
                       # coaching, analytics, content-studio, organization)
    api/               # REST-style route handlers backing every feature
    login/, signup/, onboarding/   # public/auth flows
  components/          # shared UI kit (cards, buttons, modals, toasts, nav)
  lib/
    schema.sql         # full SQLite schema
    db.ts              # lazy DB connection + auto-seed on first use
    seed/               # demo data generators
    repo/               # data-access helper functions used by pages/routes
    auth.ts             # session/JWT helpers, role types
    roleplay-engine.ts   # deterministic local scoring/coaching logic for role-play
data/                  # SQLite database lives here at runtime (gitignored)
```

---

## 8. Content and compliance notes

All course content, role-play scenarios, gemstone/product information, KPI figures,
and certificates in the seed data are **fictional demo content** for training-platform
demonstration purposes. No real appraisal values, financing approvals, legal advice,
or guarantees are provided anywhere in the app, and the compliance-aware lesson
callouts and role-play guardrails are designed to reinforce that same standard for any
real content you add. Any jewelry imagery you add to a real deployment should be
appropriately licensed — none is bundled with this project.
