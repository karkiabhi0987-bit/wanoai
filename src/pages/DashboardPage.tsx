import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareText, Plus, Clock, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { watchConversations, type ConversationDoc } from '@/lib/chatStore';
import { OPENAI_API_KEY } from '@/lib/firebase';

const SUGGESTIONS = [
  { title: 'Explain photosynthesis', prompt: 'Explain photosynthesis like I am 12, with a simple diagram in words.' },
  { title: 'Quiz me on world history', prompt: 'Give me a 5-question multiple choice quiz on world history.' },
  { title: 'Summarize a topic', prompt: 'Summarize the key ideas of the French Revolution in 5 bullet points.' },
  { title: 'Help me solve x² + 5x − 6 = 0', prompt: 'Help me solve the quadratic equation x² + 5x − 6 = 0 step by step.' },
];

export default function DashboardPage() {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<ConversationDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.uid) return;
    const unsub = watchConversations(profile.uid, (convos) => {
      setConversations(convos);
      setLoading(false);
    });
    return unsub;
  }, [profile?.uid]);

  const firstName = (profile?.displayName || 'there').split(' ')[0];
  const aiReady = !!OPENAI_API_KEY;

  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-ink-800 bg-gradient-to-br from-ink-900 to-ink-800/40 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-1/4 h-40 w-40 rounded-full bg-accent-400/10 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-xs font-medium text-accent-200">
            <Sparkles size={14} /> Welcome back
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            Hi {firstName}, ready to study?
          </h1>
          <p className="mt-2 max-w-xl text-ink-300">
            Jump back into a saved chat or start a new session with Wano AI.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/chat" className="btn-primary">
              <Plus size={18} /> New study chat
            </Link>
            <Link to="/chat" className="btn-ghost">
              <MessageSquareText size={18} /> Continue last chat
            </Link>
          </div>
        </div>
      </section>

      {/* AI readiness banner */}
      {!aiReady && (
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          The AI chat needs an OpenAI API key. Add <code className="rounded bg-ink-800 px-1.5 py-0.5">VITE_OPENAI_API_KEY</code> to your environment to enable it.
        </div>
      )}

      {/* Stats */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<MessageSquareText size={20} />} label="Saved chats" value={loading ? '—' : String(conversations.length)} />
        <StatCard icon={<Clock size={20} />} label="Last active" value={loading ? '—' : conversations[0]?.updatedAt ? formatTime(conversations[0].updatedAt) : 'No chats yet'} />
        <StatCard icon={<BookOpen size={20} />} label="Plan" value="Free Spark" />
      </section>

      {/* Suggestions */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-white">Try asking Wano AI</h2>
        <p className="mt-1 text-sm text-ink-400">Pick a prompt to start a new study chat.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {SUGGESTIONS.map((s) => (
            <Link
              key={s.title}
              to="/chat"
              state={{ initialPrompt: s.prompt }}
              className="group flex items-center justify-between gap-3 rounded-xl border border-ink-700 bg-ink-800/40 p-4 transition-all hover:border-accent-500/50 hover:bg-ink-800/70"
            >
              <div>
                <p className="font-medium text-ink-100">{s.title}</p>
                <p className="mt-0.5 line-clamp-1 text-sm text-ink-400">{s.prompt}</p>
              </div>
              <ArrowRight size={18} className="shrink-0 text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-400" />
            </Link>
          ))}
        </div>
      </section>

      {/* Recent conversations */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-white">Recent chats</h2>
        {loading ? (
          <div className="mt-4 space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-ink-800/50" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-700 bg-ink-800/30 px-6 py-12 text-center">
            <MessageSquareText size={28} className="text-ink-500" />
            <p className="mt-3 text-ink-300">No chats yet.</p>
            <Link to="/chat" className="mt-4 btn-primary">
              <Plus size={18} /> Start your first chat
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {conversations.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link
                  to="/chat"
                  state={{ conversationId: c.id }}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-ink-700 bg-ink-800/40 p-4 transition-all hover:border-accent-500/50 hover:bg-ink-800/70"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent-500/10 text-accent-400">
                      <MessageSquareText size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-ink-100">{c.title}</p>
                      <p className="text-xs text-ink-400">
                        {c.messageCount ?? 0} messages · {c.updatedAt ? formatTime(c.updatedAt) : ''}
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-400" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-800/40 p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent-500/10 text-accent-400">
          {icon}
        </div>
        <div>
          <p className="text-sm text-ink-400">{label}</p>
          <p className="font-display text-lg font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function formatTime(ts: unknown): string {
  try {
    const d = (ts as { toDate?: () => Date }).toDate?.() ?? new Date(ts as string);
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch {
    return '';
  }
}
