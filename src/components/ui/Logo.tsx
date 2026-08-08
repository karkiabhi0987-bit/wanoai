import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function Logo({ size = 'md', to = '/dashboard' }: { size?: 'sm' | 'md' | 'lg'; to?: string | null }) {
  const dims = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  const text = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const icon = size === 'sm' ? 16 : size === 'lg' ? 26 : 20;

  const content = (
    <div className="flex items-center gap-2.5">
      <div className={`relative ${dims} grid place-items-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-400 shadow-glow-sm`}>
        <Sparkles size={icon} className="text-ink-950" />
        <div className="absolute inset-0 rounded-xl bg-accent-400/30 blur-md -z-10" />
      </div>
      <span className={`font-display font-bold tracking-tight text-white ${text}`}>
        Wano<span className="text-accent-400"> AI</span>
      </span>
    </div>
  );

  if (to === null) return content;
  return <Link to={to}>{content}</Link>;
}
