"use client";

import { useState, type FormEvent } from "react";
import Swal from "sweetalert2";
import { z } from "zod";
import { useLocale } from "@/core/i18n/locale";
import { HOME_COPY } from "./GuestHomeV2";
import { GuestPublicFooter } from "./GuestPublicFooter";
import { GuestPublicNav } from "./GuestPublicNav";

const getContactSchema = (locale: string) => {
  if (locale === "ru") {
    return z.object({
      name: z.string().trim().min(2, "Минимум 2 символа"),
      email: z.string().trim().email("Неверный формат email"),
      message: z
        .string()
        .trim()
        .min(10, "Минимум 10 символов")
        .max(1000, "Максимум 1000 символов"),
    });
  }
  if (locale === "en") {
    return z.object({
      name: z.string().trim().min(2, "Min 2 characters"),
      email: z.string().trim().email("Invalid email address"),
      message: z
        .string()
        .trim()
        .min(10, "Min 10 characters")
        .max(1000, "Max 1000 characters"),
    });
  }
  return z.object({
    name: z.string().trim().min(2, "Tối thiểu 2 ký tự"),
    email: z.string().trim().email("Email không hợp lệ"),
    message: z
      .string()
      .trim()
      .min(10, "Tối thiểu 10 ký tự")
      .max(1000, "Tối đa 1000 ký tự"),
  });
};

export function GuestContactV2() {
  const { locale } = useLocale();
  const t = HOME_COPY[locale] ?? HOME_COPY.vi;
  const copy = t.contactSection;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const schema = getContactSchema(locale);
    const result = schema.safeParse({ name, email, message });

    if (!result.success) {
      const fieldErrors: {
        name?: string;
        email?: string;
        message?: string;
      } = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof typeof fieldErrors;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    // Step 1: Confirmation Modal
    const confirmResult = await Swal.fire({
      icon: "question",
      title:
        locale === "ru"
          ? "Подтвердить отправку?"
          : locale === "en"
            ? "Confirm Submission?"
            : "Xác nhận gửi liên hệ?",
      text:
        locale === "ru"
          ? "Вы хотите отправить обращение в Бан координации?"
          : locale === "en"
            ? "Do you want to submit this inquiry to the Coordination Board?"
            : "Bạn có chắc chắn muốn gửi thông tin liên hệ này?",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#94a3b8",
      confirmButtonText:
        locale === "ru"
          ? "Отправить"
          : locale === "en"
            ? "Send"
            : "Xác nhận gửi",
      cancelButtonText:
        locale === "ru" ? "Отмена" : locale === "en" ? "Cancel" : "Hủy",
      reverseButtons: true,
    });

    if (!confirmResult.isConfirmed) return;

    // Step 2: SweetAlert2 Loading Modal
    Swal.fire({
      title:
        locale === "ru"
          ? "Отправка сообщения..."
          : locale === "en"
            ? "Sending inquiry..."
            : "Đang gửi liên hệ...",
      text:
        locale === "ru"
          ? "Пожалуйста, подождите..."
          : locale === "en"
            ? "Please wait a moment..."
            : "Vui lòng chờ trong giây lát...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Simulate sending delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Step 3: SweetAlert2 Success Alert
    await Swal.fire({
      icon: "success",
      title:
        locale === "ru"
          ? "Успешно отправлено!"
          : locale === "en"
            ? "Inquiry Sent Successfully!"
            : "Gửi liên hệ thành công!",
      text:
        locale === "ru"
          ? "Мы получили ваше обращение и ответим в течение 1–2 рабочих дней."
          : locale === "en"
            ? "We have received your message and will respond within 1–2 business days."
            : "Chúng tôi đã tiếp nhận thông tin và sẽ phản hồi trong 01–02 ngày làm việc.",
      confirmButtonColor: "#2563eb",
      confirmButtonText:
        locale === "ru" ? "Закрыть" : locale === "en" ? "Close" : "Đóng",
    });

    // Reset Form
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#f0f4f9] text-slate-900 font-sans">
      <GuestPublicNav active="contact" />

      <main className="flex-1 px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-[1460px]">
          {/* Section Header */}
          <div className="mb-10 text-center sm:mb-12">
            <div className="inline-flex items-center gap-2.5">
              <span className="h-1 w-8 rounded-full bg-blue-600" />
              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                {copy.title}
              </h1>
              <span className="h-1 w-8 rounded-full bg-blue-600" />
            </div>
          </div>

          {/* 2-Column Grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column: Contact Information */}
            <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-white/95 p-7 shadow-xs sm:p-9">
              <div>
                {/* Card Header */}
                <div>
                  <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                    {copy.infoTitle}
                  </h2>
                  <div className="mt-1.5 h-0.5 w-8 rounded-full bg-blue-600" />
                </div>

                {/* Info Items List */}
                <div className="mt-6 flex flex-col justify-between gap-4.5 sm:gap-5">
                  <div className="flex items-start gap-4 rounded-xl bg-blue-50/60 p-4.5 sm:p-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600 sm:size-12">
                      <span className="material-symbols-outlined text-2xl">
                        groups
                      </span>
                    </span>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-wider text-slate-500 sm:text-[13px]">
                        {copy.coordinatorLabel}
                      </span>
                      <strong className="mt-1 block text-base font-bold text-slate-900 sm:text-lg">
                        {copy.coordinatorValue}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-xl bg-blue-50/60 p-4.5 sm:p-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600 sm:size-12">
                      <span className="material-symbols-outlined text-2xl">
                        pin_drop
                      </span>
                    </span>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-wider text-slate-500 sm:text-[13px]">
                        {copy.addressLabel}
                      </span>
                      <span className="mt-1 block text-sm font-semibold leading-relaxed text-slate-800 sm:text-base">
                        {copy.addressValue}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-xl bg-blue-50/60 p-4.5 sm:p-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600 sm:size-12">
                      <span className="material-symbols-outlined text-2xl">
                        mail
                      </span>
                    </span>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-wider text-slate-500 sm:text-[13px]">
                        {copy.supportLabel}
                      </span>
                      <a
                        href={`mailto:${copy.supportValue}`}
                        className="mt-1 block text-base font-bold text-blue-600 transition hover:text-blue-700 hover:underline sm:text-lg"
                      >
                        {copy.supportValue}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-white/95 p-7 shadow-xs sm:p-9">
              <div>
                {/* Card Header */}
                <div>
                  <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                    {copy.formTitle}
                  </h2>
                  <div className="mt-1.5 h-0.5 w-8 rounded-full bg-blue-600" />
                </div>

                {/* Form */}
                <form
                  noValidate
                  onSubmit={handleSubmit}
                  className="mt-6 flex flex-col justify-between gap-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-bold text-slate-800 sm:text-base">
                        {copy.nameLabel}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) {
                            setErrors((prev) => ({ ...prev, name: undefined }));
                          }
                        }}
                        placeholder={copy.namePlaceholder}
                        className={`mt-1.5 w-full rounded-xl border-2 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:bg-white ${
                          errors.name
                            ? "border-red-500 bg-red-50/20 focus:border-red-600"
                            : "border-slate-200 bg-slate-50/60 focus:border-blue-600"
                        }`}
                      />
                      {errors.name ? (
                        <p className="mt-1.5 truncate text-xs font-semibold text-red-600">
                          {errors.name}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-800 sm:text-base">
                        {copy.emailLabel}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) {
                            setErrors((prev) => ({ ...prev, email: undefined }));
                          }
                        }}
                        placeholder={copy.emailPlaceholder}
                        className={`mt-1.5 w-full rounded-xl border-2 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:bg-white ${
                          errors.email
                            ? "border-red-500 bg-red-50/20 focus:border-red-600"
                            : "border-slate-200 bg-slate-50/60 focus:border-blue-600"
                        }`}
                      />
                      {errors.email ? (
                        <p className="mt-1.5 truncate text-xs font-semibold text-red-600">
                          {errors.email}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-slate-800 sm:text-base">
                        {copy.messageLabel}
                      </label>
                      <span className="text-xs font-semibold text-slate-400">
                        {message.length}/1000
                      </span>
                    </div>
                    <textarea
                      rows={6}
                      maxLength={1000}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) {
                          setErrors((prev) => ({ ...prev, message: undefined }));
                        }
                      }}
                      placeholder={copy.messagePlaceholder}
                      className={`mt-1.5 min-h-[160px] w-full resize-y rounded-xl border-2 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:bg-white ${
                        errors.message
                          ? "border-red-500 bg-red-50/20 focus:border-red-600"
                          : "border-slate-200 bg-slate-50/60 focus:border-blue-600"
                      }`}
                    />
                    {errors.message ? (
                      <p className="mt-1.5 truncate text-xs font-semibold text-red-600">
                        {errors.message}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-base font-bold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.99] sm:py-4 sm:text-lg"
                  >
                    <span className="material-symbols-outlined text-2xl">
                      mail
                    </span>
                    <span>{copy.sendBtn}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <GuestPublicFooter copy={t} />
    </div>
  );
}
