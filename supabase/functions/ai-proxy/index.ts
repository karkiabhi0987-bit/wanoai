import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const OPENAI_MODEL = "gpt-4o-mini";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, payload } = body;

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured. Add OPENAI_API_KEY as an edge function secret." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let systemPrompt = "";
    let userPrompt = "";
    let messages: ChatMessage[] | null = null;

    switch (action) {
      case "chat": {
        messages = (payload.messages as ChatMessage[]).map((m) => ({
          role: m.role,
          content: m.content,
        }));
        messages = [
          {
            role: "system",
            content: "You are Wano AI, a friendly and knowledgeable AI study tutor. Give clear, concise, and encouraging explanations. Help students understand concepts deeply. Keep responses focused and practical.",
          },
          ...messages,
        ];
        break;
      }
      case "quiz": {
        systemPrompt = "You are a quiz generator. Create multiple-choice quiz questions. Return ONLY valid JSON, no markdown.";
        userPrompt = `Generate ${payload.count || 5} multiple-choice quiz questions about "${payload.topic}". Each question must have exactly 4 options, one correct answer (0-indexed), and a brief explanation. Return as a JSON array: [{"question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}]. Return ONLY the JSON array, no other text.`;
        break;
      }
      case "flashcards": {
        systemPrompt = "You are a flashcard generator. Create study flashcards. Return ONLY valid JSON, no markdown.";
        userPrompt = `Generate 5 study flashcards about "${payload.topic}". Each flashcard has a question and a concise answer. Return as a JSON array: [{"question":"...","answer":"..."}]. Return ONLY the JSON array, no other text.`;
        break;
      }
      case "summarize": {
        systemPrompt = "You are a notes summarizer. Summarize text and extract key points. Return ONLY valid JSON, no markdown.";
        userPrompt = `Summarize the following text and extract 3-5 key points. Return as JSON: {"summary":"...","keyPoints":["point1","point2",...]}. Return ONLY the JSON, no other text.\n\nText: ${payload.text}`;
        break;
      }
      case "study-plan": {
        systemPrompt = "You are a study planner. Create personalized study plans. Return ONLY valid JSON, no markdown.";
        userPrompt = `Create a ${payload.days || 7}-day study plan for "${payload.subject}". Each day should have a title, description, and duration in minutes (30-90). Return as a JSON array: [{"title":"...","subject":"${payload.subject}","description":"...","durationMinutes":45}]. Return ONLY the JSON array, no other text.`;
        break;
      }
      default:
        return new Response(
          JSON.stringify({ error: "Unknown action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const openaiMessages: ChatMessage[] = messages
      ? messages
      : [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ];

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: openaiMessages,
        temperature: action === "chat" ? 0.7 : 0.8,
        max_tokens: action === "chat" ? 600 : 1500,
      }),
    });

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text();
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${openaiResponse.status}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices?.[0]?.message?.content ?? "";

    let parsed: unknown = content;
    if (action !== "chat") {
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
      } catch {
        parsed = content;
      }
    }

    return new Response(
      JSON.stringify({ result: parsed }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
