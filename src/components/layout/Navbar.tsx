import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, User as UserIcon, MessageSquareText, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { toast } from '@/components/ui/Toast';

export function Navbar() {
  const { profile, logOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  async function handleLogout() {
    setOpen(false);
    try {
      await logOut();
      toast('success', 'You have been signed out.');
      navigate('/login', { replace: true });
    } catch {
      toast('error', 'Could not sign out. Please try again.');
    }
  }

  const initial = (profile?.displayName || profile?.email || 'U').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo size="sm" to="/dashboard" />

        <nav className="hidden items-center gap-1 sm:flex">
          <NavLink to="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" />
          <NavLink to="/chat" icon={<MessageSquareText size={16} />} label="Study Chat" />
        </nav>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-ink-700 bg-ink-800/60 py-1.5 pl-1.5 pr-2.5 transition-colors hover:border-ink-600 hover:bg-ink-700/60"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="" className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-accent-500 to-accent-400 text-xs font-bold text-ink-950">
                {initial}
              </span>
            )}
            <span className="hidden max-w-[120px] truncate text-sm text-ink-100 sm:block">
              {profile?.displayName || 'Student'}
            </span>
            <ChevronDown size={16} className={`text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-ink-700 bg-ink-900/95 shadow-glow-sm backdrop-blur-xl animate-fade-up"
              role="menu"
            >
              <div className="border-b border-ink-800 px-4 py-3">
                <p className="truncate text-sm font-medium text-ink-100">
                  {profile?.displayName || 'Student'}
                </p>
                <p className="truncate text-xs text-ink-400">{profile?.email}</p>
              </div>
              <div className="p-1.5">
                <MenuItem to="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" onClick={() => setOpen(false)} />
                <MenuItem to="/chat" icon={<MessageSquareText size={16} />} label="Study Chat" onClick={() => setOpen(false)} />
                <MenuItem to="/profile" icon={<UserIcon size={16} />} label="Profile" onClick={() => setOpen(false)} />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-300 transition-colors hover:bg-red-500/10"
                  role="menuitem"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-300 transition-colors hover:bg-ink-800/60 hover:text-white"
    >
      {icon}
      {label}
    </Link>
  );
}

function MenuItem({
  to,
  icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-200 transition-colors hover:bg-ink-800/60 hover:text-white"
      role="menuitem"
    >
      {icon}
      {label}
    </Link>
  );
}
