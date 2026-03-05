# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered todo list app that breaks vague tasks into executable sub-tasks using MiniMax API.

- **Stack**: React 19 + Tailwind CSS 4 + Next.js 16 + Supabase + MiniMax API
- **Status**: Phase 1 Complete

## Development Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run test:run     # Run tests once
npm run build        # Production build
npm run lint         # Lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── todos/        # GET/POST /api/todos, PATCH/DELETE /api/todos/[id]
│   │   └── ai-breakdown/ # POST /api/ai-breakdown
│   ├── page.tsx          # Main client component
│   └── globals.css
├── components/            # React components
├── lib/                   # Supabase & MiniMax clients
└── types/                 # TypeScript interfaces
```

## Key Implementation Notes

### AI Response Parsing

AI may return `<thinking>` tags or markdown. Uses `extractJsonFromResponse()` in `src/app/api/ai-breakdown/route.ts` to handle both formats.

### Hydration Issues

All interactive components use `'use client'`. Avoid `typeof window`, `Date.now()`, `Math.random()` in components. Use ternary expressions instead of dynamic object keys.

### API Model

Uses `MiniMax-M2.5` model (NOT OpenAI models). Configure via `OPENAI_API_URL` and `OPENAI_API_KEY` in `.env.local`.

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_URL=https://api.minimaxi.com/v1
OPENAI_API_KEY=
```

## Troubleshooting

| Issue             | Solution                                        |
| ----------------- | ----------------------------------------------- |
| Port 3000 in use  | `taskkill //F //IM node.exe` then `npm run dev` |
| Turbopack lock    | `rm -rf .next/dev/lock`                         |
| Jest worker error | Kill node processes, remove `.next` cache       |

## Documentation

Detailed documentation available in `docs/`:

- `docs/plans/phase-1/` - Phase 1 plan, design, and retrospective
- `README.md` - Full project documentation
