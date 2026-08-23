"use client";

import { cn } from "@/lib/cn";
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  DialogTrigger as AriaDialogTrigger,
  type DialogTriggerProps as AriaDialogTriggerProps,
  Heading,
  type HeadingProps,
  Modal,
  ModalOverlay,
  type ModalOverlayProps,
} from "react-aria-components";
import { useLocale } from "@/app/HomeMotion";

export type SheetProps = AriaDialogTriggerProps;
export function Sheet(props: SheetProps) {
  return <AriaDialogTrigger {...props} />;
}

export interface SheetOverlayProps extends ModalOverlayProps {
  className?: string;
  isDismissable?: boolean;
}

export function SheetOverlay({ className, isDismissable = true, ...props }: SheetOverlayProps) {
  return (
    <ModalOverlay
      isDismissable={isDismissable}
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 data-entering:opacity-0 data-exiting:opacity-0",
        className
      )}
      {...props}
    />
  );
}

export interface SheetContentProps extends AriaDialogProps {
  side?: "left" | "right" | "top" | "bottom";
  showCloseButton?: boolean;
  className?: string;
}

export function SheetContent({
  children,
  className,
  side = "left",
  showCloseButton = false,
  ...props
}: SheetContentProps) {
  const { locale } = useLocale();
  return (
    <Modal
      className={cn(
        "fixed inset-y-0 z-50 h-full transition-transform duration-300 ease-out outline-none",
        side === "left" && "left-0 data-entering:-translate-x-full data-exiting:-translate-x-full",
        side === "right" && "right-0 data-entering:translate-x-full data-exiting:translate-x-full"
      )}
    >
      <AriaDialog
        className={cn(
          "relative flex h-full flex-col bg-card-surface-area p-0 shadow-2xl outline-none",
          className
        )}
        {...props}
      >
        {({ close }) => (
          <>
            {typeof children === "function" ? children({ close }) : children}
            {showCloseButton && (
              <AriaButton
                onPress={close}
                aria-label={locale === "en" ? "Close" : locale === "ru" ? "Закрыть" : "Đóng"}
                className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-xl text-text-tertiary transition hover:bg-background-gray-secondary hover:text-text-primary outline-none cursor-pointer"
              >
                ✕
              </AriaButton>
            )}
          </>
        )}
      </AriaDialog>
    </Modal>
  );
}

export function SheetTitle({ className, ...props }: HeadingProps) {
  return (
    <Heading
      slot="title"
      className={cn("text-lg font-bold text-text-primary", className)}
      {...props}
    />
  );
}
