import { NextResponse } from 'next/server';
import { openai, AI_BREAKDOWN_PROMPT } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

/**
 * Extract JSON from AI response that may contain extra text like thinking tags
 */
function extractJsonFromResponse(content: string): object | null {
  // Try direct parse first
  try {
    return JSON.parse(content);
  } catch {
    // Continue to try extraction methods
  }

  // Try to find JSON block (handles ```json ... ```)
  const jsonBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch) {
    try {
      return JSON.parse(jsonBlockMatch[1]);
    } catch {
      // Continue
    }
  }

  // Try to find any object-like structure { ... }
  const objectMatch = content.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]);
    } catch {
      // Continue
    }
  }

  return null;
}

// POST /api/ai-breakdown - AI task breakdown
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { task } = body;

    // Validate input
    if (!task || typeof task !== 'string' || task.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Task is required' },
        { status: 400 }
      );
    }

    console.log('[AI Breakdown] Request:', task);

    // Call OpenAI API to break down the task
    const completion = await openai.chat.completions.create({
      model: 'Qwen3-Next-80B-A3B-Instruct',
      messages: [
        { role: 'system', content: AI_BREAKDOWN_PROMPT },
        { role: 'user', content: task.trim() },
      ],
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      console.error('[AI Breakdown] No content in response');
      return NextResponse.json(
        { success: false, error: 'Failed to get AI response' },
        { status: 500 }
      );
    }

    console.log('[AI Breakdown] Response content:', responseContent);

    // Extract JSON from response (handles thinking tags, markdown, etc.)
    const breakdown = extractJsonFromResponse(responseContent);

    if (!breakdown) {
      console.error('[AI Breakdown] Failed to extract JSON from response');
      return NextResponse.json(
        { success: false, error: 'Invalid AI response format: ' + responseContent.substring(0, 200) },
        { status: 500 }
      );
    }

    console.log('[AI Breakdown] Parsed JSON:', JSON.stringify(breakdown));

    const { parent_task, subtasks } = breakdown as { parent_task?: string; subtasks?: Array<{ title: string }> };

    if (!subtasks || !Array.isArray(subtasks) || subtasks.length === 0) {
      console.error('[AI Breakdown] No subtasks generated:', breakdown);
      return NextResponse.json(
        { success: false, error: 'AI failed to generate subtasks' },
        { status: 500 }
      );
    }

    console.log('[AI Breakdown] Parent task:', parent_task);
    console.log('[AI Breakdown] Subtasks:', subtasks);

    // Create parent task and subtasks in Supabase
    // First, create the parent task
    const { data: parentTodo, error: parentError } = await supabase
      .from('todos')
      .insert({ title: parent_task || task.trim() })
      .select()
      .single();

    if (parentError || !parentTodo) {
      console.error('[AI Breakdown] Parent insert error:', parentError);
      return NextResponse.json(
        { success: false, error: parentError?.message || 'Failed to create parent task' },
        { status: 500 }
      );
    }

    // Then create all subtasks with parent_id
    const subtaskInserts = subtasks.map((subtask: { title: string }) => ({
      title: subtask.title,
      parent_id: parentTodo.id,
    }));

    const { data: subtaskTodos, error: subtaskError } = await supabase
      .from('todos')
      .insert(subtaskInserts)
      .select();

    if (subtaskError) {
      // If subtask creation fails, clean up parent
      await supabase.from('todos').delete().eq('id', parentTodo.id);
      console.error('[AI Breakdown] Subtask insert error:', subtaskError);
      return NextResponse.json(
        { success: false, error: subtaskError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        parent_task: parentTodo,
        subtasks: subtaskTodos || [],
      },
    });
  } catch (error) {
    console.error('[AI Breakdown] Final error:', error);
    return NextResponse.json(
      { success: false, error: 'AI service error: ' + String(error) },
      { status: 500 }
    );
  }
}
