import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { Save, Mail, User as UserIcon, Calendar } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { auth, db } from '@/lib/firebase';
import { toast } from '@/components/ui/Toast';

export default function ProfilePage() {
  const { profile, user } = useAuth();
  const [name, setName] = useState(profile?.displayName ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile) return;
    setSaving(true);
    try {
      await updateProfile(auth.currentUser!, { displayName: name.trim() });
      await updateDoc(doc(db, 'users', user.uid), { displayName: name.trim() });
      toast('success', 'Profile updated.');
    } catch {
      toast('error', 'Could not update profile. Try again.');
    } finally {
      setSaving(false);
    }
  }

  const joined = (profile as { createdAt?: { toDate?: () => Date } } | null)?.createdAt?.toDate?.();

  return (
    <AppShell>
      <h1 className="font-display text-2xl font-bold text-white">Your profile</h1>
      <p className="mt-1 text-sm text-ink-300">Manage how your name appears across Wano AI.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="card-surface p-6">
            <h2 className="font-display text-lg font-semibold text-white">Account details</h2>
            <div className="mt-5 space-y-4">
              <Input
                label="Full name"
                icon={<UserIcon size={18} />}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email"
                icon={<Mail size={18} />}
                value={profile?.email ?? ''}
                disabled
                className="opacity-60"
              />
              <Input
                label="Joined"
                icon={<Calendar size={18} />}
                value={joined ? joined.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                disabled
                className="opacity-60"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit" loading={saving}>
                <Save size={18} /> Save changes
              </Button>
            </div>
          </form>
        </div>

        <div className="card-surface flex flex-col items-center p-6 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-accent-500 to-accent-400 text-2xl font-bold text-ink-950">
            {(name || profile?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <p className="mt-4 font-medium text-white">{name || 'Student'}</p>
          <p className="text-sm text-ink-400">{profile?.email}</p>
        </div>
      </div>
    </AppShell>
  );
}
