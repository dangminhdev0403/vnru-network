const copy = {
  vi: { status: "Không khả dụng", detail: "Auth.js Credentials hiện chỉ hỗ trợ xác thực bằng tài khoản và mật khẩu." },
  en: { status: "Unavailable", detail: "Auth.js Credentials currently supports account and password authentication only." },
  ru: { status: "Недоступно", detail: "Auth.js Credentials сейчас поддерживает только вход по имени пользователя и паролю." },
};

export default function MfaControl({ locale }: { locale: "vi" | "en" | "ru" }) {
  const t = copy[locale];
  return (
    <div className="max-w-sm text-right">
      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{t.status}</span>
      <p className="mt-2 text-sm leading-5 text-slate-500 dark:text-slate-400">{t.detail}</p>
    </div>
  );
}
