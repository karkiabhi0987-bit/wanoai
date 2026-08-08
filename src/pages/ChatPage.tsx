import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Send,
  Plus,
  MessageSquareText,
  Trash2,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';
import {
  createConversation,
  watchConversations,
  watchMessages,
  appendMessage,
  deleteConversationData,
  listMessages,
  type ConversationDoc,
  type ChatMessageDoc,
} from '@/lib/chatStore';
import { streamStudyReply, type ChatMessage } from '@/lib/openai';
import { OPENAI_API_KEY } from '@/lib/firebase';

export default function ChatPage() {
  const { profile } = useAuth();
  const location = useLocation();
  const initialPrompt = (location.state as { initialPrompt?: string } | null)?.initialPrompt;
  const requestedConvoId = (location.state as { conversationId?: string } | null)?.conversationId;

  const [conversations, setConversations] = useState<ConversationDoc[]>([]);
  const [activeId, setActiveId] = useState<string | null>(requestedConvoId ?? null);
  const [messages, setMessages] = useState<ChatMessageDoc[]>([]);
  const [input, setInput] = useState(initialPrompt ?? '');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [streamingText, setStreamingText] = useState('');

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const uid = profile?.uid;

  // Watch conversation list
  useEffect(() => {
    if (!uid) return;
    const unsub = watchConversations(uid, setConversations);
    return unsub;
  }, [uid]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!uid || !activeId) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    let unsub: (() => void) | undefined;
    (async () => {
      // Seed with existing messages immediately (for snappy nav), then subscribe.
      const existing = await listMessages(uid, activeId);
      setMessages(existing);
      setLoadingMessages(false);
      unsub = watchMessages(uid, activeId, (next) => {
        // Avoid clobbering while streaming an assistant turn.
        if (!sending) setMessages(next);
      });
    })();
    return () => unsub?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, activeId]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, streamingText]);

  // Fire initial prompt once
  useEffect(() => {
    if (initialPrompt && !sending && messages.length === 0) {
      void send(initialPrompt, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const historyForAI: ChatMessage[] = useMemo(
    () => messages.map((m) => ({ role: m.role, content: m.content })),
    [messages],
  );

  async function send(text: string, fromInitial = false) {
    const content = text.trim();
    if (!content || sending || !uid) return;
    if (!OPENAI_API_KEY) {
      toast('error', 'Add VITE_OPENAI_API_KEY to enable the AI study chat.');
      return;
    }

    setInput('');
    setSending(true);
    setStreamingText('');

    // Ensure a conversation exists
    let convoId = activeId;
    if (!convoId) {
      const title = content.slice(0, 48) + (content.length > 48 ? '…' : '');
      convoId = await createConversation(uid, title);
      setActiveId(convoId);
    }

    // Optimistically add user message
    const userMsg: ChatMessageDoc = { role: 'user', content };
    setMessages((prev) => [...prev, userMsg]);

    // Persist user message
    try {
      await appendMessage(uid, convoId, { role: 'user', content });
    } catch (e) {
      console.warn('Could not save user message:', e);
    }

    // Stream the assistant reply
    const controller = new AbortController();
    abortRef.current = controller;
    let acc = '';
    try {
      const aiMessages: ChatMessage[] = [...historyForAI, { role: 'user', content }];
      await streamStudyReply(
        aiMessages,
        (delta) => {
          acc += delta;
          setStreamingText(acc);
        },
        controller.signal,
      );
      // Persist assistant message
      try {
        await appendMessage(uid, convoId, { role: 'assistant', content: acc });
      } catch (e) {
        console.warn('Could not save assistant message:', e);
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        // Persist partial reply if any
        if (acc) {
          await appendMessage(uid, convoId, { role: 'assistant', content: acc }).catch(() => {});
        }
      } else {
        toast('error', (err as Error).message || 'The AI could not respond. Try again.');
        setMessages((prev) => prev.filter((m) => m !== userMsg));
        setInput(content);
      }
    } finally {
      setSending(false);
      setStreamingText('');
      abortRef.current = null;
      if (fromInitial) {
        // Clear the initialPrompt from history state so it doesn't refire.
        window.history.replaceState({}, document.title);
      }
    }
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  async function handleNewChat() {
    setActiveId(null);
    setMessages([]);
    setInput('');
    setStreamingText('');
  }

  async function handleDelete(id: string) {
    if (!uid) return;
    if (id === activeId) {
      setActiveId(null);
      setMessages([]);
    }
    try {
      await deleteConversationData(uid, id);
      toast('success', 'Conversation deleted.');
    } catch {
      toast('error', 'Could not delete conversation.');
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-8rem)] gap-4">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-72' : 'w-0'
          } shrink-0 overflow-hidden transition-all duration-300`}
        >
          <div className="flex h-full flex-col rounded-2xl border border-ink-800 bg-ink-900/60">
            <div className="p-3">
              <button onClick={handleNewChat} className="btn-primary w-full">
                <Plus size={18} /> New chat
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-2">
              {conversations.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-ink-400">No conversations yet.</p>
              ) : (
                <ul className="space-y-1">
                  {conversations.map((c) => (
                    <li key={c.id}>
                      <div
                        className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                          c.id === activeId
                            ? 'bg-accent-500/10 text-accent-200'
                            : 'text-ink-300 hover:bg-ink-800/60 hover:text-white'
                        }`}
                      >
                        <button
                          onClick={() => setActiveId(c.id)}
                          className="flex flex-1 items-center gap-2 truncate text-left"
                        >
                          <MessageSquareText size={15} className="shrink-0" />
                          <span className="truncate">{c.title}</span>
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="shrink-0 text-ink-500 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                          aria-label="Delete conversation"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </aside>

        {/* Chat column */}
        <section className="flex min-w-0 flex-1 flex-col rounded-2xl border border-ink-800 bg-ink-900/60">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-ink-800 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-800 hover:text-white"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
              </button>
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent-500 to-accent-400 text-ink-950">
                  <Sparkles size={16} />
                </span>
                <div>
                  <p className="font-medium text-white">Wano AI Study Chat</p>
                  <p className="text-xs text-ink-400">
                    {activeId ? 'Continuing a saved chat' : 'Start a new study session'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5">
            {messages.length === 0 && !streamingText ? (
              <EmptyState onPick={(p) => setInput(p)} />
            ) : (
              <div className="mx-auto max-w-3xl space-y-5">
                {messages.map((m, i) => (
                  <MessageBubble key={m.id ?? i} role={m.role} content={m.content} />
                ))}
                {streamingText && (
                  <MessageBubble role="assistant" content={streamingText} streaming />
                )}
                {sending && !streamingText && (
                  <div className="flex items-center gap-2 text-ink-400">
                    <Spinner className="text-accent-400" />
                    <span className="text-sm">Wano AI is thinking…</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Composer */}
          <form onSubmit={handleSubmit} className="border-t border-ink-800 p-3">
            <div className="mx-auto flex max-w-3xl items-end gap-2">
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void send(input);
                    }
                  }}
                  rows={1}
                  placeholder="Ask Wano AI anything…"
                  className="max-h-40 min-h-[48px] w-full resize-none rounded-xl border border-ink-700 bg-ink-800/60 px-4 py-3 text-ink-100 placeholder-ink-400 outline-none transition-all focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30"
                />
              </div>
              {sending ? (
                <button
                  type="button"
                  onClick={handleStop}
                  className="btn-ghost h-12 px-4"
                  title="Stop generating"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="btn-primary h-12 px-4"
                  title="Send"
                >
                  <Send size={18} />
                </button>
              )}
            </div>
            <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-ink-500">
              Wano AI can make mistakes. Verify important information.
            </p>
          </form>
        </section>
      </div>
    </AppShell>
  );
}

function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  const ideas = [
    'Explain quantum entanglement simply',
    'Write a study plan for learning Spanish',
    'Summarize the water cycle',
    'Give me 3 practice problems on fractions',
  ];
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center py-16 text-center">
      <div className="relative">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-accent-500 to-accent-400 text-ink-950 shadow-glow">
          <Sparkles size={30} />
        </div>
        <div className="absolute inset-0 -z-10 rounded-2xl bg-accent-400/30 blur-xl" />
      </div>
      <h2 className="mt-5 font-display text-2xl font-bold text-white">How can I help you study?</h2>
      <p className="mt-2 text-ink-300">Ask a question or pick a starting point below.</p>
      <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
        {ideas.map((idea) => (
          <button
            key={idea}
            onClick={() => onPick(idea)}
            className="rounded-xl border border-ink-700 bg-ink-800/40 px-4 py-3 text-left text-sm text-ink-200 transition-all hover:border-accent-500/50 hover:bg-ink-800/70 hover:text-white"
          >
            {idea}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({
  role,
  content,
  streaming,
}: {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}) {
  const isUser = role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-bold ${
          isUser
            ? 'bg-ink-700 text-ink-100'
            : 'bg-gradient-to-br from-accent-500 to-accent-400 text-ink-950'
        }`}
      >
        {isUser ? 'You' : <Sparkles size={16} />}
      </div>
      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'rounded-tr-sm bg-accent-500/15 text-accent-100'
            : 'rounded-tl-sm border border-ink-700 bg-ink-800/60 text-ink-100'
        }`}
      >
        {content}
        {streaming && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse-soft bg-accent-400 align-middle" />}
      </div>
    </div>
  );
}
