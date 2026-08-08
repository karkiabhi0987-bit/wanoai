import { OPENAI_API_KEY, OPENAI_MODEL } from './firebase';

export type ChatRole = 'system' | 'user' | 'assistant';
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

const SYSTEM_PROMPT: ChatMessage = {
  role: 'system',
  content:
    "You are Wano AI, a friendly, encouraging study companion. Help students understand concepts, explain step by step, give examples, quiz them, and summarize topics. Be clear, accurate, and supportive. Use markdown when helpful.",
};

export async function streamStudyReply(
  messages: ChatMessage[],
  onToken: (delta: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error(
      'OpenAI API key is not configured. Add VITE_OPENAI_API_KEY to your environment to enable the AI study chat.',
    );
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      stream: true,
      temperature: 0.5,
      messages: [SYSTEM_PROMPT, ...messages],
    }),
    signal,
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => '');
    throw new Error(`OpenAI request failed (${res.status}). ${text.slice(0, 200)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') return full;
      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) {
          full += delta;
          onToken(delta);
        }
      } catch {
        // ignore keep-alive / partial chunks
      }
    }
  }
  return full;
}
