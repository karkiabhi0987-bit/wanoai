import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { friendlyAuthError, validateEmail } from '@/lib/validation';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const v = validateEmail(email);
    setError(v);
    if (v) return;
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err) {
      setFormError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <Link to="/login" className="inline-flex items-center gap-1.5 font-medium text-accent-400 hover:text-accent-300">
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
            <p>
              If an account exists for <span className="font-medium">{email}</span>, a password reset
              email is on its way. Check your inbox (and spam folder).
            </p>
          </div>
          <Link to="/login" className="btn-primary w-full">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {formError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {formError}
            </div>
          )}
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
          <Button type="submit" loading={loading} className="w-full">
            {loading ? 'Sending link…' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
