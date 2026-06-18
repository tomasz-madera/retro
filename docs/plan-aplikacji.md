---
name: Retro App Stack
overview: Aplikacja Scrum Retro (tablice z kolumnami, kartami, drag-and-drop) w stylu retro. Next.js + MySQL (baza planningpoker — legacy name) + Docker Compose (dev) + PM2 (prod na it.edunetwork.pl).
todos:
  - id: server-check
    content: Uruchomić komendy diagnostyczne na serwerze i przekazać wyniki
    status: completed
  - id: db-backup
    content: "Backup prod DB planningpoker (mysqldump) → backups/ w projekcie — PRZED migracjami"
    status: pending
  - id: scaffold
    content: Zainicjalizować Next.js + Docker Compose (Caddy → retro.localhost) + Dockerfile
    status: pending
  - id: db-layer
    content: Drizzle ORM + MySQL schema (users, retros, columns, cards) + migracje + seed admina
    status: pending
  - id: auth
    content: Rejestracja, logowanie, sesje, role user/admin (Auth.js + bcrypt)
    status: pending
  - id: retro-theme
    content: Retro layout (fonty, paleta, scanlines CSS, komponenty UI)
    status: pending
  - id: retro-list
    content: Lista retr — aktywne i historyczne (zamknięte)
    status: pending
  - id: retro-board
    content: Tworzenie tablicy + konfiguracja kolumn (nazwa, ilość, kolejność)
    status: pending
  - id: retro-cards-dnd
    content: Karty w kolumnach + drag-and-drop między kolumnami (@dnd-kit)
    status: pending
  - id: docker-deploy
    content: Docker Compose (dev) + PM2 + vhost prod na it.edunetwork.pl
    status: pending
isProject: false
---

# Scrum Retro App — plan implementacji

## Cel aplikacji

**Scrum Retrospective Board** — aplikacja webowa do prowadzenia retrospektyw zespołu. Estetyka retro (terminal/CRT), nie planning poker.

Baza MySQL nazywa się **`planningpoker`** (legacy — nie zmieniamy nazwy DB, tylko tworzymy własne tabele).

---

## Wymagania funkcjonalne

| # | Funkcja | Szczegóły |
|---|---------|-----------|
| 1 | **Rejestracja użytkowników** | email + hasło, walidacja Zod |
| 2 | **Logowanie / sesja** | Auth.js, cookie session |
| 3 | **Role** | `user` (domyślna), `admin` (zarządzanie użytkownikami, pełny dostęp) |
| 4 | **Lista retr** | Widok aktywnych (`status=active`) i historycznych (`status=closed`) |
| 5 | **Nowa tablica retro** | Tytuł, definicja kolumn (nazwa + ilość), domyślny szablon opcjonalnie |
| 6 | **Tablica retro** | Kolumny w poziomym układzie kanban |
| 7 | **Karty / wiadomości** | Użytkownik dodaje tekst do kolumny (autor + timestamp) |
| 8 | **Drag & drop** | Przeciąganie kart między kolumnami, persystencja pozycji w DB |
| 9 | **Zamykanie retro** | Admin/twórca zamyka → trafia do historii |

---

## Stack technologiczny

```mermaid
flowchart TB
    subgraph browser [Przeglądarka]
        Pages[App Router pages]
        DnD["@dnd-kit drag-drop"]
        Theme[Retro Tailwind CSS]
    end
    subgraph app [Next.js]
        API[Route Handlers / Server Actions]
        Auth[Auth.js v5]
    end
    subgraph data [Dane]
        MySQL[(MySQL planningpoker)]
    end
    Pages --> API
    DnD --> API
    API --> Auth
    API --> MySQL
```

| Warstwa | Technologia |
|---------|-------------|
| Framework | Next.js 15, App Router, Server Actions |
| Język | TypeScript strict |
| UI | Tailwind CSS v4, retro fonty (`VT323`, `Press Start 2P`) |
| Auth | **Auth.js v5** + `bcryptjs` + credentials provider |
| ORM | **Drizzle ORM** + `mysql2` |
| Walidacja | Zod |
| Drag & drop | **@dnd-kit/core** + **@dnd-kit/sortable** |
| Dev runtime | **Docker Compose** (app + opcjonalny MySQL lokalny) |
| Prod runtime | **PM2** na `it.edunetwork.pl` (serwer bez Dockera) |

---

## Model danych (nowe tabele w `planningpoker`)

Prefiks `retro_` — unikamy kolizji ze starymi tabelami planning poker.

```mermaid
erDiagram
    retro_users ||--o{ retro_boards : creates
    retro_users ||--o{ retro_cards : authors
    retro_boards ||--|{ retro_columns : has
    retro_columns ||--o{ retro_cards : contains

    retro_users {
        int id PK
        varchar email UK
        varchar password_hash
        enum role "user|admin"
        timestamp created_at
    }
    retro_boards {
        int id PK
        varchar title
        enum status "active|closed"
        int created_by FK
        timestamp created_at
        timestamp closed_at
    }
    retro_columns {
        int id PK
        int board_id FK
        varchar name
        int position
    }
    retro_cards {
        int id PK
        int column_id FK
        int author_id FK
        text content
        int position
        timestamp created_at
        timestamp updated_at
    }
```

**Uwagi:**
- Przed migracją sprawdzić istniejące tabele: `SHOW TABLES` w bazie `planningpoker`
- Kolumny definiowane przy tworzeniu tablicy (nie edytowalne po starcie — v1; rozszerzenie później)
- `position` na kartach i kolumnach — sortowanie + DnD

---

## Struktura projektu

```
retro/
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx
│   │   ├── (auth)/register/page.tsx
│   │   ├── page.tsx                    # lista retr
│   │   ├── retro/new/page.tsx          # kreator tablicy
│   │   ├── retro/[id]/page.tsx         # tablica kanban + DnD
│   │   ├── admin/users/page.tsx        # tylko admin
│   │   └── api/auth/[...nextauth]/route.ts
│   ├── components/
│   │   ├── board/                      # Board, Column, Card, AddCardForm
│   │   ├── retro/                      # CRTScreen, RetroButton, Terminal
│   │   └── layout/                     # Header, Nav
│   ├── lib/
│   │   ├── db/schema.ts
│   │   ├── db/index.ts
│   │   ├── auth.ts
│   │   └── validators/                 # Zod schemas
│   └── actions/                        # Server Actions (createBoard, moveCard...)
├── drizzle/
├── backups/                            # dumpy prod (gitignore!)
│   ├── .gitkeep
│   └── planningpoker_2026-06-18.sql    # pełny backup przed migracjami
├── docker/
│   └── Caddyfile                       # reverse proxy → retro.localhost
├── docker-compose.yml
├── docker-compose.prod.yml             # tylko app, zewnętrzna DB
├── Dockerfile
├── .env.example
├── .env.local                          # gitignore
├── drizzle.config.ts
├── ecosystem.config.js                 # PM2 prod
└── README.md
```

---

## Docker Compose

### URL lokalny: `http://retro.localhost`

Po `docker compose up` aplikacja dostępna pod **http://retro.localhost** (port 80, bez `:3000`).

Architektura dev:

```mermaid
flowchart LR
    Browser[Przeglądarka] -->|":80 retro.localhost"| Caddy[Caddy]
    Caddy -->|proxy| App[Next.js :3000]
    App --> MySQL[(MySQL)]
```

- **Caddy** — reverse proxy, routing po hoście `retro.localhost`
- **app** — Next.js, port 3000 tylko w sieci Docker (bez mapowania na host)
- **mysql** — lokalna baza dev

Jeśli `retro.localhost` nie rozwiązuje się automatycznie (Linux), dodaj do `/etc/hosts`:

```
127.0.0.1 retro.localhost
```

### `docker/Caddyfile`

```
retro.localhost {
    reverse_proxy app:3000
}
```

### `docker-compose.yml` — development (app + MySQL + Caddy)

```yaml
services:
  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
    volumes:
      - ./docker/Caddyfile:/etc/caddy/Caddyfile:ro
    depends_on:
      - app

  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: dev
    expose:
      - "3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      DATABASE_URL: mysql://retro:retro@mysql:3306/planningpoker
      AUTH_SECRET: dev-secret-change-me
      AUTH_URL: http://retro.localhost
    depends_on:
      mysql:
        condition: service_healthy
    command: pnpm dev

  mysql:
    image: mysql:8.4
    ports:
      - "3307:3306"          # opcjonalnie — dostęp z hosta do debugowania DB
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: planningpoker
      MYSQL_USER: retro
      MYSQL_PASSWORD: retro
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  mysql_data:
```

Uruchomienie: `docker compose up` → otwórz **http://retro.localhost**

### `docker-compose.prod.yml` — produkcja / staging (tylko app, zewnętrzna DB)

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runner
    ports:
      - "3000:3000"
    env_file: .env.local
    restart: unless-stopped
    environment:
      NODE_ENV: production
```

Uruchomienie prod (gdy Docker dostępny):
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### `Dockerfile` (multi-stage)

```dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

W `next.config.ts`: `output: 'standalone'`.

### Dev vs prod — baza danych

| Środowisko | URL | Baza |
|------------|-----|------|
| **Dev lokalny (Docker)** | **http://retro.localhost** | MySQL w kontenerze |
| **Dev lokalny (VPN)** | localhost / retro.localhost | `db10-lab.csk.lan` |
| **Prod** | https://it.edunetwork.pl | `db10-lab.csk.lan` |

---

## Baza danych: MySQL (`planningpoker`)

Nazwa bazy to legacy — **aplikacja to Scrum Retro**, tabele mają prefiks `retro_`.

```env
# .env.example
DB_HOST=db10-lab.csk.lan
DB_PORT=3306
DB_DATABASE=planningpoker
DB_USERNAME=planningpoker
DB_PASSWORD=
DATABASE_URL=mysql://planningpoker:PASSWORD@db10-lab.csk.lan:3306/planningpoker
AUTH_SECRET=generate-with-openssl-rand-base64-32
AUTH_URL=http://retro.localhost          # dev Docker; prod: https://it.edunetwork.pl
SEED_ADMIN_EMAIL=tomasz.madera@wskz.pl
SEED_ADMIN_PASSWORD=          # hasło startowe — tylko w .env.local, nie w repo
```

### Backup produkcyjny — PRZED jakimikolwiek migracjami

**Pierwszy krok implementacji.** Pełny dump bazy `planningpoker` z `db10-lab.csk.lan` → katalog `backups/` w projekcie.

```bash
mkdir -p backups

mysqldump \
  --defaults-extra-file=backups/.my.cnf \
  --single-transaction \
  --routines --triggers --events \
  --hex-blob --set-gtid-purged=OFF \
  planningpoker \
  > "backups/planningpoker_$(date +%Y-%m-%d_%H%M%S).sql"
```

Plik `backups/.my.cnf` (gitignore, chmod 600):

```ini
[client]
host=db10-lab.csk.lan
port=3306
user=planningpoker
password=<hasło>
```

Alternatywa — dump z serwera prod + scp na maszynę dev:

```bash
ssh -p 3141 wskz0020@it.edunetwork.pl
sudo su - it
mysqldump -h db10-lab.csk.lan -u planningpoker -p \
  --single-transaction --routines --triggers --events \
  planningpoker > /tmp/planningpoker_backup.sql
```

**Gitignore:** `backups/*.sql`, `backups/.my.cnf` — dumpy prod nie trafiają do repo (tylko `backups/.gitkeep`).

**Restore:** `mysql --defaults-extra-file=backups/.my.cnf planningpoker < backups/planningpoker_YYYY-MM-DD.sql`

Po backupie: `SHOW TABLES` — inwentaryzacja istniejących tabel przed migracją `retro_*`.

---

## Kluczowe ekrany i flow

```mermaid
flowchart TD
    Start[Start] --> Login{Zalogowany?}
    Login -->|Nie| Register[/register]
    Login -->|Tak| Dashboard[Lista retr]
    Register --> Dashboard
    Dashboard --> NewRetro[Utwórz retro]
    Dashboard --> OpenRetro[Otwórz tablicę]
    Dashboard --> History[Historia]
    NewRetro --> Config[Konfiguracja kolumn]
    Config --> Board[Tablica kanban]
    OpenRetro --> Board
    Board --> AddCard[Dodaj kartę]
    Board --> DragCard[Przeciągnij kartę]
    AddCard --> Board
    DragCard --> Board
    Board --> Close[Zamknij retro]
    Close --> History
```

---

## Drag & drop — implementacja

Biblioteka: **@dnd-kit** (nowoczesna, dobrze znana agentom LLM).

Flow:
1. Frontend: `DndContext` + `SortableContext` per kolumna + cross-column `onDragEnd`
2. Optimistic UI — natychmiastowa aktualizacja
3. Server Action `moveCard(cardId, targetColumnId, newPosition)` — persystencja w MySQL
4. Przy drop między kolumnami: aktualizacja `column_id` + przeliczenie `position`

---

## Auth i uprawnienia

| Akcja | user | admin |
|-------|------|-------|
| Rejestracja | tak | tak |
| Tworzenie retro | tak | tak |
| Dodawanie kart | tak | tak |
| Przeciąganie kart | tak | tak |
| Zamykanie retro | twórca lub admin | tak |
| Panel admin (users) | nie | tak |
| Podgląd historycznych | tak | tak |

### Seed — pierwszy admin

Skrypt `src/lib/db/seed.ts`, uruchamiany: `pnpm db:seed`

| Pole | Wartość |
|------|---------|
| Email | `tomasz.madera@wskz.pl` |
| Rola | `admin` |
| Hasło | z env `SEED_ADMIN_PASSWORD` (bcrypt hash w DB) |

Logika seed:
- Idempotentny — jeśli użytkownik z tym emailem już istnieje, **pomija** (nie nadpisuje hasła)
- Hasło hashowane `bcryptjs` (cost 12)
- Uruchamiany raz po migracjach: lokalnie i na prod

```typescript
// src/lib/db/seed.ts (szkic)
const email = process.env.SEED_ADMIN_EMAIL ?? 'tomasz.madera@wskz.pl';
const password = process.env.SEED_ADMIN_PASSWORD;
if (!password) throw new Error('SEED_ADMIN_PASSWORD required');
// insert into retro_users if not exists, role='admin'
```

W `package.json`: `"db:seed": "tsx src/lib/db/seed.ts"`

**Bezpieczeństwo:** hasło startowe podane przy setupie — zmień po pierwszym logowaniu lub przez panel admin.

---

## Fazy implementacji

### Faza 0 — Backup prod (obowiązkowo pierwsze)
- Połączenie z `db10-lab.csk.lan` (VPN)
- `mysqldump` całej bazy `planningpoker` → `backups/planningpoker_<data>.sql`
- `SHOW TABLES` — inwentaryzacja istniejących tabel
- `.gitignore` dla `backups/*.sql`

### Faza 1 — Fundament
- Scaffold Next.js + Docker Compose + Dockerfile
- Drizzle schema + migracje (`retro_*` tabele) — **dopiero po backupie**
- Auth (register, login, middleware chroniący routes)
- Seed admina (`tomasz.madera@wskz.pl`)

### Faza 2 — Retro UI + lista
- Theme retro (CSS, fonty, layout)
- Dashboard: aktywne / historyczne retr
- Formularz tworzenia tablicy z dynamicznymi kolumnami

### Faza 3 — Tablica kanban
- Widok tablicy z kolumnami i kartami
- Dodawanie kart (Server Action)
- Drag & drop z persystencją

### Faza 4 — Admin + deploy
- Panel admin (lista użytkowników, zmiana roli)
- Zamykanie retro
- PM2 + vhost na `it.edunetwork.pl`
- README z instrukcją `docker compose up` i deploy prod

---

## Produkcja: it.edunetwork.pl

| Parametr | Wartość |
|----------|---------|
| SSH | `ssh -p 3141 wskz0020@it.edunetwork.pl` |
| Deploy user | `sudo su - it` |
| Hostname | `php8.edunetwork.pl` |
| Docker na serwerze | **BRAK** → prod via **PM2 + nvm** |
| Reverse proxy | istniejący Apache/Nginx → `:3000` |

Docker Compose = **dev lokalny**. Prod = PM2 (alternatywnie Docker gdy root zainstaluje).

---

## Inicjalizacja (po akceptacji)

**Krok 0 — backup (przed wszystkim):**

```bash
mkdir -p /home/tomek/Projects/retro/backups
# utwórz backups/.my.cnf, potem mysqldump → backups/planningpoker_<data>.sql
```

**Krok 1+ — scaffold:**

```bash
cd /home/tomek/Projects/retro
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir
pnpm add drizzle-orm mysql2 zod bcryptjs next-auth@beta @auth/drizzle-adapter
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
pnpm add -D drizzle-kit vitest @testing-library/react @types/bcryptjs
# pliki: docker-compose.yml, docker-compose.prod.yml, Dockerfile, drizzle schema
docker compose up -d          # dev → http://retro.localhost
pnpm drizzle-kit migrate      # migracje
pnpm db:seed                  # admin: tomasz.madera@wskz.pl
```

---

## Podsumowanie

**Scrum Retro App**: tablice retrospektyw z konfigurowalnymi kolumnami, kartami użytkowników i drag-and-drop. Stack: **Next.js + Drizzle + MySQL (planningpoker) + Auth.js + @dnd-kit**. Dev: **Docker Compose**. Prod: **PM2** na `it.edunetwork.pl`. **Pierwszy krok: backup prod DB do `backups/` przed migracjami.**
