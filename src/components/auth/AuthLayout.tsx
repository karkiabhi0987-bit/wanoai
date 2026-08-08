import type { ReactNode } from 'react';
import { Logo } from '@/components/ui/Logo';
import { Brain, MessageSquareText, ShieldCheck, Sparkles } from 'lucide-react';

const FEATURES = [
  { icon: Brain, title: 'Adaptive learning', desc: 'Explanations tuned to your level and pace.' },
  { icon: MessageSquareText, title: 'Saved study chats', desc: 'Every session stored so you can revisit anytime.' },
  { icon: ShieldCheck, title: 'Private & secure', desc: 'Your notes and history are tied to your account.' },
];

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-2">
      {/* Brand / showcase panel */}
      <aside className="relative hidden overflow-hidden bg-ink-900/60 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" />
          <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-accent-600/10 blur-3xl" />
        </div>

        <div className="relative">
          <Logo size="lg" to="/" />
        </div>

        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-xs font-medium text-accent-200">
            <Sparkles size={14} /> Your intelligent study companion
          </span>
          <h2 className="mt-6 font-display text-4xl font-bold leading-tight text-white">
            Study smarter with <span className="text-accent-400">Wano AI</span>
          </h2>
          <p className="mt-4 text-ink-300">
            Ask questions, get step-by-step explanations, and keep every conversation saved to your
            account — ready when you are.
          </p>

          <ul className="mt-10 space-y-5">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-ink-700 bg-ink-800/60 text-accent-400">
                  <f.icon size={20} />
                </div>
                <div>
                  <p className="font-medium text-ink-100">{f.title}</p>
                  <p className="text-sm text-ink-400">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-ink-400">
          © {new Date().getFullYear()} Wano AI. All rights reserved.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex min-h-screen flex-col items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md animate-fade-up">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo size="md" to="/" />
          </div>
          <div className="card-surface p-6 shadow-glow-sm sm:p-8">
            <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
            <p className="mt-1.5 text-sm text-ink-300">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
          {footer && <div className="mt-5 text-center text-sm text-ink-300">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
