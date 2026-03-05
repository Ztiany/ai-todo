# AI Todo - Claude Development Guide

## Project Overview

An AI-powered todo list application that helps users break down vague tasks into executable sub-tasks, improving actionability and reducing procrastination.

**Tech Stack:**

- **Frontend**: React 19 + Tailwind CSS 4 (via Next.js 16)
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: MiniMax API (proxied via minimaxi)

## Architecture

```properties
ai-todo/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── todos/
│   │   │   │   ├── route.ts          # GET/POST todos
│   │   │   │   └── [id]/route.ts     # PATCH/DELETE single todo
│   │   │   └── ai-breakdown/
│   │   │       └── route.ts           # AI task breakdown
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                   # Main page (client component)
│   ├── components/
│   │   ├── TodoInput.tsx               # Input with AI breakdown button
│   │   ├── TodoItem.tsx               # Single todo with expand/collapse
│   │   └── TodoList.tsx               # List with tree structure
│   ├── lib/
│   │   ├── supabase.ts                 # Supabase client
│   │   ├── openai.ts                  # OpenAI/MiniMax client
│   │   └── __tests__/
│   │       └── api.test.ts             # API validation tests
│   ├── components/__tests__/
│   │   ├── TodoInput.test.tsx
│   │   └── TodoItem.test.tsx
│   ├── test/
│   │   └── setup.ts                   # Vitest setup
│   └── types/
│       └── todo.ts                    # TypeScript interfaces
├── .env.local                         # Environment variables
├── vitest.config.ts                   # Test configuration
└── package.json
```

## Database Schema

**Table: todos**

| Column       | Type        | Description                        |
| ------------ | ----------- | ---------------------------------- |
| id           | uuid        | Primary key                        |
| title        | text        | Task title                         |
| description  | text        | Detailed description (optional)    |
| is_completed | boolean     | Completion status                  |
| parent_id    | uuid        | Parent task ID (for subtasks)      |
| priority     | text        | 'high', 'medium', 'low' (optional) |
| due_date     | timestamptz | Due date (optional)                |
| tags         | text[]      | Tags array                         |
| remind_at    | timestamptz | Reminder time (optional)           |
| created_at   | timestamptz | Creation timestamp                 |
| updated_at   | timestamptz | Last update timestamp              |

## API Endpoints

| Method | Path              | Description                        |
| ------ | ----------------- | ---------------------------------- |
| GET    | /api/todos        | Fetch all todos                    |
| POST   | /api/todos        | Create new todo                    |
| PATCH  | /api/todos/[id]   | Update todo                        |
| DELETE | /api/todos/[id]   | Delete todo (cascades to subtasks) |
| POST   | /api/ai-breakdown | AI task breakdown                  |

## AI Breakdown Feature

The AI breakdown feature uses MiniMax API to split vague tasks into 3-5 actionable subtasks.

**Important Implementation Notes:**

1. **Model**: Uses `MiniMax-M2.5` model (NOT OpenAI models)
2. **Response Parsing**: AI may return responses with `<thinking>` tags or markdown. The API uses `extractJsonFromResponse()` to handle both formats:
   - Pure JSON: `{"parent_task":"...","subtasks":[...]}`
   - With thinking: `<thinking>...</thinking>{"parent_task":"...","subtasks":[...]}`
3. **Prompt**: Located in `src/lib/openai.ts` - emphasizes JSON-only output

## Critical Implementation Details

### Hydration Issues

The app uses `'use client'` directive for all interactive components. To avoid Next.js hydration mismatches:

1. **No browser-specific code**: Avoid `typeof window`, `Date.now()`, `Math.random()` in components
2. **Conditional rendering**: Use ternary expressions instead of dynamic object keys
3. **Suppress warnings**: Added `suppressHydrationWarning` to body tag for browser extension compatibility

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_URL=https://api.minimaxi.com/v1
OPENAI_API_KEY=your_api_key
```

## Development Commands

```bash
# Start development server
npm run dev

# Run unit tests
npm run test        # Watch mode
npm run test:run    # Single run

# Build for production
npm run build

# Lint
npm run lint
```

## Testing

### Unit Tests (Vitest)

- **API Tests**: `src/lib/__tests__/api.test.ts` - Validation logic
- **Component Tests**: `src/components/__tests__/*.test.tsx` - React components

Run: `npm run test:run`

### Manual Testing Checklist

1. **Add Task**
   - [ ] Regular task via first input
   - [ ] AI breakdown via second input

2. **Task Operations**
   - [ ] Toggle completion (checkbox)
   - [ ] Delete task (with subtask confirmation)
   - [ ] Edit task title (double-click)

3. **AI Breakdown**
   - [ ] Enter vague task ("prepare product launch")
   - [ ] Click "AI Breakdown" button
   - [ ] Verify parent + subtasks created
   - [ ] Verify expand/collapse works

4. **Data Persistence**
   - [ ] Tasks persist after page reload

## Known Issues & Solutions

### Issue 1: Port Already in Use

**Error:** `Port 3000 is in use`

**Solution:**

```bash
# Find process
netstat -ano | grep 3000

# Kill process
taskkill //F //PID <process-id>

# Or use different port
npm run dev -- -p 3001
```

### Issue 2: Turbopack Lock Error

**Error:** `Unable to acquire lock at .next/dev/lock`

**Solution:**

```bash
taskkill //F //IM node.exe
rm -rf .next/dev/lock
npm run dev
```

### Issue 3: MiniMax API Model Not Found

**Error:** `unknown model 'gpt-4o-mini'`

**Solution:** Use MiniMax models only:

- `MiniMax-M2.5`
- `MiniMax-M2.1`
- `MiniMax-M2`

### Issue 4: JSON Parse Error in AI Response

**Error:** `Invalid AI response format`

**Cause:** AI returns `<thinking>` tags or markdown

**Solution:** Already handled by `extractJsonFromResponse()` in `src/app/api/ai-breakdown/route.ts`

## Code Quality Standards

- **TypeScript**: Strict mode, all types defined
- **Comments**: English, JSDoc format for functions
- **Testing**: All features must have unit tests
- **Error Handling**: Try-catch with proper error messages

## Future Enhancements

Potential improvements for future iterations:

1. **Task Management**
   - Priority selection (high/medium/low)
   - Due date picker
   - Tags management

2. **AI Features**
   - Task prioritization suggestions
   - Time estimation
   - Recurring tasks

3. **UI/UX**
   - Dark mode
   - Task categories/folders
   - Drag-and-drop reordering

---

**Last Updated:** 2026-03-05
**Status:** Phase 1 Complete ✅
