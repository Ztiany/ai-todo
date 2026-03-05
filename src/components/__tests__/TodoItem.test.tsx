import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '../TodoItem';

const mockTodo = {
  id: '1',
  title: 'Test Task',
  description: null,
  is_completed: false,
  parent_id: null,
  priority: null,
  due_date: null,
  tags: [],
  remind_at: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  children: [],
};

describe('TodoItem', () => {
  it('renders todo title', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('shows completed state with strikethrough', () => {
    render(
      <TodoItem
        todo={{ ...mockTodo, is_completed: true }}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    );

    const title = screen.getByText('Test Task');
    expect(title).toHaveClass('line-through');
  });

  it('calls onToggle when checkbox is clicked', () => {
    const mockToggle = vi.fn();
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockToggle}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    );

    // Find the checkbox button (first button with the checkbox styling)
    const buttons = screen.getAllByRole('button');
    const checkboxButton = buttons[0];
    fireEvent.click(checkboxButton);

    expect(mockToggle).toHaveBeenCalledWith('1', true);
  });

  it('shows children when todo has subtasks', () => {
    const todoWithChildren = {
      ...mockTodo,
      children: [
        { ...mockTodo, id: '2', title: 'Subtask 1', parent_id: '1', children: [] },
      ],
    };

    render(
      <TodoItem
        todo={todoWithChildren}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    );

    expect(screen.getByText('Subtask 1')).toBeInTheDocument();
  });

  it('shows priority badge when priority is set', () => {
    render(
      <TodoItem
        todo={{ ...mockTodo, priority: 'high' }}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    );

    expect(screen.getByText('high')).toBeInTheDocument();
  });
});
