import * as React from "react"
import { cn } from "../../lib/utils"

export interface EnhancedTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'clinical'
}

const EnhancedTextarea = React.forwardRef<HTMLTextAreaElement, EnhancedTextareaProps>(
  ({ className, size = 'lg', variant = 'clinical', ...props }, ref) => {
    const sizeClasses = {
      sm: 'min-h-[60px] px-3 py-2 text-sm',
      md: 'min-h-[80px] px-3 py-2 text-sm',
      lg: 'min-h-[120px] px-4 py-3 text-base',
      xl: 'min-h-[160px] px-5 py-4 text-lg'
    }

    const variantClasses = {
      default: 'border-input bg-background',
      clinical: 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
    }

    return (
      <textarea
        className={cn(
          "flex w-full rounded-md border transition-colors placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-y",
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
EnhancedTextarea.displayName = "EnhancedTextarea"

export { EnhancedTextarea }
