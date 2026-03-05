'use client';

import { Todo, TodoWithChildren } from '@/types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, title: string) => Promise<void>;
}

/**
 * TodoList - Renders todo items in a tree structure
 * @param todos - Flat array of todos from API
 * @param onToggle - Callback when todo completion is toggled
 * @param onDelete - Callback when todo is deleted
 * @param onUpdate - Callback when todo title is updated
 */
export function TodoList({
  todos,
  onToggle,
  onDelete,
  onUpdate,
}: TodoListProps) {
  // Build tree structure from flat array
  const todoTree = buildTodoTree(todos);

  if (todoTree.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <svg
          className="w-16 h-16 mx-auto mb-4 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <p>No tasks yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todoTree.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

/**
 * buildTodoTree - Converts flat todo array to tree structure
 */
function buildTodoTree(todos: Todo[]): TodoWithChildren[] {
  const todoMap = new Map<string, TodoWithChildren>();
  const rootTodos: TodoWithChildren[] = [];

  // First pass: create all nodes with empty children
  todos.forEach((todo) => {
    todoMap.set(todo.id, { ...todo, children: [] });
  });

  // Second pass: build tree
  todos.forEach((todo) => {
    const node = todoMap.get(todo.id)!;
    if (todo.parent_id && todoMap.has(todo.parent_id)) {
      todoMap.get(todo.parent_id)!.children.push(node);
    } else {
      rootTodos.push(node);
    }
  });

  return rootTodos;
}

export default TodoList;
