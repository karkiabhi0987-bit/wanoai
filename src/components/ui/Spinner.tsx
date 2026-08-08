import { Loader2 } from 'lucide-react';

export function Spinner({ className = '' }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} size={20} />;
}

export function FullPageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-2 border-ink-700 border-t-accent-400 animate-spin" />
        <div className="absolute inset-0 h-12 w-12 rounded-full bg-accent-500/20 blur-xl animate-pulse-soft" />
      </div>
      <p className="text-sm text-ink-300">{label}</p>
    </div>
  );
}
