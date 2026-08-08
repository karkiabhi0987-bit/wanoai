'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/chatbot', label: 'AI Chat' },
  { href: '/quiz', label: 'Quizzes' },
  { href: '/flashcards', label: 'Flashcards' },
  { href: '/notes', label: 'Summarizer' },
  { href: '/planner', label: 'Planner' },
  { href: '/files', label: 'Files' },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isLanding = pathname === '/';
  const showNavLinks = user && !isLanding && !pathname.startsWith('/login') && !pathname.startsWith('/signup') && !pathname.startsWith('/about') && !pathname.startsWith('/contact');

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'glass shadow-lg' : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg transition-transform hover:scale-105">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg">
            <Brain className="h-5 w-5" />
          </div>
          <span className="font-poppins tracking-tight">Wano<span className="gradient-text"> AI</span></span>
        </Link>

        {showNavLinks && (
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
                  pathname === link.href ? 'text-accent' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!loading && user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          ) : !loading ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="gap-2">
                  Get Started
                  <Sparkles className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : null}

          {showNavLinks && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </nav>

      {showNavLinks && mobileOpen && (
        <div className="glass border-t lg:hidden animate-fade-in-down">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  pathname === link.href ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/profile" className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">
              Profile
            </Link>
            <Button variant="outline" size="sm" onClick={signOut} className="mt-2 w-full">
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
