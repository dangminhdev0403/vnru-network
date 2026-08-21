"use client";

import { cn } from "@/lib/cn";
import { ComponentProps } from "react";
import { Heading, HeadingProps } from "react-aria-components";

export function Card({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-card-border bg-card-background p-5 shadow-sm transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-wrap items-center justify-between gap-3 pb-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: HeadingProps) {
  return (
    <Heading
      className={cn(
        "text-lg font-bold leading-6 tracking-tight text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </Heading>
  );
}

export function CardDescription({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-1 text-sm leading-5 text-text-secondary",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardAction({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("text-text-tertiary", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("text-text-primary", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("pt-4 text-text-secondary border-t border-card-border", className)} {...props}>
      {children}
    </div>
  );
}
