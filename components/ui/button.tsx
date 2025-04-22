import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-luxury-black text-white hover:bg-black hover:shadow-elegant rounded-sm",
        primary: "bg-primary-600 text-white hover:bg-primary-700 hover:shadow-subtle rounded-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-sm",
        outline:
          "border border-luxury-black text-luxury-black hover:bg-luxury-black hover:text-white rounded-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-sm",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground rounded-sm focus-visible:ring-offset-0 focus-visible:ring-1",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        minimal: "bg-transparent hover:bg-black/5 text-luxury-black rounded-sm",
        luxury: "bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90 hover:shadow-elegant dark:bg-luxury-royalBlue dark:text-white dark:hover:bg-luxury-royalBlueMuted rounded-sm transition-colors duration-500 will-change-auto backface-visibility-hidden",
        "luxury-outline": "border border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10 rounded-sm",
      },
      size: {
        default: "h-10 py-2 px-6",
        sm: "h-9 text-sm px-4 py-2",
        lg: "h-12 px-8 py-3 text-base",
        xl: "h-14 px-10 py-4 text-lg",
        icon: "h-10 w-10 p-2",
      },
      animation: {
        none: "",
        scale: "hover:scale-105 active:scale-95",
        lift: "hover:-translate-y-1 active:translate-y-0",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
