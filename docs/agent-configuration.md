## ECC dla Cursor – analiza pod stack (Next.js 15 / TypeScript / Drizzle / Auth.js / Tailwind v4)

ECC to nie jest typowy zestaw cursor rules — to **system harness performance** z 249 skillami, 63 agentami i hookami. Dla Cursor działa przez `.cursor/` folder w repo i własny installer. Poniżej to, co realnie przydatne dla tego projektu.

---

### 1. Cursor Rules — co skopiować do `.cursor/rules/`

ECC dostarcza przetłumaczone reguły dla Cursor w katalogu `.cursor/`. Dla stacku kopiujesz:

**Obowiązkowo:**

- `rules/common/` — coding-style, git-workflow, testing, performance, security, hooks, agents (language-agnostic, fundament każdego projektu)
- `rules/typescript/` — TypeScript strict mode patterns, Next.js App Router conventions, Server Components first, minimalizacja `use client`

Instalacja (Linux):

```bash
git clone https://github.com/affaan-m/ECC.git /tmp/ECC
mkdir -p .cursor/rules/ecc
cp -r /tmp/ECC/rules/common .cursor/rules/ecc/
cp -r /tmp/ECC/rules/typescript .cursor/rules/ecc/
```

---

### 2. Skills — najważniejsze dla Twojego stacku

Skills to pliki SKILL.md ładowane przez agenta jako kontekst domenowy. Dla projektu najbardziej wartościowe:


| Skill                    | Co daje                                                                                                 | Ścieżka                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `frontend-patterns`      | React/Next.js 15 component patterns, Tailwind conventions, Server Actions workflow, accessibility       | `skills/frontend-patterns/`      |
| `database-migrations`    | Wzorce migracji Drizzle ORM (jest w nim wprost), rollback patterns, schema evolution                    | `skills/database-migrations/`    |
| `api-design`             | Server Actions jako API surface, REST/pagination/error responses                                        | `skills/api-design/`             |
| `deployment-patterns`    | Docker Compose dev, PM2 prod deploy — **dokładnie Twój setup** (Docker dev + PM2 prod)                  | `skills/deployment-patterns/`    |
| `docker-patterns`        | Docker Compose networking, volumes, multi-service healthchecks                                          | `skills/docker-patterns/`        |
| `security-review`        | Auth.js session hardening, bcrypt cost factor, OWASP Top 10 dla Next.js                                 | `skills/security-review/`        |
| `tdd-workflow`           | TDD w TypeScript strict, test-first dla Server Actions                                                  | `skills/tdd-workflow/`           |
| `e2e-testing`            | Playwright Page Object Model dla Next.js App Router                                                     | `skills/e2e-testing/`            |
| `search-first`           | Research-before-coding workflow — szczególnie przydatny przy Drizzle/Auth.js (szybko ewoluujące API)    | `skills/search-first/`           |
| `nextjs-turbopack`       | Next.js 15 + Turbopack specifics (z v1.9.0)                                                             | `skills/nextjs-turbopack/`       |
| `bun-runtime`            | Jeśli rozważasz Bun jako runtime dla PM2                                                                | `skills/bun-runtime/`            |
| `continuous-learning-v2` | Instinct-based learning — agent uczy się Twoich wzorców z sesji i zapisuje je jako reużywalne instinkty | `skills/continuous-learning-v2/` |


---

### 3. Agenci — delegowanie zadań

Najużyteczniejszy zestaw dla projektu Next.js:

- `**typescript-reviewer`** — code review TypeScript strict, sprawdza czy nie ma `any`, zbędnych `use client`, etc.
- `**code-reviewer**` — ogólny quality + security review
- `**security-reviewer**` — Auth.js session vulnerabilities, CSRF, SQL injection przez Drizzle
- `**database-reviewer**` — Drizzle query patterns, N+1, missing indexes na mysql2
- `**build-error-resolver**` — Next.js 15 build errors (których jest sporo przy Tailwind v4 + strict TS)
- `**doc-updater**` — sync dokumentacji po zmianach w API/schema
- `**e2e-runner**` — Playwright testy krytycznych ścieżek

Użycie w Cursor (po instalacji):

```
/ecc:plan "Add drag-and-drop board reordering with dnd-kit"
```

---

### 4. Hooki — automatyzacje na triggerach

Kluczowe hooki dla workflow:

- `memory-persistence/` — SessionStart/Stop hooki zapisujące i ładujące kontekst projektu między sesjami Cursor. Szczególnie wartościowe jeśli jest złożony Drizzle schema lub custom Auth.js config — agent "pamięta" strukturę między sesjami.
- `**strategic-compact/**` — sugeruje compaction gdy kontekst rośnie (PM2 deploy scripts, Docker configs mogą szybko zasycić okno)
- **Hook runtime controls** — zmienne środowiskowe do tuningu:
  ```bash
  export ECC_HOOK_PROFILE=standard
  export ECC_SESSION_START_MAX_CHARS=6000  # ogranicza token usage
  ```

Instalacja hooków (Linux, tylko hooks-runtime):

```bash
cd /tmp/ECC && bash ./install.sh --target cursor --modules hooks-runtime
```

---

### 5. Przykładowy CLAUDE.md / project config dla Next.js

ECC dostarcza `examples/saas-nextjs-CLAUDE.md` — gotowy template dla projektu Next.js + baza + auth. Skopiuj go jako `.cursor/context.md` lub `CLAUDE.md` i dostosuj pod swój stack (podmień Supabase → Drizzle+mysql2, NextAuth → Auth.js v5).

---

### 6. PM2 commands — bonus dopasowany do projektu

ECC v1.4.0 dodało dedykowany command `/pm2` dla PM2 lifecycle management. Mamy PM2 na produkcji — to bezpośrednie trafienie:

- `/pm2` — service lifecycle (start, stop, restart, logs, monit)
- `/multi-backend` — orchestracja multi-service workflows (przydatne jeśli jest Next.js + osobny serwis)

---

### Linki do plików/katalogów

**Cursor-specific:**

- [https://github.com/affaan-m/ECC/tree/main/.cursor](https://github.com/affaan-m/ECC/tree/main/.cursor) — Cursor hooks, rules, MCP configs przetłumaczone dla Cursor

**Rules:**

- [https://github.com/affaan-m/ECC/tree/main/rules/common](https://github.com/affaan-m/ECC/tree/main/rules/common)
- [https://github.com/affaan-m/ECC/tree/main/rules/typescript](https://github.com/affaan-m/ECC/tree/main/rules/typescript)

**Skills dla stacku:**

- [https://github.com/affaan-m/ECC/tree/main/skills/frontend-patterns](https://github.com/affaan-m/ECC/tree/main/skills/frontend-patterns)
- [https://github.com/affaan-m/ECC/tree/main/skills/database-migrations](https://github.com/affaan-m/ECC/tree/main/skills/database-migrations)
- [https://github.com/affaan-m/ECC/tree/main/skills/deployment-patterns](https://github.com/affaan-m/ECC/tree/main/skills/deployment-patterns)
- [https://github.com/affaan-m/ECC/tree/main/skills/docker-patterns](https://github.com/affaan-m/ECC/tree/main/skills/docker-patterns)
- [https://github.com/affaan-m/ECC/tree/main/skills/api-design](https://github.com/affaan-m/ECC/tree/main/skills/api-design)
- [https://github.com/affaan-m/ECC/tree/main/skills/security-review](https://github.com/affaan-m/ECC/tree/main/skills/security-review)
- [https://github.com/affaan-m/ECC/tree/main/skills/tdd-workflow](https://github.com/affaan-m/ECC/tree/main/skills/tdd-workflow)
- [https://github.com/affaan-m/ECC/tree/main/skills/e2e-testing](https://github.com/affaan-m/ECC/tree/main/skills/e2e-testing)
- [https://github.com/affaan-m/ECC/tree/main/skills/search-first](https://github.com/affaan-m/ECC/tree/main/skills/search-first)
- [https://github.com/affaan-m/ECC/tree/main/skills/continuous-learning-v2](https://github.com/affaan-m/ECC/tree/main/skills/continuous-learning-v2)

**Agenci:**

- [https://github.com/affaan-m/ECC/tree/main/agents](https://github.com/affaan-m/ECC/tree/main/agents)

**Hooki:**

- [https://github.com/affaan-m/ECC/tree/main/hooks](https://github.com/affaan-m/ECC/tree/main/hooks)

**Przykłady project configs:**

- [https://github.com/affaan-m/ECC/blob/main/examples/saas-nextjs-CLAUDE.md](https://github.com/affaan-m/ECC/blob/main/examples/saas-nextjs-CLAUDE.md)

**Commands (PM2 + planner):**

- [https://github.com/affaan-m/ECC/blob/main/commands/pm2.md](https://github.com/affaan-m/ECC/blob/main/commands/pm2.md)
- [https://github.com/affaan-m/ECC/blob/main/commands/plan.md](https://github.com/affaan-m/ECC/blob/main/commands/plan.md)

**Instrukcja instalacji dla Cursor:**

- [https://github.com/affaan-m/ECC/blob/main/install.sh](https://github.com/affaan-m/ECC/blob/main/install.sh) (flaga `--target cursor`)

---

**Praktyczna rada:** zacznij od `rules/common` + `rules/typescript` + skill `deployment-patterns` (masz PM2+Docker wprost opisane). Reszta skillów dodawaj on-demand przy konkretnych zadaniach — ładowanie wszystkiego na raz tylko zasyci okno kontekstowe.