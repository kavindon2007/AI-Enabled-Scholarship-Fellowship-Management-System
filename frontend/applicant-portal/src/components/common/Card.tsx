import React from 'react';
import { cn } from './Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden', className)}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

export const CardHeader = ({ className, children }: CardProps) => (
  <div className={cn('px-6 py-4 border-b border-gray-200', className)}>{children}</div>
);

export const CardTitle = ({ className, children }: CardProps) => (
  <h3 className={cn('text-lg font-medium leading-6 text-gray-900', className)}>{children}</h3>
);

export const CardBody = ({ className, children }: CardProps) => (
  <div className={cn('px-6 py-4', className)}>{children}</div>
);

export const CardFooter = ({ className, children }: CardProps) => (
  <div className={cn('px-6 py-4 bg-gray-50 border-t border-gray-200', className)}>{children}</div>
);
