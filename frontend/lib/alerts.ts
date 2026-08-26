import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

export interface ConfirmActionOptions {
  title?: string;
  text?: string;
  html?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isDestructive?: boolean;
  icon?: "warning" | "info" | "question" | "error" | "success";
  darkTheme?: boolean;
}

const alertCopy = {
  vi: {
    confirm: "Xác nhận",
    cancel: "Hủy",
    close: "Đóng",
    understood: "Đã hiểu",
    action: "Xác nhận thao tác?",
  },
  en: {
    confirm: "Confirm",
    cancel: "Cancel",
    close: "Close",
    understood: "Understood",
    action: "Confirm this action?",
  },
  ru: {
    confirm: "Подтвердить",
    cancel: "Отмена",
    close: "Закрыть",
    understood: "Понятно",
    action: "Подтвердить действие?",
  },
} as const;

function currentAlertCopy() {
  if (typeof document === "undefined") return alertCopy.vi;
  const locale = document.cookie.match(
    /(?:^|; )vnru_locale=(vi|en|ru)(?:;|$)/,
  )?.[1] as keyof typeof alertCopy | undefined;
  return alertCopy[locale ?? "vi"];
}

export interface ToastOptions {
  title: string;
  icon?: "success" | "error" | "info" | "warning";
  duration?: number;
  position?:
    | "top-end"
    | "top-start"
    | "bottom-end"
    | "bottom-start"
    | "top"
    | "center";
}

/**
 * Standard confirmation dialog styled with the RU–VN ProMax aesthetic.
 */
export async function confirmAction({
  title,
  text,
  html,
  confirmButtonText,
  cancelButtonText,
  isDestructive = false,
  icon = "warning",
  darkTheme = false,
}: ConfirmActionOptions): Promise<SweetAlertResult> {
  const copy = currentAlertCopy();
  const options: SweetAlertOptions = {
    title: title ?? copy.action,
    text,
    html,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmButtonText ?? copy.confirm,
    cancelButtonText: cancelButtonText ?? copy.cancel,
    focusCancel: true,
    buttonsStyling: false,
    customClass: {
      popup: darkTheme ? "vnru-swal-popup-dark" : "vnru-swal-popup",
      title: "vnru-swal-title",
      htmlContainer: "vnru-swal-html",
      confirmButton: isDestructive
        ? "vnru-swal-confirm-btn vnru-swal-danger-btn"
        : "vnru-swal-confirm-btn",
      cancelButton: "vnru-swal-cancel-btn",
      actions: "flex gap-3.5 justify-center w-full mt-6",
    },
    showClass: {
      popup: "animate-scale-in",
    },
    hideClass: {
      popup: "animate-fade-in",
    },
  };

  return Swal.fire(options);
}

export async function confirmAndRun<T>(
  action: () => Promise<T>,
  options: ConfirmActionOptions = {},
): Promise<boolean> {
  const confirmation = await confirmAction(options);
  if (!confirmation.isConfirmed) return false;
  await action();
  return true;
}

/**
 * Quick toast notification in the corner of the screen.
 */
export function showToast({
  title,
  icon = "success",
  duration = 3000,
  position = "top-end",
}: ToastOptions) {
  const Toast = Swal.mixin({
    toast: true,
    position,
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
    customClass: {
      popup: "vnru-swal-toast",
    },
  });

  return Toast.fire({
    icon,
    title,
  });
}

/**
 * Modal showing a successful action.
 */
export function showSuccess(title: string, text?: string, darkTheme = false) {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: currentAlertCopy().close,
    buttonsStyling: false,
    customClass: {
      popup: darkTheme ? "vnru-swal-popup-dark" : "vnru-swal-popup",
      title: "vnru-swal-title",
      htmlContainer: "vnru-swal-html",
      confirmButton: "vnru-swal-confirm-btn",
    },
  });
}

/**
 * Modal showing an error with recovery guidance.
 */
export function showError(title: string, text?: string, darkTheme = false) {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: currentAlertCopy().understood,
    buttonsStyling: false,
    customClass: {
      popup: darkTheme ? "vnru-swal-popup-dark" : "vnru-swal-popup",
      title: "vnru-swal-title",
      htmlContainer: "vnru-swal-html",
      confirmButton: "vnru-swal-confirm-btn",
    },
  });
}
