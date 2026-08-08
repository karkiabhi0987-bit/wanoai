'use client';

import { useState, FormEvent } from 'react';
import { Mail, MessageSquare, MapPin, Phone, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSent(true);
    setName(''); setEmail(''); setSubject(''); setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="container mx-auto px-4 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center animate-fade-in-up">
          <h1 className="font-poppins text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Get in <span className="gradient-text">Touch</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">Have a question, suggestion, or just want to say hello? We'd love to hear from you.</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4">
            {[
              { icon: Mail, title: 'Email', value: 'hello@wanoai.com' },
              { icon: Phone, title: 'Phone', value: '+1 (555) 123-4567' },
              { icon: MapPin, title: 'Office', value: '123 Education St, San Francisco, CA' },
            ].map((item, i) => (
              <Card key={item.title} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 text-white"><item.icon className="h-5 w-5" /></div>
                  <div><div className="text-sm font-medium">{item.title}</div><div className="text-sm text-muted-foreground">{item.value}</div></div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-2">
            <Card className="animate-scale-in">
              <CardHeader>
                <div className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-accent" /><CardTitle>Send a Message</CardTitle></div>
                <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                {sent && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400 animate-fade-in">
                    <CheckCircle2 className="h-4 w-4 shrink-0" /> Message sent! We'll get back to you soon.
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                    <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="subject">Subject</Label><Input id="subject" placeholder="What's this about?" value={subject} onChange={(e) => setSubject(e.target.value)} required /></div>
                  <div className="space-y-2"><Label htmlFor="message">Message</Label><Textarea id="message" placeholder="Tell us more..." value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-[150px]" required /></div>
                  <Button type="submit" className="w-full gap-2" disabled={loading}>
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <><Send className="h-4 w-4" /> Send Message</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
