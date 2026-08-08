import { Brain, Target, Sparkles, Heart, Shield, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const values = [
  { icon: Sparkles, title: 'Innovation First', description: 'We harness the latest AI technology to make learning more effective and engaging.' },
  { icon: Heart, title: 'Student-Centered', description: 'Every feature is designed with students in mind, solving real study challenges.' },
  { icon: Shield, title: 'Accessible Learning', description: 'Quality education tools should be available to everyone, regardless of background.' },
  { icon: Zap, title: 'Always Improving', description: 'We continuously refine our platform based on student feedback and learning science.' },
];

const team = [
  { name: 'Alex Rivera', role: 'Founder & CEO', initials: 'AR' },
  { name: 'Maya Thompson', role: 'Head of AI', initials: 'MT' },
  { name: 'Jordan Lee', role: 'Lead Designer', initials: 'JL' },
  { name: 'Sam Park', role: 'Head of Education', initials: 'SP' },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center animate-fade-in-up">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg">
            <Brain className="h-8 w-8" />
          </div>
          <Badge variant="secondary" className="mb-4 gap-1.5"><Sparkles className="h-3.5 w-3.5 text-accent" /> Our Story</Badge>
          <h1 className="font-poppins text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">About <span className="gradient-text">Wano AI</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            We're on a mission to make learning smarter, not harder. Wano AI brings cutting-edge artificial intelligence to every student's study routine, helping you understand more, remember longer, and achieve your academic goals faster.
          </p>
        </div>

        <Card className="mt-12 animate-fade-in-up animation-delay-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-lg"><Target className="h-7 w-7" /></div>
              <h2 className="font-poppins text-2xl font-bold">Our Mission</h2>
              <p className="max-w-2xl text-muted-foreground">
                To democratize access to personalized, AI-powered education tools that adapt to each student's unique learning style. We believe everyone deserves a personal tutor, and Wano AI makes that possible — anytime, anywhere, for free.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12">
          <h2 className="mb-8 text-center font-poppins text-2xl font-bold sm:text-3xl">Our Values</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((value, i) => (
              <Card key={value.title} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="pt-6">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/10 to-emerald-500/10 text-accent"><value.icon className="h-6 w-6" /></div>
                  <h3 className="mb-2 font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="mb-8 text-center font-poppins text-2xl font-bold sm:text-3xl">Meet the Team</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <Card key={member.name} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 text-white text-xl font-bold shadow-lg">{member.initials}</div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 rounded-3xl bg-gradient-to-br from-sky-500 to-emerald-500 p-12 text-center text-white md:grid-cols-4">
          {[
            { value: '50K+', label: 'Students' }, { value: '1M+', label: 'Quizzes' }, { value: '500K+', label: 'Flashcards' }, { value: '98%', label: 'Satisfaction' },
          ].map((stat, i) => (
            <div key={stat.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="font-poppins text-3xl font-bold sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
