"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/core/i18n/locale";
import { GuestPublicFooter } from "@/features/public-v2/components/GuestPublicFooter";
import { HOME_COPY } from "@/features/public-v2/components/GuestHomeV2";
import { GuestPublicNav } from "@/features/public-v2/components/GuestPublicNav";

export default function NewsLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { locale } = useLocale();

  return (
    <>
      <GuestPublicNav active="news" />
      {children}
      <GuestPublicFooter copy={HOME_COPY[locale]} />
    </>
  );
}
