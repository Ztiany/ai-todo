'use client';

import { useState } from 'react';

interface TodoInputProps {
  onAdd: (title: string) => Promise<void>;
  placeholder?: string;
  buttonText?: string;
  variant?: 'default' | 'ai';
  onAIBreakdown?: (task: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * TodoInput - Input component for adding tasks
 * @param onAdd - Callback when task is added
 * @param placeholder - Input placeholder text
 * @param buttonText - Button text
 * @param variant - 'default' or 'ai' variant
 * @param onAIBreakdown - Callback for AI breakdown (only for 'ai' variant)
 * @param isLoading - Loading state
 */
export function TodoInput({
  onAdd,
  placeholder = 'Add a task...',
  buttonText = 'Add',
  variant = 'default',
  onAIBreakdown,
  isLoading = false,
}: TodoInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (variant === 'ai' && onAIBreakdown) {
      await onAIBreakdown(input.trim());
    } else {
      await onAdd(input.trim());
    }
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        className={`flex-1 px-4 py-2 rounded-lg border transition-all duration-150 ${
          variant === 'ai'
            ? 'border-emerald-200 bg-emerald-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
            : 'border-gray-200 bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-200'
        } outline-none disabled:opacity-50`}
      />
      <button
        type="submit"
        disabled={!input.trim() || isLoading}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
          variant === 'ai'
            ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700'
            : 'bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-950'
        } flex items-center gap-2`}
      >
        {isLoading ? (
          <LoadingSpinner size={variant === 'ai' ? 'sm' : 'md'} />
        ) : variant === 'ai' ? (
          <>
            <SparklesIcon />
            AI Breakdown
          </>
        ) : (
          buttonText
        )}
      </button>
    </form>
  );
}

/**
 * LoadingSpinner - Simple spinner component
 * Using ternary to avoid SSR hydration mismatch from dynamic object access
 */
function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div
      className={`${
        size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
      } border-2 border-current border-t-transparent rounded-full animate-spin`}
    />
  );
}

/**
 * SparklesIcon - Sparkle icon for AI button
 */
function SparklesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4"
    >
      <path
        fillRule="evenodd"
        d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.036.258a91l1..75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default TodoInput;
