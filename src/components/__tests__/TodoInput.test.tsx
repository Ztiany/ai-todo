import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoInput } from '../TodoInput';

describe('TodoInput', () => {
  it('renders input with placeholder', () => {
    render(<TodoInput onAdd={vi.fn()} placeholder="Test placeholder" />);

    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('calls onAdd when form is submitted', async () => {
    const mockAdd = vi.fn().mockResolvedValue(undefined);
    render(<TodoInput onAdd={mockAdd} placeholder="Add a task..." />);

    const input = screen.getByPlaceholderText('Add a task...');
    const button = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'Test task' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAdd).toHaveBeenCalledWith('Test task');
    });
  });

  it('clears input after submission', async () => {
    const mockAdd = vi.fn().mockResolvedValue(undefined);
    render(<TodoInput onAdd={mockAdd} placeholder="Add a task..." />);

    const input = screen.getByPlaceholderText('Add a task...');
    const button = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'Test task' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('does not submit empty input', () => {
    const mockAdd = vi.fn();
    render(<TodoInput onAdd={mockAdd} placeholder="Add a task..." />);

    const button = screen.getByText('Add');
    fireEvent.click(button);

    expect(mockAdd).not.toHaveBeenCalled();
  });

  it('shows AI Breakdown button for ai variant', () => {
    render(
      <TodoInput
        onAdd={vi.fn()}
        onAIBreakdown={vi.fn()}
        variant="ai"
        placeholder="Enter a big task..."
      />
    );

    expect(screen.getByText('AI Breakdown')).toBeInTheDocument();
  });

  it('disables input when loading', () => {
    render(
      <TodoInput
        onAdd={vi.fn()}
        onAIBreakdown={vi.fn()}
        variant="ai"
        isLoading={true}
        placeholder="Enter a big task..."
      />
    );

    const input = screen.getByPlaceholderText('Enter a big task...');
    expect(input).toBeDisabled();
  });
});
