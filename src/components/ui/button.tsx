import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F7377]/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#0F7377] text-white hover:opacity-90 dark:bg-teal-500 dark:hover:opacity-90",
        gradient: "gs-gradient text-white hover:opacity-90 shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
        outline:
          "border border-[#0F7377]/30 bg-transparent text-[#0F7377] hover:bg-[#0F7377]/10 dark:border-teal-500/30 dark:text-teal-400 dark:hover:bg-teal-500/10",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-[#0F7377] underline-offset-4 hover:underline dark:text-teal-400",
      },
      size: {
        default: "h-10 min-h-[44px] px-4 py-2",
        sm: "h-9 min-h-[44px] rounded-md px-3 text-xs",
        lg: "h-12 min-h-[44px] rounded-lg px-8 text-base",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
