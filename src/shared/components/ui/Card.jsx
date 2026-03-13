import { cn } from '../../lib/utils';

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('p-6 pb-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className, ...props }) => {
  return (
    <h3
      className={cn('text-xl font-semibold text-[var(--text-primary)]', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className, ...props }) => {
  return (
    <p
      className={cn('text-sm text-[var(--text-secondary)] mt-1', className)}
      {...props}
    >
      {children}
    </p>
  );
};

export const CardContent = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('p-6 pt-0 flex items-center gap-2', className)}
      {...props}
    >
      {children}
    </div>
  );
};
