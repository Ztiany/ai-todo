'use client';

import { useState, useEffect, useCallback } from 'react';
import { Todo, ApiResponse, AIBreakdownResponse } from '@/types/todo';
import { TodoInput } from '@/components/TodoInput';
import { TodoList } from '@/components/TodoList';

/**
 * Home - Main page component for AI Todo app
 * Manages todo state and API interactions
 */
export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  /**
   * fetchTodos - Fetches all todos from API
   */
  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/todos');
      const data: ApiResponse<Todo[]> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch todos');
      }

      setTodos(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * handleAddTodo - Adds a new todo
   */
  const handleAddTodo = async (title: string) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      const data: ApiResponse<Todo> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to add todo');
      }

      // Refetch all todos to get updated list
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    }
  };

  /**
   * handleAIBreakdown - Uses AI to break down a task
   */
  const handleAIBreakdown = async (task: string) => {
    setIsAILoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      });

      const data: ApiResponse<AIBreakdownResponse> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'AI breakdown failed');
      }

      // Refetch all todos to get the new parent + subtasks
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI breakdown failed');
    } finally {
      setIsAILoading(false);
    }
  };

  /**
   * handleToggle - Toggles todo completion status
   */
  const handleToggle = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: completed }),
      });

      const data: ApiResponse<Todo> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update todo');
      }

      // Update local state
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, is_completed: completed } : todo
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  /**
   * handleDelete - Deletes a todo
   */
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      const data: ApiResponse<void> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete todo');
      }

      // Remove from local state
      setTodos((prev) => {
        // Remove the todo and all its descendants
        const idsToRemove = new Set<string>();
        const collectDescendants = (parentId: string) => {
          idsToRemove.add(parentId);
          prev
            .filter((t) => t.parent_id === parentId)
            .forEach((t) => collectDescendants(t.id));
        };
        collectDescendants(id);
        return prev.filter((t) => !idsToRemove.has(t.id));
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  /**
   * handleUpdate - Updates todo title
   */
  const handleUpdate = async (id: string, title: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      const data: ApiResponse<Todo> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update todo');
      }

      // Update local state
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, title } : todo))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-emerald-500">AI</span> Todo
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Break down big tasks into actionable steps
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input Section */}
        <div className="space-y-4 mb-8">
          {/* Regular Input */}
          <TodoInput
            onAdd={handleAddTodo}
            placeholder="Add a quick task..."
            buttonText="Add"
          />

          {/* AI Input */}
          <TodoInput
            onAdd={handleAddTodo}
            onAIBreakdown={handleAIBreakdown}
            placeholder="Enter a big task for AI breakdown..."
            variant="ai"
            isLoading={isAILoading}
          />
        </div>

        {/* Todo List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        ) : (
          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}
      </main>
    </div>
  );
}
