import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "rounded-md bg-brand text-white hover:bg-brand-bright",
        secondary:
          "rounded-md bg-white text-brand border border-brand/20 hover:bg-brado-gray",
        outline:
          "rounded-md border border-foreground/20 text-foreground hover:border-foreground/40 hover:bg-foreground/5",
        ghost:
          "rounded-md text-foreground/80 hover:bg-foreground/10 hover:text-foreground",
        destructive: "rounded-md bg-red-600 text-white hover:bg-red-700",
        /* Public site: square, poster-cased, brand blue */
        brand:
          "rounded-none bg-brand font-display text-base font-bold uppercase tracking-wide text-white hover:bg-brand-bright",
        /* Public site: hairline outline, same geometry as `brand` */
        line: "rounded-none border border-border-strong font-display text-base font-bold uppercase tracking-wide text-foreground hover:border-signal hover:text-signal",
        mustard:
          "rounded-none bg-brand-bright font-display text-base font-bold uppercase tracking-wide text-white hover:bg-brand",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
