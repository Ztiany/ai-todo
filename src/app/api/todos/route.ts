import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/todos - Fetch all todos
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/todos - Create a new todo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, parent_id, priority, due_date, tags } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    const todoData = {
      title: title.trim(),
      description: description || null,
      parent_id: parent_id || null,
      priority: priority || null,
      due_date: due_date || null,
      tags: tags || [],
    };

    const { data, error } = await supabase
      .from('todos')
      .insert(todoData)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
