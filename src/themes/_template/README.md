# Theme template

Copy this directory to `src/themes/<your-theme-id>/` and implement:

1. `theme.css` — set `data-theme` selector and token values
2. `Shell.tsx` — page wrapper
3. `AuthPanel.tsx` — auth form container
4. `Button.tsx` — uses `app-button` classes
5. `Card.tsx` — uses `app-card` classes, forwards ref for drag-and-drop
6. `index.ts` — export `ThemeModule` with correct `id` and `label`

Register the theme in `lib/theme/registry.ts`.

See `docs/themes.md` for the full guide.
