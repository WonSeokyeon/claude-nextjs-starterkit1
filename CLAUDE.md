# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

### Core Development
- **`npm run dev`** — Start Turbopack-based development server on `http://localhost:3000`. Next.js 16 uses Turbopack by default for both dev and build.
- **`npm run build`** — Build for production (Turbopack enabled by default).
- **`npm run start`** — Start production server.
- **`npm run lint`** — Run ESLint directly (not `next lint`, which was removed in Next.js 16).
- **`npx tsc --noEmit`** — Type-check without emitting (no npm script provided, but useful for CI/pre-commit).

### Testing
**No test framework is installed** (no Jest, Vitest, or Playwright test). If you need tests, you'll need to add a framework first.

## Architecture: Layered Component Structure

This project uses a **4-layer component architecture** built on top of shadcn/ui. The structure is intentional: instead of following Atomic Design's 5 full levels, only layers actually used in this project scope are included.

```
components/
  ui/            Layer 0 — shadcn CLI-managed primitives (Button, Card, Alert, etc.)
                 → Avoid direct edits; use `shadcn diff` for upgrades
  patterns/      Layer 1 — Reusable "parts" combining primitives (ThemeToggle, EmptyState)
  layout/        Layer 2 — Page skeleton "structure" (SiteHeader, PageContainer, Section, SiteFooter)
  providers/     Layer 3 — Global context wrappers (ThemeProvider)
```

### Layer Boundaries
| Boundary | Criterion | Example |
|----------|-----------|---------|
| Layer 0 ↔ 1 | "Created/managed by shadcn CLI?" | Primitives (button, card) stay in `ui/`; combining them goes to `patterns/` |
| Layer 1 ↔ 2 | "Content part (what) vs. structure (where)?" | ThemeToggle is content (patterns); SiteHeader is structure (layout) |
| Layer 2 ↔ 3 | "Renders UI vs. wraps children?" | SiteHeader renders (layout); ThemeProvider wraps children (providers) |

### Folder Depth
Components live at `components/<layer>/<name>.tsx` — exactly **2 levels deep**. No subfolders within layers. At this scale, filenames suffice for identification.

## shadcn/ui Configuration

- **Style preset**: `radix-nova` (latest shadcn preset), `baseColor: neutral`
- **Icon library**: lucide-react
- **CSS import method** (Next.js 16 + Tailwind v4): `app/globals.css` imports `@import "shadcn/tailwind.css"` — the npm package `shadcn` now ships CSS assets (not CLI-only like older versions)
- **Dark mode**: `next-themes` (class strategy) + `@custom-variant dark (&:is(.dark *))` + `<html suppressHydrationWarning>` (required to prevent hydration mismatch warnings)
- **Adding new components**: Use `npx shadcn add <name>` only; avoid manual edits to `components/ui/` to preserve `shadcn diff` compatibility

## Verified Libraries (No Reinventing Wheels)

| Feature | Library | Why |
|---------|---------|-----|
| Dark mode | next-themes | De facto standard for App Router; class strategy pairs perfectly with Tailwind `dark:` |
| Form validation | react-hook-form + zod + @hookform/resolvers | Uncontrolled components minimize re-renders; type-safe validation schemas |
| Toast notifications | sonner | Official shadcn replacement for deprecated toast; lightweight & accessible |
| Loading/error boundaries | Next.js App Router built-in (`loading.tsx`, `error.tsx`, `not-found.tsx`) | Framework convention; visual layer uses `Skeleton`, `Alert`, `EmptyState` patterns |

## Next.js 16 Notes

The installed version is **`next@16.2.12`** with **`react@19.2.4`** — both newer than typical training data. Always consult `node_modules/next/dist/docs/` (bundled with the CLI) before writing APIs that might differ from your knowledge base (see `@AGENTS.md`).

**Key differences from older Next.js:**
- Turbopack enabled by default for dev & build
- `next lint` command removed → use `eslint` directly
- `params`, `searchParams`, `cookies`, `headers` are now fully async (not currently used in this project, but important for future routes)

## File Structure

- **No `src/` folder** — `app/`, `components/`, `lib/` sit directly in the project root
- **tsconfig path alias**: `@/*` maps to project root `./*`, so new layers don't need config changes
- **Single page**: `app/page.tsx` (home only); `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx` follow Next.js conventions
- **CSS in** `app/globals.css` with Tailwind v4 + CSS variables + dark mode support
