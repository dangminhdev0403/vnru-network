"use client";

import { cn } from "@/lib/cn";
import React from "react";
import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  type TooltipProps as AriaTooltipProps,
  type TooltipTriggerComponentProps,
} from "react-aria-components";

export interface TooltipProps extends AriaTooltipProps {
  children: React.ReactNode;
}

export function TooltipTrigger(props: TooltipTriggerComponentProps) {
  return <AriaTooltipTrigger delay={150} closeDelay={50} {...props} />;
}

export function Tooltip({ children, className, ...props }: TooltipProps) {
  return (
    <AriaTooltip
      offset={8}
      className={({ isEntering, isExiting }) =>
        cn(
          "z-50 rounded-lg border border-card-border bg-tooltip-background px-2.5 py-1 text-xs font-semibold text-tooltip-text-color shadow-lg transition-all",
          isEntering && "animate-in fade-in zoom-in-95 duration-150",
          isExiting && "animate-out fade-out zoom-out-95 duration-100",
          className
        )
      }
      {...props}
    >
      {children}
    </AriaTooltip>
  );
}

export function TooltipContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
