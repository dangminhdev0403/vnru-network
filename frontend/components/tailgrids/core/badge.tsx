"use client";

import { cn } from "@/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

export const badgeStyles = cva(
  "inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        neutral: "bg-badge-neutral-background text-badge-neutral-text",
        primary: "bg-badge-primary-background text-badge-primary-text",
        error: "bg-badge-error-background text-badge-error-text",
        warning: "bg-badge-warning-background text-badge-warning-text",
        success: "bg-badge-success-background text-badge-success-text",
        cyan: "bg-badge-cyan-background text-badge-cyan-text",
        sky: "bg-badge-sky-background text-badge-sky-text",
        blue: "bg-badge-blue-background text-badge-blue-text",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px] leading-3.5",
        md: "px-2.5 py-1 text-xs leading-4",
        lg: "px-3.5 py-1.5 text-xs leading-4",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeStyles> & {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
  };

export function Badge({
  variant,
  size,
  startIcon,
  endIcon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeStyles({ variant, size }), className)} {...props}>
      {startIcon && <span className="shrink-0">{startIcon}</span>}
      {children}
      {endIcon && <span className="shrink-0">{endIcon}</span>}
    </span>
  );
}
