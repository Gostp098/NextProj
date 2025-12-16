import { ButtonHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  icon?: LucideIcon;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className = '', 
    variant = 'default', 
    size = 'default',
    icon: Icon,
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-500',
      ghost: 'hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-500',
    };

    const sizes = {
      default: 'h-10 py-2 px-4',
      sm: 'h-8 px-3 text-sm',
      lg: 'h-12 px-8',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';