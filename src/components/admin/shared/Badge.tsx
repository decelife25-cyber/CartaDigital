import { type HTMLAttributes, forwardRef } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const variants = {
      success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      danger: 'bg-red-500/10 text-red-400 border-red-500/20',
      info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      default: 'bg-slate-800 text-slate-300 border-slate-700',
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
