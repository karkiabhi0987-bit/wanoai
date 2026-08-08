// AI functions powered by OpenAI via a Supabase Edge Function proxy.
// The OpenAI API key is stored securely as an edge function secret (OPENAI_API_KEY).
// If the edge function is unavailable or the key isn't set, functions fall back to
// mock data so the app remains usable during development.

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface NoteSummary {
  summary: string;
  keyPoints: string[];
}

export interface StudyPlanItem {
  title: string;
  subject: string;
  description: string;
  durationMinutes: number;
}

const EDGE_FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/ai-proxy`;

async function callAI(action: string, payload: Record<string, unknown>): Promise<unknown> {
  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ action, payload }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed (${response.status})`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data.result;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Fallback data ──────────────────────────────────────────────────────────

function fallbackChat(messages: ChatMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const userText = lastUser?.content.toLowerCase() ?? '';
  if (userText.includes('math') || userText.includes('equation'))
    return "I'd be happy to help with math! Break the problem into smaller steps: identify what's given, what you need to find, and which formula applies. For example, if you're solving for x in 2x + 5 = 13, subtract 5 from both sides to get 2x = 8, then divide by 2 to find x = 4. What specific problem are you working on?";
  if (userText.includes('essay') || userText.includes('write'))
    return "Great question about writing! Start with a strong thesis statement that captures your main argument. Then structure your essay with an introduction, 2-3 body paragraphs each focused on one supporting point, and a conclusion that ties everything together. Would you like help outlining a specific topic?";
  if (userText.includes('study') || userText.includes('exam'))
    return "Effective studying comes down to active recall and spaced repetition. Instead of re-reading notes, try testing yourself with flashcards or practice questions. Break your study sessions into 25-minute focused blocks with 5-minute breaks (the Pomodoro technique). What subject are you preparing for?";
  if (userText.includes('hello') || userText.includes('hi') || userText.includes('hey'))
    return "Hello! I'm your Wano AI study assistant. I can help you understand concepts, work through problems, plan your study schedule, and more. What would you like to learn about today?";
  return "That's a great topic! Let me help you break it down. The key is to start with the fundamentals and build up your understanding step by step. Try to connect new concepts to things you already know — this makes them easier to remember. Can you tell me more about what specifically you'd like to explore?";
}

function fallbackFlashcards(topic: string): Flashcard[] {
  return [
    { question: `What is the main concept of ${topic}?`, answer: `The main concept of ${topic} involves understanding its core principles and how they apply in practice.` },
    { question: `Why is ${topic} important?`, answer: `${topic} is important because it helps us understand and solve real-world problems in its field.` },
    { question: `What are the key terms in ${topic}?`, answer: `Key terms in ${topic} include its fundamental vocabulary, core theories, and primary methods.` },
    { question: `How do you apply ${topic}?`, answer: `You apply ${topic} by identifying relevant scenarios and using its principles to analyze or solve them.` },
    { question: `What are common mistakes in ${topic}?`, answer: `Common mistakes in ${topic} include overlooking fundamentals and misapplying core concepts.` },
  ];
}

function fallbackQuiz(topic: string, count: number): QuizQuestion[] {
  return Array.from({ length: Math.min(count, 5) }, (_, i) => ({
    question: `Question ${i + 1} about ${topic}: Which statement is correct?`,
    options: [`${topic} concept A is the primary principle`, `${topic} concept B is the primary principle`, `${topic} concept C is the primary principle`, `${topic} concept D is the primary principle`],
    correctIndex: i % 4,
    explanation: `This answer relates to the fundamental principles of ${topic}.`,
  }));
}

function fallbackSummary(text: string): NoteSummary {
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 10);
  const summary = sentences.slice(0, 3).join('. ') + (sentences.length > 3 ? '.' : '');
  return {
    summary: summary || 'This text covers key concepts and ideas related to the subject matter.',
    keyPoints: sentences.slice(0, 5).map((s) => (s.length > 80 ? s.slice(0, 80) + '...' : s)) || ['Main concept identified', 'Supporting details provided', 'Key relationships highlighted', 'Practical applications discussed', 'Important conclusions drawn'],
  };
}

function fallbackStudyPlan(subject: string, days: number): StudyPlanItem[] {
  const activities = [
    { title: `Review ${subject} fundamentals`, description: `Go over core concepts and key definitions in ${subject}.` },
    { title: `Practice problems in ${subject}`, description: `Work through practice questions to reinforce your understanding.` },
    { title: `Deep dive: advanced ${subject} topics`, description: `Explore more complex topics and their applications.` },
    { title: `${subject} flashcard review`, description: `Review flashcards for spaced repetition learning.` },
    { title: `Mock exam: ${subject}`, description: `Take a timed practice test to assess your knowledge.` },
    { title: `Group study: ${subject}`, description: `Discuss concepts with peers to deepen understanding.` },
    { title: `${subject} weak areas review`, description: `Focus on topics you found challenging during the week.` },
  ];
  return activities.slice(0, Math.min(days, 7)).map((a) => ({ ...a, subject, durationMinutes: 45 + Math.floor(Math.random() * 3) * 15 }));
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function aiChat(messages: ChatMessage[]): Promise<string> {
  try {
    const result = await callAI('chat', { messages }) as string;
    return result || fallbackChat(messages);
  } catch {
    await delay(400);
    return fallbackChat(messages);
  }
}

export async function generateFlashcards(topic: string): Promise<Flashcard[]> {
  try {
    const result = await callAI('flashcards', { topic }) as Flashcard[];
    if (Array.isArray(result) && result.length > 0) return result;
    return fallbackFlashcards(topic);
  } catch {
    await delay(500);
    return fallbackFlashcards(topic);
  }
}

export async function generateQuiz(topic: string, count: number = 5): Promise<QuizQuestion[]> {
  try {
    const result = await callAI('quiz', { topic, count }) as QuizQuestion[];
    if (Array.isArray(result) && result.length > 0) return result;
    return fallbackQuiz(topic, count);
  } catch {
    await delay(500);
    return fallbackQuiz(topic, count);
  }
}

export async function summarizeNotes(text: string): Promise<NoteSummary> {
  try {
    const result = await callAI('summarize', { text }) as NoteSummary;
    if (result && result.summary) return result;
    return fallbackSummary(text);
  } catch {
    await delay(500);
    return fallbackSummary(text);
  }
}

export async function generateStudyPlan(subject: string, days: number = 7): Promise<StudyPlanItem[]> {
  try {
    const result = await callAI('study-plan', { subject, days }) as StudyPlanItem[];
    if (Array.isArray(result) && result.length > 0) return result;
    return fallbackStudyPlan(subject, days);
  } catch {
    await delay(500);
    return fallbackStudyPlan(subject, days);
  }
}
