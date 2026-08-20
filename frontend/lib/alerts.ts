import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

export interface ConfirmActionOptions {
  title: string;
  text?: string;
  html?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isDestructive?: boolean;
  icon?: "warning" | "info" | "question" | "error" | "success";
  darkTheme?: boolean;
}

export interface ToastOptions {
  title: string;
  icon?: "success" | "error" | "info" | "warning";
  duration?: number;
  position?: "top-end" | "top-start" | "bottom-end" | "bottom-start" | "top" | "center";
}

/**
 * Standard confirmation dialog styled with the RU–VN ProMax aesthetic.
 */
export async function confirmAction({
  title,
  text,
  html,
  confirmButtonText = "Xác nhận",
  cancelButtonText = "Hủy",
  isDestructive = false,
  icon = "warning",
  darkTheme = false,
}: ConfirmActionOptions): Promise<SweetAlertResult> {
  const options: SweetAlertOptions = {
    title,
    text,
    html,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
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
      actions: "flex gap-3 justify-end mt-4",
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
    confirmButtonText: "Đóng",
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
    confirmButtonText: "Đã hiểu",
    buttonsStyling: false,
    customClass: {
      popup: darkTheme ? "vnru-swal-popup-dark" : "vnru-swal-popup",
      title: "vnru-swal-title",
      htmlContainer: "vnru-swal-html",
      confirmButton: "vnru-swal-confirm-btn",
    },
  });
}
