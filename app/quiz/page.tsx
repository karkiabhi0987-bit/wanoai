'use client';

import { useState } from 'react';
import { FileText, Loader2, Sparkles, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthGuard } from '@/components/auth-guard';
import { supabase } from '@/lib/supabase/client';
import { generateQuiz, QuizQuestion } from '@/lib/ai';
import { cn } from '@/lib/utils';

function QuizContent() {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setQuestions([]);
    setCurrentQ(0);
    setScore(0);
    setFinished(false);
    const qs = await generateQuiz(topic);
    setQuestions(qs);
    setLoading(false);
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[currentQ].correctIndex) setScore((s) => s + 1);
  };

  const handleNext = async () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
      await supabase.from('quizzes').insert(questions.map((q) => ({
        topic, question: q.question, options: q.options, correct_index: q.correctIndex, explanation: q.explanation,
      })));
      await supabase.from('progress_entries').insert({ activity_type: 'quiz', score, total: questions.length });
    }
  };

  const handleRestart = () => {
    setQuestions([]); setCurrentQ(0); setSelected(null); setScore(0); setAnswered(false); setFinished(false); setTopic('');
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="font-poppins text-2xl font-bold sm:text-3xl">Quiz Generator</h1>
          <p className="mt-1 text-muted-foreground">Generate AI-powered quizzes on any topic and test your knowledge.</p>
        </div>

        {questions.length === 0 && !finished && (
          <Card className="animate-scale-in">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                <FileText className="h-6 w-6" />
              </div>
              <CardTitle>Generate a Quiz</CardTitle>
              <CardDescription>Enter a topic and let AI create practice questions for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input id="topic" placeholder="e.g. Biology, Math, History..." value={topic} onChange={(e) => setTopic(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} />
              </div>
              <Button onClick={handleGenerate} className="w-full gap-2" disabled={loading || !topic.trim()}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating quiz...</> : <><Sparkles className="h-4 w-4" /> Generate Quiz</>}
              </Button>
            </CardContent>
          </Card>
        )}

        {questions.length > 0 && !finished && (
          <Card className="animate-scale-in">
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <Badge variant="secondary">Question {currentQ + 1} of {questions.length}</Badge>
                <Badge variant="secondary">Score: {score}</Badge>
              </div>
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" style={{ width: `${((currentQ + (answered ? 1 : 0)) / questions.length) * 100}%` }} />
              </div>
              <h3 className="mb-6 mt-4 text-lg font-semibold">{questions[currentQ].question}</h3>
              <div className="space-y-3">
                {questions[currentQ].options.map((opt, idx) => {
                  const isCorrect = idx === questions[currentQ].correctIndex;
                  const isSelected = idx === selected;
                  return (
                    <button key={idx} onClick={() => handleAnswer(idx)} disabled={answered}
                      className={cn('flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm transition-all duration-200',
                        !answered && 'hover:border-accent hover:bg-accent/5 cursor-pointer',
                        answered && isCorrect && 'border-emerald-500 bg-emerald-500/10',
                        answered && isSelected && !isCorrect && 'border-destructive bg-destructive/10',
                        answered && !isCorrect && !isSelected && 'opacity-50')}>
                      <span>{opt}</span>
                      {answered && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                      {answered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive" />}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <div className="mt-4 animate-fade-in-up">
                  <div className="rounded-lg bg-muted p-4 text-sm"><span className="font-semibold">Explanation: </span>{questions[currentQ].explanation}</div>
                  <Button onClick={handleNext} className="mt-4 w-full">{currentQ + 1 < questions.length ? 'Next Question' : 'See Results'}</Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {finished && (
          <Card className="animate-scale-in text-center">
            <CardContent className="pt-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="font-poppins text-2xl font-bold">Quiz Complete!</h2>
              <p className="mt-2 text-muted-foreground">You scored</p>
              <div className="my-4 font-poppins text-4xl font-bold gradient-text">{score} / {questions.length}</div>
              <p className="text-muted-foreground">{score === questions.length ? 'Perfect score!' : score >= questions.length / 2 ? 'Good job! Keep practicing.' : 'Keep studying — you will get there!'}</p>
              <Button onClick={handleRestart} className="mt-6 gap-2"><RotateCcw className="h-4 w-4" /> Generate Another Quiz</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return <AuthGuard><QuizContent /></AuthGuard>;
}
