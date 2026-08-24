import { cn } from "@/lib/cn";

type BrandMarkProps = { className?: string };

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <span aria-hidden="true" className={cn("vnru-brand-mark inline-grid shrink-0 place-items-center overflow-hidden rounded-[28%] bg-white", className)}>
      <svg viewBox="0 0 100 64" className="h-full w-full" focusable="false">
        <defs>
          <linearGradient id="vnru-russia" x1="48" y1="14" x2="91" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" /><stop offset=".42" stopColor="#2563eb" /><stop offset=".72" stopColor="#0753c7" /><stop offset="1" stopColor="#ef3340" />
          </linearGradient>
          <linearGradient id="vnru-vietnam" x1="8" y1="16" x2="51" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff2d20" /><stop offset="1" stopColor="#c8102e" />
          </linearGradient>
        </defs>
        <path d="M8 32C19 9 39 9 50 32C39 55 19 55 8 32Z" fill="none" stroke="url(#vnru-vietnam)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 32C61 9 81 9 92 32C81 55 61 55 50 32Z" fill="none" stroke="url(#vnru-russia)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M45 22C47 25 49 28 50 32C51 36 53 39 55 42" fill="none" stroke="#e8f1ff" strokeWidth="13" strokeLinecap="round" />
        <path d="m25 25 2.1 4.4 4.9.7-3.5 3.4.8 4.8-4.3-2.3-4.3 2.3.8-4.8-3.5-3.4 4.9-.7Z" fill="#ffde00" />
      </svg>
    </span>
  );
}
