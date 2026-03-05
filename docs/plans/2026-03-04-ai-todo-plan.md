# AI Todo - Project Plan

## Overview
An AI-powered todo list application that helps users break down vague tasks into executable sub-tasks, improving actionability and reducing procrastination.

## Tech Stack
- Frontend: React + Tailwind CSS (via Next.js)
- Backend: Next.js API Routes
- Database: Supabase (PostgreSQL)
- AI: MiniMax API (proxied via minimaxi)

## Design Documents
- [2026-03-04-ai-todo-design.md](./2026-03-04-ai-todo-design.md)

## Implementation Phases

### Phase 1: Project Setup
- [x] Initialize Next.js project with TypeScript and Tailwind CSS
- [x] Configure environment variables (.env.local)
- [x] Set up Supabase client
- [x] Set up OpenAI client

### Phase 2: Database Setup
- [x] Create `todos` table in Supabase
- [x] Verify table structure with list_tables

### Phase 3: Backend API
- [x] Implement GET /api/todos - Fetch all todos
- [x] Implement POST /api/todos - Create todo
- [x] Implement PATCH /api/todos/[id] - Update todo
- [x] Implement DELETE /api/todos/[id] - Delete todo
- [x] Implement POST /api/ai-breakdown - AI task breakdown
- [x] Write unit tests for all API endpoints

### Phase 4: Frontend UI
- [x] Create TodoInput component (regular + AI input)
- [x] Create TodoItem component (with expand/collapse)
- [x] Create TodoList component
- [x] Create PriorityBadge and TagList components
- [x] Connect frontend to backend APIs
- [x] Write unit tests for components

### Phase 5: Integration & Polish
- [x] Full E2E testing
- [x] Bug fixes and refinements
- [x] Final verification

## Configuration
Environment variables (store in .env.local):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# MiniMax (AI)
OPENAI_API_URL=https://api.minimaxi.com/v1
OPENAI_API_KEY=your_api_key
```
