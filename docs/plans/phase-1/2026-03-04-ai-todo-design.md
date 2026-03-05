# AI Todo - Design Document

## 1. Project Overview

**Project Name:** AI Todo
**Type:** Web Application
**Core Functionality:** An AI-powered todo list that breaks down vague tasks into actionable sub-tasks, helping users overcome analysis paralysis and boost productivity.
**Target Users:** Anyone who struggles with starting large, ambiguous tasks.

---

## 2. UI/UX Specification

### Layout Structure

- **Container:** Centered, max-width 640px, generous vertical padding
- **Header:** App title centered at top
- **Input Section:** Two-column layout (regular input + AI input)
- **Content Area:** Scrollable todo list below inputs

### Responsive Breakpoints

- Mobile: < 640px (single column, full width)
- Desktop: >= 640px (centered container)

### Visual Design

**Color Palette:**

- Background: `#FAFAFA` (off-white)
- Card Background: `#FFFFFF` (white)
- Primary Text: `#1A1A1A` (near-black)
- Secondary Text: `#6B7280` (gray-500)
- Accent/AI Highlight: `#10B981` (emerald-500)
- Accent Hover: `#059669` (emerald-600)
- Danger: `#EF4444` (red-500)
- Border: `#E5E7EB` (gray-200)
- Completed Text: `#9CA3AF` (gray-400)

**Typography:**

- Font Family: System UI stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
- Heading: 24px, font-weight 700
- Body: 14px, font-weight 400
- Small/Meta: 12px

**Spacing:**

- Base unit: 4px
- Card padding: 16px
- Gap between items: 8px
- Section gap: 24px

**Visual Effects:**

- Card shadow: `0 1px 3px rgba(0,0,0,0.1)`
- Hover shadow: `0 4px 6px rgba(0,0,0,0.1)`
- Border radius: 8px
- Transitions: 150ms ease

### Components

**1. TodoInput (Regular)**

- Plain text input with placeholder "Add a task..."
- Add button (optional: press Enter to submit)
- States: default, focused

**2. TodoInput (AI)**

- Larger input with placeholder "Enter a big task for AI breakdown..."
- AI button with sparkle icon (accent color)
- Loading state with spinner during API call
- States: default, focused, loading, error

**3. TodoItem**

- Checkbox for completion status
- Task title (strikethrough when completed)
- Priority badge (optional)
- Expand/collapse toggle (for parent tasks)
- Action buttons: Edit, Delete (visible on hover)
- States: default, completed, expanded, hover

**4. TodoList**

- Renders root todos recursively
- Indentation for subtasks (16px per level)
- Smooth expand/collapse animation

**5. PriorityBadge**

- Small pill-shaped badge
- Colors: High (#EF4444), Medium (#F59E0B), Low (#10B981)

**6. LoadingSpinner**

- Circular spinner, accent color
- Used during AI breakdown and data loading

---

## 3. Functionality Specification

### Core Features

**Basic Todo Operations:**

1. Add new task (regular input)
2. Mark task as complete/incomplete (checkbox)
3. Delete task (with confirmation for tasks with subtasks)
4. Edit task title (inline or modal)

**AI Breakdown:**

1. User enters vague task in AI input
2. Click "AI Breakdown" button
3. Loading state while API processes
4. Creates parent task + 3-5 subtasks
5. Automatically expands to show subtasks
6. Error handling: display error message if AI fails

### Data Model

**Table: todos**

| Column       | Type      | Required | Default | Description              |
| ------------ | --------- | -------- | ------- | ------------------------ |
| id           | uuid      | Yes      | auto    | Primary key              |
| title        | text      | Yes      | -       | Task title               |
| description  | text      | No       | null    | Detailed description     |
| is_completed | boolean   | Yes      | false   | Completion status        |
| parent_id    | uuid      | No       | null    | Reference to parent task |
| priority     | text      | No       | null    | 'high', 'medium', 'low'  |
| due_date     | timestamp | No       | null    | Due date                 |
| tags         | text[]    | No       | null    | Array of tags            |
| remind_at    | timestamp | No       | null    | Reminder time            |
| created_at   | timestamp | Yes      | now     | Creation timestamp       |
| updated_at   | timestamp | Yes      | now     | Last update timestamp    |

### API Endpoints

**GET /api/todos**

- Returns all todos ordered by created_at desc

**POST /api/todos**

- Creates a new todo
- Body: { title, description?, parent_id?, priority?, due_date?, tags? }

**PATCH /api/todos/[id]**

- Updates a todo
- Body: { title?, description?, is_completed?, priority?, due_date?, tags? }

**DELETE /api/todos/[id]**

- Deletes a todo (cascades to subtasks)

**POST /api/ai-breakdown**

- Takes vague task, returns breakdown
- Body: { task: string }
- Response: { parent_task, subtasks: [{ title }] }

### AI Prompt

```markdown
System: You are a task breakdown assistant. When given a vague task, break it down into 3-5 specific, actionable subtasks that can be completed independently.

Breakdown principles:
1. Each subtask should be doable in 30 minutes or less
2. Keep dependencies minimal
3. Use action-oriented descriptions (start with verb)
4. Consider natural order of operations

Output format (JSON):
{
  "parent_task": "original task description",
  "subtasks": [
    {"title": "subtask 1"},
    {"title": "subtask 2"},
    {"title": "subtask 3"}
  ]
}
```

### Edge Cases

- Empty input: Show validation error
- AI API failure: Show error message, allow retry
- Network failure: Show offline message
- Deleting parent: Confirm and delete all subtasks
- Very long task title: Truncate with ellipsis

---

## 4. Acceptance Criteria

### Visual Checkpoints

- [x] App loads with clean, centered layout
- [x] Two input boxes visible at top
- [x] AI button has accent color highlight
- [x] Tasks display with proper indentation
- [x] Completed tasks have strikethrough
- [x] Expand/collapse works smoothly

### Functional Checkpoints

- [x] Can add regular task
- [x] Can mark task complete/incomplete
- [x] Can delete task
- [x] AI breakdown creates parent + subtasks
- [x] Subtasks appear nested under parent
- [x] Data persists after page reload (Supabase)

### Test Coverage

- [x] All API endpoints have unit tests
- [x] All components have unit tests
- [x] Tests pass locally
