"use client";

import { cn } from "@/lib/cn";
import { cva } from "class-variance-authority";
import {
  Button as RACButton,
  type ButtonProps as RACButtonProps,
  composeRenderProps,
} from "react-aria-components";

export const buttonStyles = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition outline-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 select-none [&>svg]:text-current",
  {
    variants: {
      variant: {
        primary: "",
        danger: "",
        success: "",
        ghost: "",
      },
      appearance: {
        fill: "",
        outline: "",
        ghost: "",
      },
      iconOnly: {
        true: "p-2",
        false: "",
      },
      size: {
        xs: "h-7 text-xs px-2.5 gap-1 [&>svg]:size-3.5",
        sm: "h-8.5 text-xs px-3 gap-1.5 [&>svg]:size-4",
        md: "h-10 text-sm px-4 gap-2 [&>svg]:size-4.5",
        lg: "h-11 text-sm px-5 gap-2.5 [&>svg]:size-5",
        xl: "h-12 text-base px-6 gap-3 [&>svg]:size-5.5",
        xxl: "h-14 text-base px-7 gap-3 [&>svg]:size-6",
      },
    },
    compoundVariants: [
      // Primary Fill
      {
        variant: "primary",
        appearance: "fill",
        className:
          "bg-button-primary-background text-button-primary-text hover:bg-button-primary-hover-background focus:ring-4 focus:ring-button-primary-focus-ring shadow-sm",
      },
      // Primary Outline
      {
        variant: "primary",
        appearance: "outline",
        className:
          "border border-button-primary-outline-stroke bg-button-primary-outline-background text-button-primary-outline-text hover:bg-button-primary-outline-hover-background hover:text-text-primary focus:ring-4 focus:ring-button-primary-focus-ring",
      },
      // Primary Ghost
      {
        variant: "primary",
        appearance: "ghost",
        className:
          "text-text-secondary hover:bg-sidebar-navigation-nav-item-nav-hover-background hover:text-text-primary",
      },
      {
        variant: "ghost",
        className:
          "text-text-secondary hover:bg-sidebar-navigation-nav-item-nav-hover-background hover:text-text-primary",
      },

      // Danger Fill
      {
        variant: "danger",
        appearance: "fill",
        className:
          "bg-button-error-background text-button-error-text hover:bg-button-error-hover-background focus:ring-4 focus:ring-button-error-focus-ring shadow-sm",
      },
      // Danger Outline
      {
        variant: "danger",
        appearance: "outline",
        className:
          "border border-button-error-outline-stroke bg-button-error-outline-background text-button-error-outline-text hover:bg-button-error-outline-hover-background focus:ring-4 focus:ring-button-error-focus-ring",
      },
      // Danger Ghost
      {
        variant: "danger",
        appearance: "ghost",
        className:
          "text-button-error-outline-text hover:bg-button-error-outline-hover-background",
      },

      // Success Fill
      {
        variant: "success",
        appearance: "fill",
        className:
          "bg-button-success-background text-button-success-text hover:bg-button-success-hover-background focus:ring-4 focus:ring-button-success-focus-ring shadow-sm",
      },
      // Success Outline
      {
        variant: "success",
        appearance: "outline",
        className:
          "border border-button-success-outline-border bg-button-success-outline-background text-button-success-outline-text hover:bg-button-success-outline-hover-background focus:ring-4 focus:ring-button-success-focus-ring",
      },
      // Success Ghost
      {
        variant: "success",
        appearance: "ghost",
        className:
          "text-button-success-outline-text hover:bg-button-success-outline-hover-background",
      },

      // Icon Only sizes
      {
        iconOnly: true,
        size: "xs",
        className: "size-7 px-0",
      },
      {
        iconOnly: true,
        size: "sm",
        className: "size-8.5 px-0",
      },
      {
        iconOnly: true,
        size: "md",
        className: "size-10 px-0",
      },
      {
        iconOnly: true,
        size: "lg",
        className: "size-11 px-0",
      },
      {
        iconOnly: true,
        size: "xl",
        className: "size-12 px-0",
      },
      {
        iconOnly: true,
        size: "xxl",
        className: "size-14 px-0",
      },
    ],
    defaultVariants: {
      variant: "primary",
      appearance: "fill",
      iconOnly: false,
      size: "md",
    },
  },
);

export type ButtonProps = RACButtonProps & {
  variant?: "primary" | "danger" | "success" | "ghost";
  appearance?: "fill" | "outline" | "ghost";
  iconOnly?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
};

export function Button({
  variant,
  appearance,
  iconOnly,
  size,
  children,
  className,
  ...props
}: ButtonProps) {
  let normalizedVariant = variant;
  let normalizedAppearance = appearance ?? "fill";

  if (variant === "ghost") {
    normalizedVariant = "primary";
    normalizedAppearance = "ghost";
  }

  return (
    <RACButton
      className={composeRenderProps(className, (className) =>
        cn(
          buttonStyles({
            variant: normalizedVariant,
            appearance: normalizedAppearance,
            iconOnly,
            size,
          }),
          className,
        ),
      )}
      {...props}
    >
      {children}
    </RACButton>
  );
}
