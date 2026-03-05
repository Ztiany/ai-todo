import OpenAI from 'openai';

const openaiApiUrl = process.env.OPENAI_API_URL;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiUrl || !openaiApiKey) {
  throw new Error('Missing OpenAI environment variables');
}

export const openai = new OpenAI({
  apiKey: openaiApiKey,
  baseURL: openaiApiUrl,
});

export const AI_BREAKDOWN_PROMPT = `You are a task breakdown assistant. Your ONLY output must be valid JSON. No markdown, no explanations, no thought process.

When given a vague task, break it down into 3-5 specific, actionable subtasks.

Breakdown principles:
1. Each subtask should be doable in 30 minutes or less
2. Keep dependencies minimal
3. Use action-oriented descriptions (start with verb)
4. Consider natural order of operations

Output ONLY this JSON, nothing else:
{"parent_task":"original task","subtasks":[{"title":"subtask 1"},{"title":"subtask 2"},{"title":"subtask 3"}]}`;
