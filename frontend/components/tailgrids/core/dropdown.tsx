"use client";

import { cn } from "@/lib/cn";
import type { ComponentProps } from "react";
import {
  Button,
  type ButtonProps,
  Header,
  Menu,
  MenuItem,
  type MenuItemProps,
  MenuSection,
  type MenuSectionProps,
  MenuTrigger,
  type MenuTriggerProps,
  Popover,
  type PopoverProps,
  Separator,
} from "react-aria-components";

export function DropdownMenu(props: MenuTriggerProps) {
  return <MenuTrigger {...props} />;
}

export function DropdownMenuTrigger({ className, ...props }: ButtonProps) {
  return <Button className={cn("outline-none cursor-pointer", className)} {...props} />;
}

type DropdownContentProps = PopoverProps;

export function DropdownMenuContent({ children, className, ...props }: DropdownContentProps) {
  return (
    <Popover {...props}>
      <Menu
        className={cn(
          "min-w-44 overflow-clip rounded-2xl border border-card-border bg-card-background p-1.5 shadow-xl outline-hidden",
          className,
        )}
      >
        {children}
      </Menu>
    </Popover>
  );
}

type DropdownMenuItemProps = MenuItemProps;

export function DropdownMenuItem({ className, ...props }: DropdownMenuItemProps) {
  return (
    <MenuItem
      {...props}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-secondary outline-hidden hover:bg-sidebar-navigation-nav-item-nav-hover-background hover:text-text-primary focus:bg-sidebar-navigation-nav-item-nav-hover-background focus:text-text-primary transition-colors",
        className,
      )}
    />
  );
}

export function DropdownMenuSection<T extends object>({
  className,
  ...props
}: MenuSectionProps<T>) {
  return <MenuSection {...props} className={cn("", className)} />;
}

export function DropdownMenuHeader({ className, ...props }: ComponentProps<typeof Header>) {
  return <Header {...props} className={cn("px-3 py-2 text-xs font-bold uppercase tracking-wider text-text-tertiary", className)} />;
}

export function DropdownMenuSeparator({ className, ...props }: ComponentProps<"hr">) {
  return (
    <Separator className={cn("my-1 h-px border-none bg-card-border", className)} {...props} />
  );
}
