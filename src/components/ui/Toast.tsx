import { useEffect, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export type ToastKind = 'success' | 'error';
export interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

let pushFn: ((kind: ToastKind, message: string) => void) | null = null;
export function toast(kind: ToastKind, message: string) {
  pushFn?.(kind, message);
}

export function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    pushFn = (kind, message) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, kind, message }]);
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    };
    return () => {
      pushFn = null;
    };
  }, []);

  const dismiss = (id: number) => setItems((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:left-auto sm:right-4 sm:items-end">
      {items.map((t) => (
        <Toast key={t.id} item={t} onClose={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

function Toast({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const Icon = item.kind === 'success' ? CheckCircle2 : XCircle;
  const accent =
    item.kind === 'success'
      ? 'text-emerald-400 border-emerald-500/30'
      : 'text-red-400 border-red-500/30';
  return (
    <div
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border ${accent} bg-ink-900/95 px-4 py-3 shadow-glow-sm backdrop-blur-xl animate-fade-up`}
      role="alert"
    >
      <Icon size={20} className="mt-0.5 shrink-0" />
      <p className="flex-1 text-sm text-ink-100">{item.message}</p>
      <button onClick={onClose} className="text-ink-400 transition-colors hover:text-ink-200" aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
}

export function InlineAlert({
  kind,
  children,
}: {
  kind: ToastKind;
  children: ReactNode;
}) {
  const Icon = kind === 'success' ? CheckCircle2 : XCircle;
  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${
        kind === 'success'
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
          : 'border-red-500/30 bg-red-500/10 text-red-200'
      }`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
