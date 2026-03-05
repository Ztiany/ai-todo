// Todo item type definition
export interface Todo {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  parent_id: string | null;
  priority: 'high' | 'medium' | 'low' | null;
  due_date: string | null;
  tags: string[];
  remind_at: string | null;
  created_at: string;
  updated_at: string;
}

// Extended Todo with children for tree structure
export interface TodoWithChildren extends Todo {
  children: TodoWithChildren[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// AI breakdown response
export interface AIBreakdownResponse {
  parent_task: Todo;
  subtasks: Todo[];
}
