import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain, MessageSquare, FileText, Layers, Calendar, BarChart3,
  Upload, Sparkles, ArrowRight, CheckCircle2, Star, Zap, BookOpen, Target, Users
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'AI Chatbot Tutor',
    description: 'Ask any question and get instant, contextual explanations from your personal AI tutor.',
    href: '/chatbot',
    color: 'from-sky-500 to-cyan-500',
  },
  {
    icon: FileText,
    title: 'Quiz Generator',
    description: 'Automatically create practice quizzes on any topic with detailed explanations for each answer.',
    href: '/quiz',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BookOpen,
    title: 'Notes Summarizer',
    description: 'Paste long texts and get concise summaries with key points extracted automatically.',
    href: '/notes',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Layers,
    title: 'Flashcard Generator',
    description: 'Turn any subject into interactive flashcards with spaced repetition for better retention.',
    href: '/flashcards',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Calendar,
    title: 'Study Planner',
    description: 'Get a personalized AI-generated study schedule tailored to your subjects and timeline.',
    href: '/planner',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: BarChart3,
    title: 'Progress Dashboard',
    description: 'Track your learning journey with visual analytics on quizzes, flashcards, and study time.',
    href: '/dashboard',
    color: 'from-blue-500 to-indigo-500',
  },
];

const stats = [
  { value: '50K+', label: 'Active Students' },
  { value: '1M+', label: 'Quizzes Generated' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'AI Availability' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Pre-Med Student',
    avatar: 'https://images.pexels.com/photos/8199174/pexels-photo-8199174.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    content: 'Wano AI completely transformed how I study for my medical exams. The quiz generator saves me hours every week, and the AI tutor explains complex biology concepts better than my textbook.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Engineering Student',
    avatar: 'https://images.pexels.com/photos/16160880/pexels-photo-16160880.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    content: 'The flashcard generator is a game changer. I went from struggling with formulas to acing my calculus exams. The study planner keeps me on track every single week.',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'Law Student',
    avatar: 'https://images.pexels.com/photos/16120646/pexels-photo-16120646.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    content: 'The notes summarizer helps me condense hundreds of pages of case law into digestible summaries. I can\'t imagine studying without Wano AI anymore.',
    rating: 5,
  },
];

const steps = [
  { icon: Users, title: 'Create Your Account', description: 'Sign up for free and set up your student profile with your subjects and goals.' },
  { icon: Sparkles, title: 'Choose Your Tools', description: 'Pick from quizzes, flashcards, summaries, or chat with your AI tutor anytime.' },
  { icon: Target, title: 'Track Your Progress', description: 'Monitor your improvement with detailed analytics and stay motivated.' },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent" />

        {/* Animated background blobs */}
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl animate-float" />
        <div className="absolute top-40 right-1/4 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl animate-float animation-delay-1000" />

        <div className="container relative mx-auto px-4 py-20 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 animate-fade-in-down gap-1.5 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-accent" />
              AI-Powered Learning Platform
            </Badge>

            <h1 className="mb-6 font-poppins text-4xl font-bold leading-tight tracking-tight animate-fade-in-up sm:text-5xl md:text-6xl lg:text-7xl">
              Learn Smarter with{' '}
              <span className="gradient-text animate-gradient">AI</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground animate-fade-in-up animation-delay-200 sm:text-xl">
              Wano AI is your personal study companion. Generate quizzes, flashcards, and summaries,
              chat with an AI tutor, and track your progress — all in one beautiful platform.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 animate-fade-in-up animation-delay-300 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="group gap-2 text-base px-8 h-12">
                  Start Learning Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-base px-8 h-12">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in animation-delay-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Free forever plan
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="mx-auto mt-16 max-w-5xl animate-scale-in animation-delay-500">
            <div className="relative overflow-hidden rounded-2xl border shadow-2xl">
              <img
                src="https://images.pexels.com/photos/7972959/pexels-photo-7972959.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Students learning with Wano AI"
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-card/30 py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="font-poppins text-3xl font-bold gradient-text sm:text-4xl lg:text-5xl">{stat.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Zap className="h-3.5 w-3.5 text-accent" />
              Powerful Features
            </Badge>
            <h2 className="font-poppins text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Everything you need to{' '}
              <span className="gradient-text">ace your studies</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Six powerful AI tools designed to supercharge your learning and help you achieve more.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Link key={feature.title} href={feature.href}>
                <Card
                  className="group h-full cursor-pointer border-border/50 transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CardHeader>
                    <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                      Learn more <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y bg-card/30 py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-poppins text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started in minutes. Three simple steps to smarter learning.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="relative text-center animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg">
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="mb-2 text-sm font-bold text-accent">Step {i + 1}</div>
                <h3 className="mb-2 font-poppins text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full">
                    <ArrowRight className="absolute left-0 h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Star className="h-3.5 w-3.5 text-accent" />
              Loved by Students
            </Badge>
            <h2 className="font-poppins text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Don't just take our word for it
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Card key={t.name} className="animate-fade-in-up h-full" style={{ animationDelay: `${i * 150}ms` }}>
                <CardContent className="pt-6">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-sm text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 px-6 py-16 text-center shadow-2xl lg:px-12 lg:py-24">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.15))] animate-pulse-glow" />
            <div className="relative">
              <Brain className="mx-auto mb-6 h-16 w-16 text-white animate-float" />
              <h2 className="font-poppins text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Ready to learn smarter?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
                Join thousands of students who are already studying smarter with Wano AI. It's free to get started.
              </p>
              <Link href="/signup" className="mt-8 inline-block">
                <Button size="lg" variant="secondary" className="group gap-2 bg-white text-sky-600 hover:bg-white/90 px-8 h-12 text-base">
                  Get Started for Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
