import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'google';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading, disabled, children, className = '', ...props }, ref) => {
    const base =
      variant === 'primary'
        ? 'btn-primary'
        : variant === 'google'
          ? 'btn-google'
          : 'btn-ghost';
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${className}`}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
