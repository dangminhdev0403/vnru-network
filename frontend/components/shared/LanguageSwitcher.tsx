"use client";

import { useEffect, useRef, useState, useId } from "react";
import { useLocale, type Locale } from "@/core/i18n/locale";

export interface FlagProps {
  readonly className?: string;
}

export function FlagVN({ className = "w-5 h-3.5" }: FlagProps) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={`shrink-0 rounded-[3px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] ${className}`}
      aria-hidden="true"
    >
      <rect width="30" height="20" fill="#DA251D" />
      <polygon
        points="15,4 16.5,8.8 21.5,8.8 17.5,11.8 19,16.5 15,13.5 11,16.5 12.5,11.8 8.5,8.8 13.5,8.8"
        fill="#FFFF00"
      />
    </svg>
  );
}

export function FlagRU({ className = "w-5 h-3.5" }: FlagProps) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={`shrink-0 rounded-[3px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] ${className}`}
      aria-hidden="true"
    >
      <rect width="30" height="6.67" y="0" fill="#FFFFFF" />
      <rect width="30" height="6.67" y="6.67" fill="#0039A6" />
      <rect width="30" height="6.67" y="13.33" fill="#D52B1E" />
    </svg>
  );
}

export function FlagGB({ className = "w-5 h-3.5" }: FlagProps) {
  const clipId = useId();
  return (
    <svg
      viewBox="0 0 60 40"
      className={`shrink-0 rounded-[3px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] ${className}`}
      aria-hidden="true"
    >
      <clipPath id={clipId}>
        <rect width="60" height="40" rx="3" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <rect width="60" height="40" fill="#012169" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFFFFF" strokeWidth="8" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 V40 M0,20 H60" stroke="#FFFFFF" strokeWidth="12" />
        <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

export interface LanguageOption {
  readonly code: Locale;
  readonly label: string;
  readonly shortCode: string;
  readonly nativeLabel: string;
  readonly FlagComponent: typeof FlagVN;
}

export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  {
    code: "vi",
    label: "Tiếng Việt",
    shortCode: "VI",
    nativeLabel: "Tiếng Việt",
    FlagComponent: FlagVN,
  },
  {
    code: "ru",
    label: "Русский",
    shortCode: "RU",
    nativeLabel: "Русский",
    FlagComponent: FlagRU,
  },
  {
    code: "en",
    label: "English",
    shortCode: "EN",
    nativeLabel: "English",
    FlagComponent: FlagGB,
  },
];

export type LanguageSwitcherVariant = "light" | "dark" | "workspace" | "transparent";

export interface LanguageSwitcherProps {
  readonly variant?: LanguageSwitcherVariant;
  readonly className?: string;
  readonly align?: "left" | "right";
  readonly showShortCodeMobile?: boolean;
}

export function LanguageSwitcher({
  variant = "light",
  className = "",
  align = "right",
  showShortCodeMobile = true,
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  const currentOption =
    LANGUAGE_OPTIONS.find((opt) => opt.code === locale) || LANGUAGE_OPTIONS[0];
  const CurrentFlag = currentOption.FlagComponent;

  // Handle outside click & escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectLanguage = (code: Locale) => {
    setLocale(code);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  // Variant-specific styling rules
  const getTriggerStyles = () => {
    switch (variant) {
      case "dark":
        return "h-10 px-3 gap-2 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/15 hover:border-white/30 focus-visible:ring-2 focus-visible:ring-sky-400/40 backdrop-blur-md";
      case "workspace":
        return "h-10 px-3 gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-text-primary hover:bg-[var(--surface-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/30";
      case "transparent":
        return "h-10 px-3 gap-2 rounded-xl border border-transparent hover:border-slate-200 bg-transparent hover:bg-white/80 text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500/20";
      case "light":
      default:
        return "h-10 px-3 gap-2 rounded-xl border border-blue-200/80 bg-white/90 text-slate-800 hover:bg-white hover:border-blue-300 shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-500/30";
    }
  };

  const getMenuStyles = () => {
    switch (variant) {
      case "dark":
        return "border border-white/15 bg-[#0b1c36]/98 text-white shadow-2xl shadow-black/50 backdrop-blur-xl";
      case "workspace":
        return "border border-[var(--border)] bg-[var(--surface-raised)] text-text-primary shadow-[var(--shadow-soft)]";
      case "transparent":
      case "light":
      default:
        return "border border-slate-200 bg-white/98 text-slate-900 shadow-xl shadow-slate-900/10 backdrop-blur-xl";
    }
  };

  const getItemStyles = (isSelected: boolean) => {
    switch (variant) {
      case "dark":
        return isSelected
          ? "bg-blue-600/30 text-sky-300 font-bold border border-blue-400/30"
          : "text-slate-200 hover:bg-white/10 hover:text-white border border-transparent";
      case "workspace":
        return isSelected
          ? "bg-[var(--surface-secondary)] text-[var(--accent-primary)] font-bold"
          : "text-text-secondary hover:bg-[var(--surface-secondary)] hover:text-text-primary";
      case "transparent":
      case "light":
      default:
        return isSelected
          ? "bg-blue-50 text-blue-700 font-bold border border-blue-100"
          : "text-slate-700 hover:bg-slate-50 hover:text-slate-950 border border-transparent";
    }
  };

  const getBadgeStyles = (isSelected: boolean) => {
    switch (variant) {
      case "dark":
        return isSelected
          ? "bg-sky-400/20 text-sky-200 border-sky-400/30"
          : "bg-white/10 text-slate-300 border-white/10";
      case "workspace":
        return isSelected
          ? "bg-[var(--surface)] text-[var(--accent-primary)] border-[var(--border)]"
          : "bg-[var(--surface-secondary)] text-text-tertiary border-[var(--border)]";
      case "transparent":
      case "light":
      default:
        return isSelected
          ? "bg-blue-100/80 text-blue-800 border-blue-200"
          : "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={`Ngôn ngữ hiện tại: ${currentOption.label}. Nhấn để đổi ngôn ngữ.`}
        className={`inline-flex items-center justify-between text-xs sm:text-sm font-bold transition-all duration-150 outline-none cursor-pointer select-none ${getTriggerStyles()}`}
      >
        <div className="flex items-center gap-2">
          <CurrentFlag className="w-[19px] h-[13px]" />
          <span className={showShortCodeMobile ? "hidden sm:inline" : "inline"}>
            {currentOption.label}
          </span>
          {showShortCodeMobile && (
            <span className="sm:hidden uppercase tracking-wider font-extrabold">
              {currentOption.shortCode}
            </span>
          )}
        </div>

        {/* Chevron Indicator */}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 opacity-70 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Chọn ngôn ngữ"
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-48 sm:w-52 rounded-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 ${getMenuStyles()}`}
        >
          <div className="space-y-1">
            {LANGUAGE_OPTIONS.map((option) => {
              const isSelected = option.code === locale;
              const Flag = option.FlagComponent;

              return (
                <button
                  key={option.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectLanguage(option.code)}
                  className={`flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm transition-all duration-100 cursor-pointer ${getItemStyles(
                    isSelected,
                  )}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Flag className="w-[20px] h-[14px]" />
                    <span className="font-semibold">{option.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${getBadgeStyles(
                        isSelected,
                      )}`}
                    >
                      {option.shortCode}
                    </span>
                    {isSelected && (
                      <svg
                        className="w-4 h-4 shrink-0 text-current"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3.5 8.5l3 3 6-6" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
