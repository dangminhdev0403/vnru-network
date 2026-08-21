"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  dividerType?: "slash" | "chevron";
  className?: string;
}

export function Breadcrumbs({
  items,
  dividerType = "chevron",
  className,
}: BreadcrumbsProps) {
  const divider =
    dividerType === "chevron" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-text-tertiary"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    ) : (
      <span className="text-text-tertiary">/</span>
    );

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-xs", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <span className="mx-1 shrink-0">{divider}</span>}
            {isLast || !item.href ? (
              <span className="font-semibold text-text-primary">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-text-tertiary transition-colors hover:text-brand-500 font-medium"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
