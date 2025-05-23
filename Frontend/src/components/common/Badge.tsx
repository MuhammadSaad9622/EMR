import React from 'react';

interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  variant, 
  children, 
  className = '' 
}) => {
  const baseClasses = 'badge';
  
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    neutral: 'badge-neutral',
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    className
  ].join(' ');

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;