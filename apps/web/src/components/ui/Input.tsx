import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import * as React from 'react';

const inputVariants = cva(
  'flex w-full rounded-lg border bg-transparent px-4 py-2.5 text-base transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-dark-border bg-dark-surface text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:shadow-glow-sm',
        error:
          'border-accent-red bg-dark-surface text-white focus:border-accent-red focus:ring-2 focus:ring-accent-red/20',
        success:
          'border-accent-green bg-dark-surface text-white focus:border-accent-green focus:ring-2 focus:ring-accent-green/20',
      },
      inputSize: {
        sm: 'h-9 px-3 py-2 text-sm',
        md: 'h-11 px-4 py-2.5 text-base',
        lg: 'h-14 px-5 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      inputSize,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      value,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = React.useId();
    const computedVariant = error ? 'error' : variant;
    const showClearButton = clearable && value && !disabled;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-white mb-2"
          >
            {label}
            {props.required && <span className="text-accent-red ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              inputVariants({ variant: computedVariant, inputSize }),
              leftIcon && 'pl-10',
              (rightIcon || showClearButton) && 'pr-10',
              className
            )}
            ref={ref}
            value={value}
            disabled={disabled}
            {...props}
          />
          {showClearButton && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              tabIndex={-1}
              aria-label="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {rightIcon && !showClearButton && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-accent-red flex items-center gap-1" role="alert">
            <span className="inline-block w-1 h-1 bg-accent-red rounded-full" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };
