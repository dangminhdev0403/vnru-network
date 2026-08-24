import { cn } from "@/lib/cn";

type BrandMarkProps = { className?: string };

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <span aria-hidden="true" className={cn("vnru-brand-mark inline-grid shrink-0 place-items-center overflow-hidden rounded-[24%] bg-[#071a33]", className)}>
      <svg viewBox="0 0 96 72" className="h-full w-full" focusable="false">
        <defs>
          <linearGradient id="vnru-red" x1="12" y1="20" x2="50" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f43f4e" /><stop offset="1" stopColor="#c8102e" />
          </linearGradient>
          <linearGradient id="vnru-blue" x1="48" y1="18" x2="85" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60a5fa" /><stop offset="1" stopColor="#155bd7" />
          </linearGradient>
        </defs>
        <rect x=".75" y=".75" width="94.5" height="70.5" rx="17" fill="#071a33" stroke="#ffffff" strokeOpacity=".16" strokeWidth="1.5" />
        <path d="M13 36c9-18 24-21 35 0 11 21 26 18 35 0" fill="none" stroke="url(#vnru-red)" strokeWidth="13" strokeLinecap="round" />
        <path d="M13 36c9 18 24 21 35 0 11-21 26-18 35 0" fill="none" stroke="#f8fafc" strokeWidth="14" strokeLinecap="round" />
        <path d="M48 36c11-21 26-18 35 0" fill="none" stroke="url(#vnru-blue)" strokeWidth="9" strokeLinecap="round" />
        <path d="M48 36c11 21 26 18 35 0" fill="none" stroke="#ef3340" strokeWidth="5" strokeLinecap="round" />
        <path d="M43 27c2 2.6 3.7 5.5 5 9" fill="none" stroke="#f8fafc" strokeWidth="14" strokeLinecap="round" />
        <path d="m25 27.5 1.65 3.35 3.7.54-2.68 2.61.63 3.69-3.3-1.74-3.3 1.74.63-3.69-2.68-2.61 3.7-.54Z" fill="#ffde00" />
      </svg>
    </span>
  );
}
