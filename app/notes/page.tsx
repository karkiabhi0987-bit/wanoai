'use client';

import { useState } from 'react';
import { BookOpen, Loader2, Sparkles, FileText, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AuthGuard } from '@/components/auth-guard';
import { supabase } from '@/lib/supabase/client';
import { summarizeNotes, NoteSummary } from '@/lib/ai';

function NotesContent() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState<NoteSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setSaved(false);
    const summary = await summarizeNotes(text);
    setResult(summary);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!result) return;
    await supabase.from('notes').insert({ title: title || 'Untitled Note', original_text: text, summary: result.summary, key_points: result.keyPoints });
    await supabase.from('progress_entries').insert({ activity_type: 'note' });
    setSaved(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="font-poppins text-2xl font-bold sm:text-3xl">Notes Summarizer</h1>
          <p className="mt-1 text-muted-foreground">Paste any text and let AI extract the key points for you.</p>
        </div>
        <Card className="animate-scale-in">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <CardTitle>Summarize Your Notes</CardTitle>
            <CardDescription>Paste lecture notes, articles, or any text to get a concise summary.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title (optional)</Label>
              <Input id="title" placeholder="e.g. Chapter 5: Cell Biology" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text">Your Notes</Label>
              <Textarea id="text" placeholder="Paste your text here..." value={text} onChange={(e) => setText(e.target.value)} className="min-h-[200px]" />
            </div>
            <Button onClick={handleSummarize} className="w-full gap-2" disabled={loading || !text.trim()}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Summarizing...</> : <><Sparkles className="h-4 w-4" /> Summarize</>}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="mt-6 space-y-4 animate-fade-in-up">
            <Card>
              <CardHeader><div className="flex items-center gap-2"><FileText className="h-5 w-5 text-accent" /><CardTitle className="text-lg">Summary</CardTitle></div></CardHeader>
              <CardContent><p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p></CardContent>
            </Card>
            <Card>
              <CardHeader><div className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-accent" /><CardTitle className="text-lg">Key Points</CardTitle></div></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.keyPoints.map((point, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Button onClick={handleSave} variant="outline" className="w-full gap-2">{saved ? 'Saved!' : 'Save to My Notes'}</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NotesPage() {
  return <AuthGuard><NotesContent /></AuthGuard>;
}
