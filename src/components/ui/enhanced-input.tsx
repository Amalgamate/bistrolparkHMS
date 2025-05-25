import * as React from "react"
import { cn } from "../../lib/utils"

export interface EnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'clinical'
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ className, type, size = 'lg', variant = 'clinical', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-3 text-sm', 
      lg: 'h-12 px-4 text-base',
      xl: 'h-14 px-5 text-lg'
    }

    const variantClasses = {
      default: 'border-input bg-background',
      clinical: 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
    }

    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-md border transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
EnhancedInput.displayName = "EnhancedInput"

export { EnhancedInput }
