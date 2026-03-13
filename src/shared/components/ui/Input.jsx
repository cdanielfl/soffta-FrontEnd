import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Input = forwardRef(({ 
  className, 
  type = 'text',
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'w-full px-4 py-2.5 rounded-lg',
        'bg-[var(--bg-secondary)] border border-[var(--border)]',
        'text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]',
        'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent',
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error && 'border-red-500 focus:ring-red-500',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export const Label = ({ children, className, htmlFor, ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'block text-sm font-medium text-[var(--text-primary)] mb-2',
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
};

export const FormGroup = ({ children, className, ...props }) => {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
};

export const FormError = ({ children, className, ...props }) => {
  if (!children) return null;
  
  return (
    <p
      className={cn('text-sm text-red-600 dark:text-red-400 mt-1', className)}
      {...props}
    >
      {children}
    </p>
  );
};
