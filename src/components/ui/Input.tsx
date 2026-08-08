import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, id, className = '', ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="label-text">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`auth-input ${icon ? 'pl-10' : ''} ${error ? 'auth-input-error' : ''} ${className}`}
            aria-invalid={!!error}
            {...props}
          />
        </div>
        {error && (
          <p className="helper-error">
            <AlertCircle size={14} />
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

interface PasswordInputProps extends Omit<InputProps, 'type' | 'icon'> {
  type?: 'password' | 'text';
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [show, setShow] = useState(false);
    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="label-text">
            {label}
          </label>
        )}
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <input
            ref={ref}
            id={inputId}
            type={show ? 'text' : 'password'}
            className={`auth-input pl-10 pr-11 ${error ? 'auth-input-error' : ''} ${className}`}
            aria-invalid={!!error}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-ink-200"
            tabIndex={-1}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && (
          <p className="helper-error">
            <AlertCircle size={14} />
            {error}
          </p>
        )}
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
