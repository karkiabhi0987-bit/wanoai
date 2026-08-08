'use client';

import { useState, useEffect } from 'react';
import { User, Mail, GraduationCap, Target, Loader2, Save, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AuthGuard } from '@/components/auth-guard';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';

interface Profile {
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  education_level: string | null;
  goals: string | null;
}

function ProfileContent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>({ full_name: '', avatar_url: null, bio: null, education_level: null, goals: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user?.id).maybeSingle();
      if (data) setProfile(data as Profile);
      else if (user) setProfile((prev) => ({ ...prev, full_name: user.user_metadata?.full_name || '' }));
      setLoading(false);
    })();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const payload = { id: user?.id, full_name: profile.full_name, avatar_url: profile.avatar_url, bio: profile.bio, education_level: profile.education_level, goals: profile.goals };
    const { data: existing } = await supabase.from('profiles').select('id').eq('id', user?.id).maybeSingle();
    if (existing) await supabase.from('profiles').update(payload).eq('id', user?.id);
    else await supabase.from('profiles').insert(payload);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = (profile.full_name || user?.email || 'U').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="font-poppins text-2xl font-bold sm:text-3xl">Student Profile</h1>
          <p className="mt-1 text-muted-foreground">Manage your personal information and learning goals.</p>
        </div>

        <Card className="mb-6 animate-scale-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-sky-500 to-emerald-500 text-white text-xl font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-poppins text-xl font-bold">{profile.full_name || 'Student'}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                {profile.education_level && <Badge variant="secondary" className="mt-2 gap-1"><GraduationCap className="h-3 w-3" /> {profile.education_level}</Badge>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up">
          <CardHeader><CardTitle>Edit Profile</CardTitle><CardDescription>Update your information to personalize your experience.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label htmlFor="name">Full Name</Label><div className="relative"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="name" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="pl-9" /></div></div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="email" value={user?.email || ''} disabled className="pl-9" /></div></div>
            <div className="space-y-2"><Label htmlFor="avatar">Avatar URL</Label><Input id="avatar" placeholder="https://..." value={profile.avatar_url || ''} onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="education">Education Level</Label><div className="relative"><GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="education" placeholder="e.g. Undergraduate, High School..." value={profile.education_level || ''} onChange={(e) => setProfile({ ...profile, education_level: e.target.value })} className="pl-9" /></div></div>
            <div className="space-y-2"><Label htmlFor="bio">Bio</Label><Textarea id="bio" placeholder="Tell us about yourself..." value={profile.bio || ''} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="goals" className="flex items-center gap-1.5"><Target className="h-4 w-4 text-accent" /> Learning Goals</Label><Textarea id="goals" placeholder="What do you want to achieve?" value={profile.goals || ''} onChange={(e) => setProfile({ ...profile, goals: e.target.value })} /></div>
            <Button onClick={handleSave} className="w-full gap-2" disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : saved ? <><CheckCircle2 className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Changes</>}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return <AuthGuard><ProfileContent /></AuthGuard>;
}
