export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Email is required';
  if (!emailRegex.test(email)) return 'Enter a valid email address';
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return undefined;
}

export function validateName(name: string): string | undefined {
  if (!name.trim()) return 'Full name is required';
  if (name.trim().length < 2) return 'Name is too short';
  return undefined;
}

export function validateConfirm(password: string, confirm: string): string | undefined {
  if (!confirm) return 'Please confirm your password';
  if (confirm !== password) return 'Passwords do not match';
  return undefined;
}

/** Maps a Firebase error code to a friendly message. */
export function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/invalid-email': 'That email address looks invalid.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 8 characters.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/cancelled-popup-request': 'Google sign-in was cancelled.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
  };
  return map[code] ?? 'Something went wrong. Please try again.';
}
