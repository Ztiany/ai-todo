# AI Todo

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

An AI-powered todo list application that helps users break down vague tasks into executable sub-tasks.

</div>

## Features

- **Task Management**: Add, complete, delete, and edit tasks
- **AI Breakdown**: Enter vague tasks and let AI break them into 3-5 actionable steps
- **Tree Structure**: View tasks with parent-child relationships
- **Data Persistence**: All data stored in Supabase (PostgreSQL)
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, Tailwind CSS 4, Next.js 16 |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| AI | MiniMax API |
| Testing | Vitest |

## Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun
- Supabase account

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Ztiany/ai-todo.git
cd ai-todo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# MiniMax API (required for AI breakdown)
OPENAI_API_URL=https://api.minimaxi.com/v1
OPENAI_API_KEY=your_api_key
```

### 4. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Create the `todos` table with the following schema:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Task title |
| description | text | Detailed description (optional) |
| is_completed | boolean | Completion status |
| parent_id | uuid | Parent task ID (for subtasks) |
| priority | text | 'high', 'medium', 'low' (optional) |
| due_date | timestamptz | Due date (optional) |
| tags | text[] | Tags array |
| remind_at | timestamptz | Reminder time (optional) |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

3. Enable Row Level Security (RLS) policies as needed

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Tasks

1. **Quick Task**: Type in the first input box and click "Add"
2. **AI Breakdown**: Type a vague task (e.g., "prepare product launch") in the second input and click "AI Breakdown" to automatically generate subtasks

### Managing Tasks

- **Complete**: Click the checkbox to toggle completion status
- **Edit**: Double-click the task title to edit
- **Delete**: Click the trash icon (confirms if task has subtasks)
- **Expand/Collapse**: Click the arrow icon to show/hide subtasks

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |

## Project Structure

```
ai-todo/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── todos/           # Todo API routes
│   │   │   │   ├── route.ts     # GET/POST todos
│   │   │   │   └── [id]/route.ts # PATCH/DELETE single todo
│   │   │   └── ai-breakdown/    # AI breakdown API
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx             # Main page
│   ├── components/              # React components
│   │   ├── TodoInput.tsx
│   │   ├── TodoItem.tsx
│   │   └── TodoList.tsx
│   ├── lib/                     # Utilities
│   │   ├── supabase.ts          # Supabase client
│   │   └── openai.ts            # OpenAI/MiniMax client
│   └── types/                   # TypeScript types
│       └── todo.ts
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── package.json
└── README.md
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/todos | Fetch all todos |
| POST | /api/todos | Create new todo |
| PATCH | /api/todos/[id] | Update todo |
| DELETE | /api/todos/[id] | Delete todo |
| POST | /api/ai-breakdown | AI task breakdown |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Self-hosted

```bash
npm run build
npm run start
```

## Troubleshooting

### Port already in use

```bash
# Find process
netstat -ano | grep 3000
# Kill process
taskkill //F //PID <process-id>
```

### Turbopack lock error

```bash
taskkill //F //IM node.exe
rm -rf .next/dev/lock
npm run dev
```

### MiniMax API model not found

Ensure you're using MiniMax models only:
- `MiniMax-M2.5`
- `MiniMax-M2.1`
- `MiniMax-M2`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.
