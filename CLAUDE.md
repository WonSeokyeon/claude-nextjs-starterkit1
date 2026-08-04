# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

Next.js 16 uses **Turbopack** by default for dev and build (faster than Webpack). Run commands directly with `npm`; `next lint` was removed in favor of bare `eslint`.

### Core Development
- **`npm run dev`** — Start dev server on `http://localhost:3000`.
- **`npm run build`** — Build for production.
- **`npm run start`** — Start production server.
- **`npm run lint`** — Run ESLint.
- **`npx tsc --noEmit`** — Type-check without emitting (useful for CI/pre-commit).

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

## MCP Servers

This project uses three MCP servers for developer productivity, configured in `.mcp.json`:

| Server | Purpose |
|--------|---------|
| `@playwright/mcp` | Browser automation (e.g., screenshot, filling forms). **Not a test framework** — no Playwright test runner is installed. |
| `context7` | Fetch latest docs for libraries/frameworks (React, Next.js, Tailwind, Zod, etc.). Use when updating or building against unfamiliar APIs. |
| `sequential-thinking` | Multi-step reasoning for complex problems; helps structure approach before coding. |

## Next.js 16 Notes

The installed version is **`next@16.2.12`** with **`react@19.2.4`** — both newer than typical training data. Always consult `node_modules/next/dist/docs/` (bundled with the CLI) before writing APIs that might differ from your knowledge base (see `@AGENTS.md`).

**Key differences from older Next.js:**
- Turbopack enabled by default for dev & build
- `next lint` command removed → use `eslint` directly
- `params`, `searchParams`, `cookies`, `headers` are now fully async (not currently used in this project, but important for future routes)

## File Structure

- **No `src/` folder** — `app/`, `components/`, `lib/` sit directly in the project root
- **tsconfig path alias**: `@/*` maps to project root `./*`, so new layers don't need config changes
- **Routes**: Single route only — `app/page.tsx` is the only page; `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx` are convention files (not additional routes).
- **Environment**: `.env` and `.env.example` files exist at project root for configuration.
- **CSS in** `app/globals.css` with Tailwind v4 + CSS variables + dark mode support

## 코드 리뷰 및 커밋 자동화

**코드 리뷰**: 구현 완료 후 `code-reviewer` 서브에이전트를 호출하여 가독성·성능·안정성·프로젝트 컨벤션 기준으로 심층 분석.
- **위치**: `.claude/agents/code-reviewer.md`
- **호출 방식**: 메인 에이전트가 자동으로 호출 (사용자 명시 불필요)
- **권한**: Read, Grep, Glob (읽기 전용)

**커밋**: `/git:commit` 커스텀 커맨드 (또는 `/commit`)를 사용하면 이모지+컨벤셔널 커밋 규칙을 따른 포맷된 커밋 메시지를 생성.
- **위치**: `.claude/commands/git/commit.md`
