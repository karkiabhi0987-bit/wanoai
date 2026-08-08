'use client';

import { useState } from 'react';
import { Layers, Loader2, Sparkles, ChevronLeft, ChevronRight, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthGuard } from '@/components/auth-guard';
import { supabase } from '@/lib/supabase/client';
import { generateFlashcards, Flashcard } from '@/lib/ai';
import { cn } from '@/lib/utils';

function FlashcardsContent() {
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setSaved(false);
    const generated = await generateFlashcards(topic);
    setCards(generated);
    setCurrent(0);
    setFlipped(false);
    setLoading(false);
  };

  const handleNext = () => { setFlipped(false); setCurrent((c) => (c + 1) % cards.length); };
  const handlePrev = () => { setFlipped(false); setCurrent((c) => (c - 1 + cards.length) % cards.length); };

  const handleSave = async () => {
    await supabase.from('flashcards').insert(cards.map((c) => ({ topic, question: c.question, answer: c.answer })));
    await supabase.from('progress_entries').insert({ activity_type: 'flashcard' });
    setSaved(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="font-poppins text-2xl font-bold sm:text-3xl">Flashcard Generator</h1>
          <p className="mt-1 text-muted-foreground">Create interactive flashcards on any subject with AI.</p>
        </div>

        {cards.length === 0 && (
          <Card className="animate-scale-in">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg">
                <Layers className="h-6 w-6" />
              </div>
              <CardTitle>Generate Flashcards</CardTitle>
              <CardDescription>Enter a subject and AI will create flashcards for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Subject / Topic</Label>
                <Input id="topic" placeholder="e.g. Biology, History, Chemistry..." value={topic} onChange={(e) => setTopic(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} />
              </div>
              <Button onClick={handleGenerate} className="w-full gap-2" disabled={loading || !topic.trim()}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating flashcards...</> : <><Sparkles className="h-4 w-4" /> Generate Flashcards</>}
              </Button>
            </CardContent>
          </Card>
        )}

        {cards.length > 0 && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">Card {current + 1} of {cards.length}</Badge>
              <Badge variant="secondary">{topic}</Badge>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500" style={{ width: `${((current + 1) / cards.length) * 100}%` }} />
            </div>
            <div className="relative h-64 cursor-pointer" onClick={() => setFlipped(!flipped)}>
              <div className={cn('absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d]', flipped && '[transform:rotateY(180deg)]')}>
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl border bg-card p-6 text-center shadow-lg [backface-visibility:hidden]">
                  <div><Badge variant="secondary" className="mb-3">Question</Badge><p className="text-lg font-medium">{cards[current].question}</p><p className="mt-4 text-xs text-muted-foreground">Click to flip</p></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl border bg-gradient-to-br from-rose-500/10 to-pink-500/10 p-6 text-center shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div><Badge variant="secondary" className="mb-3">Answer</Badge><p className="text-base text-muted-foreground">{cards[current].answer}</p></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button variant="outline" size="icon" onClick={handlePrev}><ChevronLeft className="h-5 w-5" /></Button>
              <Button variant="outline" onClick={() => setFlipped(!flipped)} className="flex-1">{flipped ? 'Show Question' : 'Show Answer'}</Button>
              <Button variant="outline" size="icon" onClick={handleNext}><ChevronRight className="h-5 w-5" /></Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} variant="outline" className="flex-1 gap-2">{saved ? 'Saved!' : <><Save className="h-4 w-4" /> Save Deck</>}</Button>
              <Button onClick={() => { setCards([]); setTopic(''); }} variant="ghost" className="gap-2"><RotateCcw className="h-4 w-4" /> New Deck</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return <AuthGuard><FlashcardsContent /></AuthGuard>;
}
