"use client";

import { cn } from "@/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const tableRootStyles = cva(
  "min-w-full border-separate border-spacing-0 text-left text-sm",
  {
    variants: {
      fullBleed: {
        true: "border-y border-card-border",
        false: "rounded-2xl border border-card-border overflow-hidden",
      },
    },
    defaultVariants: {
      fullBleed: false,
    },
  },
);

type TableRootProps = ComponentProps<"table"> & VariantProps<typeof tableRootStyles>;

export function TableRoot({ className, fullBleed, ...props }: TableRootProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn(tableRootStyles({ fullBleed }), className)} {...props} />
    </div>
  );
}

const tableHeaderStyles = cva(
  "bg-background-gray-primary text-text-secondary text-xs font-bold uppercase tracking-wider",
);

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return <thead className={cn(tableHeaderStyles(), className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody className={cn("divide-y divide-card-border bg-card-background", className)} {...props} />;
}

const tableHeadStyles = cva("px-4 py-3.5 border-b border-card-border");

export function TableHead({ className, ...props }: ComponentProps<"th">) {
  return <th className={cn(tableHeadStyles(), className)} {...props} />;
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-sidebar-navigation-nav-item-nav-hover-background",
        className,
      )}
      {...props}
    />
  );
}

const tableCellStyles = cva("px-4 py-3.5 text-text-primary text-sm");

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return <td className={cn(tableCellStyles(), className)} {...props} />;
}
