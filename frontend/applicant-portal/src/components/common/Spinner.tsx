import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './Button';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fullScreen?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className,
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const spinner = (
    <Loader2
      className={cn('animate-spin text-primary-600', sizeClasses[size], className)}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 min-h-screen flex items-center justify-center bg-gray-50 bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center items-center">{spinner}</div>;
};
