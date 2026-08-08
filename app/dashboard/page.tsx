'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3, MessageSquare, FileText, Layers, Calendar, BookOpen, TrendingUp, Award, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/components/auth-guard';
import { supabase } from '@/lib/supabase/client';

interface ProgressRow {
  activity_type: string;
  score: number | null;
  total: number | null;
  created_at: string;
}

function DashboardContent() {
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [planCount, setPlanCount] = useState(0);
  const [completedPlans, setCompletedPlans] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: prog } = await supabase.from('progress_entries').select('activity_type, score, total, created_at').order('created_at', { ascending: false }).limit(100);
      if (prog) setProgress(prog as ProgressRow[]);
      const { data: plans } = await supabase.from('study_plans').select('completed');
      if (plans) { setPlanCount(plans.length); setCompletedPlans(plans.filter((p: { completed: boolean }) => p.completed).length); }
      setLoading(false);
    })();
  }, []);

  const chatCount = progress.filter((p) => p.activity_type === 'chat').length;
  const quizCount = progress.filter((p) => p.activity_type === 'quiz').length;
  const flashcardCount = progress.filter((p) => p.activity_type === 'flashcard').length;
  const noteCount = progress.filter((p) => p.activity_type === 'note').length;
  const quizScores = progress.filter((p) => p.activity_type === 'quiz' && p.score !== null && p.total !== null);
  const avgScore = quizScores.length > 0 ? Math.round((quizScores.reduce((acc, p) => acc + (p.score! / p.total!) * 100, 0) / quizScores.length)) : 0;
  const totalActivities = progress.length;

  const last7Days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });
  const weeklyData = last7Days.map((day) => { const dayStr = day.toISOString().split('T')[0]; return progress.filter((p) => p.created_at.split('T')[0] === dayStr).length; });
  const maxWeekly = Math.max(...weeklyData, 1);

  const stats = [
    { icon: MessageSquare, label: 'AI Chats', value: chatCount, color: 'from-sky-500 to-cyan-500', href: '/chatbot' },
    { icon: FileText, label: 'Quizzes Taken', value: quizCount, color: 'from-emerald-500 to-teal-500', href: '/quiz' },
    { icon: Layers, label: 'Flashcard Decks', value: flashcardCount, color: 'from-rose-500 to-pink-500', href: '/flashcards' },
    { icon: BookOpen, label: 'Notes Summarized', value: noteCount, color: 'from-amber-500 to-orange-500', href: '/notes' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="font-poppins text-2xl font-bold sm:text-3xl">Progress Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Track your learning journey and see how far you've come.</p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <Link key={stat.label} href={stat.href}>
                  <Card className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                    <CardContent className="pt-6">
                      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md transition-transform group-hover:scale-110`}><stat.icon className="h-5 w-5" /></div>
                      <div className="font-poppins text-3xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <Card className="animate-fade-in-up animation-delay-200"><CardHeader><div className="flex items-center gap-2"><Award className="h-5 w-5 text-accent" /><CardTitle className="text-base">Quiz Performance</CardTitle></div></CardHeader><CardContent><div className="font-poppins text-4xl font-bold gradient-text">{avgScore}%</div><div className="mt-1 text-sm text-muted-foreground">Average score across {quizScores.length} quizzes</div></CardContent></Card>
              <Card className="animate-fade-in-up animation-delay-300"><CardHeader><div className="flex items-center gap-2"><Target className="h-5 w-5 text-accent" /><CardTitle className="text-base">Study Plans</CardTitle></div></CardHeader><CardContent><div className="font-poppins text-4xl font-bold">{completedPlans}<span className="text-lg text-muted-foreground">/{planCount}</span></div><div className="mt-1 text-sm text-muted-foreground">Completed study sessions</div></CardContent></Card>
              <Card className="animate-fade-in-up animation-delay-500"><CardHeader><div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-accent" /><CardTitle className="text-base">Total Activities</CardTitle></div></CardHeader><CardContent><div className="font-poppins text-4xl font-bold">{totalActivities}</div><div className="mt-1 text-sm text-muted-foreground">Learning activities this period</div></CardContent></Card>
            </div>

            <Card className="mt-6 animate-fade-in-up animation-delay-500">
              <CardHeader><div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-accent" /><CardTitle>Weekly Activity</CardTitle></div></CardHeader>
              <CardContent>
                <div className="flex h-48 items-end justify-between gap-2">
                  {weeklyData.map((val, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex w-full flex-1 items-end"><div className="w-full rounded-t-lg bg-gradient-to-t from-sky-500 to-emerald-500 transition-all duration-700 ease-out hover:opacity-80" style={{ height: `${(val / maxWeekly) * 100}%`, minHeight: val > 0 ? '8px' : '2px' }} title={`${val} activities`} /></div>
                      <span className="text-xs text-muted-foreground">{last7Days[i].toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/quiz"><Button variant="outline" className="w-full justify-start gap-2 h-14"><FileText className="h-5 w-5 text-emerald-500" /> Take a Quiz</Button></Link>
              <Link href="/flashcards"><Button variant="outline" className="w-full justify-start gap-2 h-14"><Layers className="h-5 w-5 text-rose-500" /> Review Flashcards</Button></Link>
              <Link href="/planner"><Button variant="outline" className="w-full justify-start gap-2 h-14"><Calendar className="h-5 w-5 text-violet-500" /> Plan Study Time</Button></Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <AuthGuard><DashboardContent /></AuthGuard>;
}
