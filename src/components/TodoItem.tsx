'use client';

import { useState } from 'react';
import { Todo, TodoWithChildren } from '@/types/todo';

interface TodoItemProps {
  todo: TodoWithChildren;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, title: string) => Promise<void>;
  depth?: number;
}

/**
 * TodoItem - Single todo item component with expand/collapse
 * @param todo - Todo object with children
 * @param onToggle - Callback when todo completion is toggled
 * @param onDelete - Callback when todo is deleted
 * @param onUpdate - Callback when todo title is updated
 * @param depth - Nesting depth for indentation
 */
export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  depth = 0,
}: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const hasChildren = todo.children && todo.children.length > 0;

  const handleToggleComplete = async () => {
    await onToggle(todo.id, !todo.is_completed);
  };

  const handleDelete = async () => {
    if (hasChildren) {
      const confirmed = window.confirm(
        `This will also delete ${todo.children.length} subtask(s). Continue?`
      );
      if (!confirmed) return;
    }
    await onDelete(todo.id);
  };

  const handleEdit = async () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      await onUpdate(todo.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      className="group"
      style={{ marginLeft: depth > 0 ? 16 : 0 }}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-150 border border-gray-100 ${
          todo.is_completed ? 'opacity-60' : ''
        }`}
      >
        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-150 flex items-center justify-center ${
            todo.is_completed
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-gray-300 hover:border-emerald-400'
          }`}
        >
          {todo.is_completed && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-150 ${
                isExpanded ? 'rotate-90' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Title */}
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:border-gray-500 outline-none"
            autoFocus
          />
        ) : (
          <span
            className={`flex-1 cursor-pointer ${
              todo.is_completed ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
        )}

        {/* Priority Badge */}
        {todo.priority && <PriorityBadge priority={todo.priority} />}

        {/* Action Buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {todo.children.map((child) => (
            <TodoItem
              key={child.id}
              todo={child}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * PriorityBadge - Shows priority level with color
 */
function PriorityBadge({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const colors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[priority]}`}
    >
      {priority}
    </span>
  );
}

export default TodoItem;
