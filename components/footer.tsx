import Link from 'next/link';
import { Brain, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 text-white">
                <Brain className="h-4 w-4" />
              </div>
              <span className="font-poppins">Wano<span className="gradient-text"> AI</span></span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your personal AI-powered study companion. Learn smarter, not harder.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/chatbot" className="hover:text-foreground transition-colors">AI Chatbot</Link></li>
              <li><Link href="/quiz" className="hover:text-foreground transition-colors">Quiz Generator</Link></li>
              <li><Link href="/flashcards" className="hover:text-foreground transition-colors">Flashcards</Link></li>
              <li><Link href="/notes" className="hover:text-foreground transition-colors">Notes Summarizer</Link></li>
              <li><Link href="/planner" className="hover:text-foreground transition-colors">Study Planner</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link href="/profile" className="hover:text-foreground transition-colors">Profile</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Connect</h3>
            <div className="flex gap-3">
              <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-accent hover:text-accent-foreground">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-accent hover:text-accent-foreground">
                <Github className="h-4 w-4" />
              </Link>
              <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-accent hover:text-accent-foreground">
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Wano AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
