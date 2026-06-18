# Scrum Retro App — Project Context

> Aplikacja do prowadzenia retrospektyw Scrum (tablice kanban, karty, drag-and-drop).
> Estetyka retro (terminal/CRT). Stack: Next.js 15 + Drizzle + MySQL + Auth.js.

## Project Overview

**Stack:** Next.js 15 (App Router), TypeScript strict, Drizzle ORM + mysql2, Auth.js v5, Tailwind CSS v4, @dnd-kit, Zod, Docker Compose (dev), PM2 (prod)

**Architecture:** Server Components by default. Client Components only for interactivity (DnD, forms). Server Actions for mutations. Route Handlers only where needed (Auth.js).

**Database:** MySQL `planningpoker` (legacy name — do not rename). New tables use `retro_` prefix to avoid collisions with legacy planning poker tables.

## Critical Rules

### Database

- All queries via Drizzle ORM — never raw SQL strings with user input
- Migrations in `drizzle/` via `drizzle-kit` — never modify production DB directly
- **Backup prod DB to `backups/` BEFORE any migration** (`mysqldump` → gitignored)
- Run `SHOW TABLES` before first migration to inventory existing tables
- Use explicit column selects, not `select()` without columns
- All list queries must include `.limit()` to prevent unbounded results
- Tables: `retro_users`, `retro_boards`, `retro_columns`, `retro_cards`

### Authentication

- Auth.js v5 with credentials provider + `bcryptjs` (cost 12)
- Session via HTTP-only cookies — never store tokens in localStorage
- Protected routes checked in middleware — verify session server-side
- Roles: `user` (default), `admin` (user management, full access)
- Seed admin: `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` env vars, idempotent seed script

### Authorization

| Action | user | admin |
|--------|------|-------|
| Create retro | yes | yes |
| Add/move cards | yes | yes |
| Close retro | creator or admin | yes |
| Admin panel | no | yes |
| View history | yes | yes |

### Code Style

- No emojis in code or comments
- Immutable patterns — spread operator, never mutate state
- Server Components: no `'use client'`, no `useState`/`useEffect`
- Client Components: `'use client'` at top, minimal — extract logic to hooks
- Prefer Zod schemas for all input validation (forms, Server Actions, env vars)
- No `any` — TypeScript strict mode

## File Structure

```
src/
  app/
    (auth)/login/page.tsx
    (auth)/register/page.tsx
    page.tsx                    # lista retr (aktywne + historyczne)
    retro/new/page.tsx          # kreator tablicy
    retro/[id]/page.tsx         # tablica kanban + DnD
    admin/users/page.tsx        # tylko admin
    api/auth/[...nextauth]/route.ts
  components/
    board/                      # Board, Column, Card, AddCardForm
    retro/                      # CRTScreen, RetroButton, Terminal
    layout/                     # Header, Nav
  lib/
    db/schema.ts
    db/index.ts
    auth.ts
    validators/                 # Zod schemas
  actions/                      # Server Actions (createBoard, moveCard...)
drizzle/                        # migracje
backups/                        # dumpy prod (gitignore!)
docker/
  Caddyfile                     # reverse proxy → retro.localhost
docker-compose.yml
docker-compose.prod.yml
Dockerfile
ecosystem.config.js             # PM2 prod
```

## Key Patterns

### API Response Format

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }
```

### Server Action Pattern

```typescript
'use server'

import { z } from 'zod'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { retroBoards } from '@/lib/db/schema'

const schema = z.object({
  title: z.string().min(1).max(200),
})

export async function createBoard(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { success: false, error: 'Unauthorized' }

  const parsed = schema.safeParse({ title: formData.get('title') })
  if (!parsed.success) {
    return { success: false, error: 'Invalid input' }
  }

  const [board] = await db.insert(retroBoards).values({
    title: parsed.data.title,
    createdBy: session.user.id,
    status: 'active',
  }).$returningId()

  return { success: true, data: board }
}
```

### Drag & Drop

- Library: `@dnd-kit/core` + `@dnd-kit/sortable`
- Optimistic UI on frontend, persist via `moveCard(cardId, targetColumnId, newPosition)` Server Action
- Update `column_id` + recalculate `position` on cross-column drops

## Environment Variables

```bash
# Database
DB_HOST=db10-lab.csk.lan
DB_PORT=3306
DB_DATABASE=planningpoker
DB_USERNAME=planningpoker
DB_PASSWORD=
DATABASE_URL=mysql://planningpoker:PASSWORD@db10-lab.csk.lan:3306/planningpoker

# Auth
AUTH_SECRET=generate-with-openssl-rand-base64-32
AUTH_URL=http://retro.localhost          # dev; prod: https://it.edunetwork.pl

# Seed
SEED_ADMIN_EMAIL=tomasz.madera@wskz.pl
SEED_ADMIN_PASSWORD=                     # only in .env.local, never in repo
```

## Dev vs Prod

| Environment | URL | Runtime | Database |
|-------------|-----|---------|----------|
| Dev (Docker) | http://retro.localhost | Docker Compose (Caddy → app) | MySQL container |
| Dev (VPN) | retro.localhost | local pnpm | db10-lab.csk.lan |
| Prod | https://it.edunetwork.pl | PM2 + nvm (no Docker) | db10-lab.csk.lan |

Dev: `docker compose up` → http://retro.localhost (add `127.0.0.1 retro.localhost` to `/etc/hosts` on Linux if needed).

Prod deploy: SSH `ssh -p 3141 wskz0020@it.edunetwork.pl`, user `it`, PM2 via `ecosystem.config.js`.

## Testing Strategy

- Unit + integration: skill `tdd-workflow`, Vitest
- E2E: skill `e2e-testing`, agent `e2e-runner` — auth flow, board CRUD, DnD
- Target: 80%+ coverage on critical paths

### Critical E2E Flows

1. Register → login → dashboard (active + historical retros)
2. Create retro → configure columns → board view
3. Add card → drag between columns → persist position
4. Close retro → appears in history
5. Admin: user list, role change

## Agent Workflow

```bash
# Planning a feature — use Cursor agent with context.md + relevant skills
# Developing with TDD — skill: tdd-workflow
# Before committing — agents: code-reviewer, security-reviewer
# Before release — agent: e2e-runner
```

Hook tuning (optional):

```bash
export ECC_HOOK_PROFILE=standard
export ECC_SESSION_START_MAX_CHARS=6000
```

## Git Workflow

- `feat:` new features, `fix:` bug fixes, `refactor:` code changes
- Feature branches from `main`, PRs required
- Never commit: `.env.local`, `backups/*.sql`, `backups/.my.cnf`
- CI: lint, type-check, unit tests, E2E tests

## Implementation Phases

1. **Faza 0** — Backup prod DB (`backups/`) + `SHOW TABLES`
2. **Faza 1** — Scaffold Next.js + Docker + Drizzle schema + Auth + seed admin
3. **Faza 2** — Retro UI theme + dashboard + create board form
4. **Faza 3** — Kanban board + cards + drag-and-drop
5. **Faza 4** — Admin panel + close retro + PM2 deploy on it.edunetwork.pl
