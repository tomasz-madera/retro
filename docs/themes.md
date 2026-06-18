# Theme System

This app supports multiple visual themes as self-contained packs under `src/themes/`.

## Built-in themes

| ID | Label | Description |
|----|-------|-------------|
| `crt` | CRT | Terminal aesthetic with scanlines and green glow |
| `classic` | Classic | Light sticky-note style board |
| `pink` | Pink | Dark pink gradient with rounded cards |

Users select a theme from the header dropdown. The choice is stored in the `app-theme` cookie.

## Architecture

```
src/
├── lib/theme/          # Registry, provider, hooks, cookie helpers
├── styles/             # Shared layout (base.css) and token names (tokens.css)
└── themes/<name>/      # Portable theme pack
    ├── index.ts        # ThemeModule export
    ├── theme.css       # Colors and theme-specific styles
    ├── Shell.tsx
    ├── AuthPanel.tsx
    ├── Button.tsx
    └── Card.tsx
```

Pages and board components use themed UI through:

- `ThemedShell` in root layout (wraps all pages)
- `ThemedButton`, `ThemedAuthPanel` for server/client boundaries
- `useThemeComponents()` in client components (e.g. `KanbanCard`)

Do **not** import `@/themes/*` outside `lib/theme/registry.ts`.

## Theme contract

Each theme implements `ThemeModule` from `lib/theme/types.ts`:

- **Shell** — page wrapper (background, optional effects)
- **AuthPanel** — login/register container
- **Button** — primary UI button with variants
- **Card** — kanban card appearance (supports `ref`, drag props, `dragging`)

Shared markup uses semantic CSS classes (`app-header`, `app-card`, etc.). Themes style them via `[data-theme="<id>"]` selectors in `theme.css`.

## Adding a new theme

1. Copy `src/themes/_template/` to `src/themes/<id>/`
2. Implement all four components and `theme.css`
3. Export `ThemeModule` from `index.ts`
4. Register in `lib/theme/registry.ts` (`THEME_IDS`, `themes`, `themeList`)
5. Add `ThemeId` union member in `lib/theme/types.ts`
6. Import `theme.css` in `app/globals.css` (or rely on `index.ts` side-effect import via registry)

## Moving a theme to another instance

1. Copy the entire `themes/<name>/` directory
2. Copy or align `lib/theme/types.ts` contract
3. Add one entry to the target app's `registry.ts`
4. Ensure `app/globals.css` imports the theme CSS

Logic (board, auth, database) stays in the main app — only the theme pack moves.
