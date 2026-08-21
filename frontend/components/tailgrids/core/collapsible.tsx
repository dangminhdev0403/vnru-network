"use client";

import { cn } from "@/lib/cn";
import {
  Button,
  type ButtonProps,
  Disclosure,
  DisclosureGroup,
  type DisclosureGroupProps,
  DisclosurePanel,
  type DisclosurePanelProps,
  type DisclosureProps,
  Heading,
  type HeadingProps,
} from "react-aria-components";

export interface CollapsibleProps extends DisclosureProps {
  className?: string;
}

export function Collapsible({ className, ...props }: CollapsibleProps) {
  return (
    <Disclosure
      data-slot="collapsible"
      className={cn(
        "group w-full rounded-xl bg-transparent transition-all",
        className,
      )}
      {...props}
    />
  );
}

export interface CollapsibleTriggerProps extends ButtonProps {
  level?: HeadingProps["level"];
  className?: string;
}

export function CollapsibleTrigger({
  children,
  className,
  level = 3,
  ...props
}: CollapsibleTriggerProps) {
  return (
    <Heading level={level} className="m-0 p-0">
      <Button
        slot="trigger"
        data-slot="collapsible-trigger"
        className={cn(
          "group flex w-full items-center justify-between gap-2 text-left outline-none cursor-pointer select-none",
          className,
        )}
        {...props}
      >
        {children}
      </Button>
    </Heading>
  );
}

export interface CollapsibleContentProps extends DisclosurePanelProps {
  className?: string;
}

export function CollapsibleContent({ className, ...props }: CollapsibleContentProps) {
  return (
    <DisclosurePanel
      data-slot="collapsible-content"
      className={cn("text-text-secondary overflow-hidden", className)}
      {...props}
    />
  );
}

export interface CollapsibleGroupProps extends DisclosureGroupProps {
  className?: string;
}

export function CollapsibleGroup({ className, ...props }: CollapsibleGroupProps) {
  return <DisclosureGroup data-slot="collapsible-group" className={className} {...props} />;
}
