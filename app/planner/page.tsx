'use client';

import { useState, useEffect } from 'react';
import { Calendar, Loader2, Sparkles, Plus, Trash2, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthGuard } from '@/components/auth-guard';
import { supabase } from '@/lib/supabase/client';
import { generateStudyPlan, StudyPlanItem } from '@/lib/ai';
import { cn } from '@/lib/utils';

interface SavedPlan {
  id: string;
  title: string;
  subject: string;
  description: string | null;
  study_date: string;
  duration_minutes: number;
  completed: boolean;
}

function PlannerContent() {
  const [subject, setSubject] = useState('');
  const [days, setDays] = useState(7);
  const [generated, setGenerated] = useState<StudyPlanItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newPlan, setNewPlan] = useState({ title: '', subject: '', description: '', date: '', duration: 60 });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('study_plans').select('*').order('study_date', { ascending: true });
      if (data) setPlans(data as SavedPlan[]);
    })();
  }, []);

  const handleGenerate = async () => {
    if (!subject.trim()) return;
    setLoading(true);
    const plan = await generateStudyPlan(subject, days);
    setGenerated(plan);
    setLoading(false);
  };

  const handleSaveGenerated = async () => {
    const today = new Date();
    const rows = generated.map((item, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      return { title: item.title, subject: item.subject, description: item.description, study_date: date.toISOString().split('T')[0], duration_minutes: item.durationMinutes };
    });
    const { data } = await supabase.from('study_plans').insert(rows).select('*');
    if (data) setPlans((prev) => [...prev, ...(data as SavedPlan[])].sort((a, b) => a.study_date.localeCompare(b.study_date)));
    await supabase.from('progress_entries').insert({ activity_type: 'study' });
    setGenerated([]);
  };

  const handleAddManual = async () => {
    if (!newPlan.title || !newPlan.date) return;
    const { data } = await supabase.from('study_plans').insert({
      title: newPlan.title, subject: newPlan.subject, description: newPlan.description, study_date: newPlan.date, duration_minutes: newPlan.duration,
    }).select('*').single();
    if (data) setPlans((prev) => [...prev, data as SavedPlan].sort((a, b) => a.study_date.localeCompare(b.study_date)));
    setNewPlan({ title: '', subject: '', description: '', date: '', duration: 60 });
    setShowAdd(false);
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await supabase.from('study_plans').update({ completed: !completed }).eq('id', id);
    setPlans((prev) => prev.map((p) => p.id === id ? { ...p, completed: !completed } : p));
  };

  const handleDelete = async (id: string) => {
    await supabase.from('study_plans').delete().eq('id', id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="font-poppins text-2xl font-bold sm:text-3xl">Study Planner</h1>
          <p className="mt-1 text-muted-foreground">Generate AI study plans or add your own study sessions.</p>
        </div>

        <Card className="mb-6 animate-scale-in">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg">
              <Calendar className="h-6 w-6" />
            </div>
            <CardTitle>AI Study Plan Generator</CardTitle>
            <CardDescription>Let AI create a personalized study schedule for you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="e.g. Calculus, Organic Chemistry..." value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className="w-full space-y-2 sm:w-32">
                <Label htmlFor="days">Days</Label>
                <Input id="days" type="number" min={1} max={7} value={days} onChange={(e) => setDays(Math.min(7, Math.max(1, parseInt(e.target.value) || 1)))} />
              </div>
              <Button onClick={handleGenerate} className="gap-2" disabled={loading || !subject.trim()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate
              </Button>
            </div>
            {generated.length > 0 && (
              <div className="space-y-3 animate-fade-in-up">
                {generated.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-sm font-bold text-violet-500">{i + 1}</div>
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                      <div className="mt-2 flex gap-2">
                        <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />{item.durationMinutes} min</Badge>
                        <Badge variant="secondary">{item.subject}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
                <Button onClick={handleSaveGenerated} className="w-full gap-2">Save Plan to Calendar</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mb-6">
          <Button variant="outline" onClick={() => setShowAdd(!showAdd)} className="gap-2"><Plus className="h-4 w-4" /> Add Study Session</Button>
        </div>

        {showAdd && (
          <Card className="mb-6 animate-scale-in">
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="np-title">Title</Label><Input id="np-title" placeholder="e.g. Review Chapter 3" value={newPlan.title} onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="np-subject">Subject</Label><Input id="np-subject" placeholder="e.g. Physics" value={newPlan.subject} onChange={(e) => setNewPlan({ ...newPlan, subject: e.target.value })} /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="np-date">Date</Label><Input id="np-date" type="date" value={newPlan.date} onChange={(e) => setNewPlan({ ...newPlan, date: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="np-duration">Duration (minutes)</Label><Input id="np-duration" type="number" min={15} step={15} value={newPlan.duration} onChange={(e) => setNewPlan({ ...newPlan, duration: parseInt(e.target.value) || 60 })} /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="np-desc">Description (optional)</Label><Textarea id="np-desc" placeholder="What will you study?" value={newPlan.description} onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })} /></div>
              <Button onClick={handleAddManual} className="w-full">Add to Schedule</Button>
            </CardContent>
          </Card>
        )}

        <div>
          <h2 className="mb-4 font-poppins text-xl font-semibold">Your Study Schedule</h2>
          {plans.length === 0 ? (
            <Card className="text-center"><CardContent className="py-12"><BookOpen className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" /><p className="text-muted-foreground">No study sessions yet. Generate a plan or add one manually!</p></CardContent></Card>
          ) : (
            <div className="space-y-3">
              {plans.map((plan, i) => (
                <Card key={plan.id} className={cn('animate-fade-in-up transition-all', plan.completed && 'opacity-60')} style={{ animationDelay: `${i * 50}ms` }}>
                  <CardContent className="flex items-start gap-4 py-4">
                    <button onClick={() => handleToggle(plan.id, plan.completed)} className={cn('mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all', plan.completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-muted-foreground/30 hover:border-accent')}>
                      {plan.completed && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                    <div className="flex-1">
                      <div className={cn('font-medium', plan.completed && 'line-through')}>{plan.title}</div>
                      {plan.description && <div className="text-sm text-muted-foreground">{plan.description}</div>}
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />{plan.duration_minutes} min</Badge>
                        {plan.subject && <Badge variant="secondary">{plan.subject}</Badge>}
                        <Badge variant="outline">{new Date(plan.study_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(plan.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlannerPage() {
  return <AuthGuard><PlannerContent /></AuthGuard>;
}
