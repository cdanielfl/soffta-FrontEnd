import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = {
  primary: 'bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  outline: 'border-2 border-[var(--border)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]',
  ghost: 'hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]'
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl'
};

export const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  disabled,
  isLoading,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {isLoading && (
        <div className="loading-spinner" />
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
