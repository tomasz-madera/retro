# Scrum Retro App

Scrum retrospective board. Built with Next.js, Drizzle ORM, MySQL, and Auth.js.

## Stack

- **Framework:** Next.js 16 (App Router, Server Actions)
- **Database:** MySQL (`planningpoker` DB, `retro_`* tables)
- **Auth:** Auth.js v5 (credentials + JWT sessions)
- **UI:** Tailwind CSS v4, retro CRT theme
- **DnD:** @dnd-kit

## Prerequisites

- Node.js 20+
- pnpm
- Docker & Docker Compose (for local dev)

## Local Development (Docker)

1. Add to `/etc/hosts` if needed:
  ```
   127.0.0.1 retro.localhost
  ```
2. Start services:
  ```bash
   docker compose up --build
  ```
3. Open [http://retro.localhost:8080](http://retro.localhost:8080) (port 8080 — port 80 may be in use on host)
4. Run migrations (first time, in another terminal):
  ```bash
   docker compose exec app pnpm db:migrate
   docker compose exec app pnpm db:seed
  ```

Default dev admin (from docker-compose.yml):

- Email: ***
- Password: ***

## Local Development (without Docker)

1. Copy env file:
  ```bash
   cp .env.example .env.local
  ```
2. Set `DATABASE_URL`, `AUTH_SECRET`, `SEED_ADMIN_PASSWORD` in `.env.local`
3. Install and run:
  ```bash
   pnpm install
   pnpm db:migrate
   pnpm db:seed
   pnpm dev
  ```

## Database

### Backup (before prod migrations)

```bash
mysqldump \
  --defaults-extra-file=backups/.my.cnf \
  --single-transaction --routines --triggers --events \
  --hex-blob --set-gtid-purged=OFF \
  planningpoker \
  > "backups/planningpoker_$(date +%Y-%m-%d_%H%M%S).sql"
```

### Existing tables (before retro_* migration)

See `backups/TABLES_BEFORE_MIGRATION.txt`.

### Migrations

```bash
pnpm db:generate   # generate migration from schema changes
pnpm db:migrate    # apply migrations
pnpm db:seed       # seed admin user (idempotent)
```

## Production

Server has no Docker. Deploy via PM2:

```bash
cd /path/to/retro
pnpm install
pnpm build
pnpm db:migrate
pnpm db:seed
pm2 start ecosystem.config.js
pm2 save
```

Reverse proxy (Apache/Nginx) forwards to port 3000.

Set in `.env.local` on server:

- `DATABASE_URL`
- `AUTH_SECRET` (generate with `openssl rand -base64 32`)
- `AUTH_URL=<url>`
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`

## Scripts


| Command            | Description                |
| ------------------ | -------------------------- |
| `pnpm dev`         | Start dev server           |
| `pnpm build`       | Production build           |
| `pnpm start`       | Start production server    |
| `pnpm lint`        | ESLint                     |
| `pnpm db:generate` | Generate Drizzle migration |
| `pnpm db:migrate`  | Apply migrations           |
| `pnpm db:seed`     | Seed admin user            |
| `pnpm test`        | Run Vitest                 |


## Project Structure

```
src/
  app/           # App Router pages
  actions/       # Server Actions
  components/    # UI components (board, retro, layout, admin)
  lib/           # db, auth, validators
drizzle/         # SQL migrations
docker/          # Caddy config
backups/         # prod DB dumps (gitignored)
```
