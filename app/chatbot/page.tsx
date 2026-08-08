'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AuthGuard } from '@/components/auth-guard';
import { supabase } from '@/lib/supabase/client';
import { aiChat, ChatMessage } from '@/lib/ai';
import { useAuth } from '@/lib/auth-context';

function ChatContent() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('chat_messages').select('role, content').order('created_at', { ascending: true }).limit(50);
      if (data && data.length > 0) {
        setMessages(data.map((d) => ({ role: d.role, content: d.content })));
      } else {
        setMessages([{ role: 'assistant', content: "Hi! I'm your Wano AI study assistant. Ask me anything about your subjects!" }]);
      }
      setHistoryLoading(false);
    })();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    await supabase.from('chat_messages').insert({ role: 'user', content: userMsg.content });
    const response = await aiChat([...messages, userMsg]);
    setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    await supabase.from('chat_messages').insert({ role: 'assistant', content: response });
    await supabase.from('progress_entries').insert({ activity_type: 'chat' });
    setLoading(false);
  };

  const handleClear = async () => {
    await supabase.from('chat_messages').delete().eq('user_id', user?.id ?? '');
    setMessages([{ role: 'assistant', content: "Hi! I'm your Wano AI study assistant. Ask me anything!" }]);
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-poppins text-2xl font-bold sm:text-3xl">AI Chatbot Tutor</h1>
            <p className="mt-1 text-muted-foreground">Ask anything — your AI tutor is here 24/7.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClear} title="Clear conversation">
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
        <Card className="flex h-[calc(100vh-16rem)] flex-col">
          <CardContent className="flex flex-1 flex-col p-0">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {historyLoading ? (
                <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 text-white">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground animation-delay-100" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground animation-delay-200" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground animation-delay-300" />
                  </div>
                </div>
              )}
            </div>
            <div className="border-t p-4">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask your AI tutor anything..." disabled={loading} className="flex-1" />
                <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ChatbotPage() {
  return <AuthGuard><ChatContent /></AuthGuard>;
}
