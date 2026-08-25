"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useLogout } from "@/features/auth/server-state";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import translations from "../i18n/translations.json";
import { confirmAction } from "@/lib/alerts";

const HERO_STATIC_TITLE: Record<Locale, string> = {
  vi: "Mạng lưới Trí thức Khoa học - Công nghệ Nga - Việt",
  ru: "РОССИЙСКО-ВЬЕТНАМСКАЯ ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ",
  en: "Russia-Vietnam Science-Technology Intelligence Network",
};

const HERO_FADE_DURATION_MS = 650;
const HERO_TYPING_DELAY_MS = HERO_FADE_DURATION_MS + 100;
const HERO_TYPING_STEP_MS = 55;

const HERO_DYNAMIC_PHRASES: Record<Locale, string[]> = {
  vi: [
    "với bản đồ kết nối sống động.",
    "kết nối nghiên cứu và ứng dụng.",
    "cầu nối chuyên gia và công bố.",
    "thúc đẩy hợp tác thực chất 2+2.",
  ],
  ru: [
    "с интерактивной картой связей.",
    "связь науки и прикладных задач.",
    "мост между экспертами и наукой.",
    "развивая сотрудничество 2+2.",
  ],
  en: [
    "with dynamic knowledge mapping.",
    "bridging research and application.",
    "connecting experts and publications.",
    "fostering impactful 2+2 partnerships.",
  ],
};

function useHeroTyping(locale: Locale, reduceMotion: boolean | null) {
  const phrase = (HERO_DYNAMIC_PHRASES[locale] || HERO_DYNAMIC_PHRASES.vi)[0];
  const [text, setText] = useState("");

  useEffect(() => {
    if (reduceMotion) return;

    const characters = [
      ...new Intl.Segmenter(locale, { granularity: "grapheme" }).segment(
        phrase,
      ),
    ].map(({ segment }) => segment);
    let index = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const reset = setTimeout(() => setText(""), 0);
    const delay = setTimeout(() => {
      interval = setInterval(() => {
        index += 1;
        setText(characters.slice(0, index).join(""));
        if (index === characters.length) clearInterval(interval);
      }, HERO_TYPING_STEP_MS);
    }, HERO_TYPING_DELAY_MS);

    return () => {
      clearTimeout(reset);
      clearTimeout(delay);
      if (interval) clearInterval(interval);
    };
  }, [locale, phrase, reduceMotion]);

  return reduceMotion ? phrase : text;
}

export function PublicHome({
  isAuthenticated,
  workspaceHref,
}: Readonly<{ isAuthenticated: boolean; workspaceHref: string }>) {
  const { locale, setLocale } = useLocale();
  const shouldReduceMotion = useReducedMotion();
  const [loggingOut, setLoggingOut] = useState(false);
  const logout = useLogout();
  const staticTitle = HERO_STATIC_TITLE[locale] || HERO_STATIC_TITLE.vi;
  const dynamicText = useHeroTyping(locale, shouldReduceMotion);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const syncLocale = () => {
      const value = document.cookie.match(
        /(?:^|; )vnru_locale=(vi|en|ru)(?:;|$)/,
      )?.[1] as Locale | undefined;
      if (value) setLocale(value);
    };
    syncLocale();
    addEventListener("pageshow", syncLocale);
    return () => removeEventListener("pageshow", syncLocale);
  }, [setLocale]);

  const t = (key: string): string => {
    const dict =
      (translations as Record<Locale, Record<string, string>>)[locale] ||
      translations.vi;
    return dict[key] || (translations.vi as Record<string, string>)[key] || key;
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loggingOut) return;
    if (!(await confirmAction({ title: "Xác nhận đăng xuất?" })).isConfirmed)
      return;
    setLoggingOut(true);
    try {
      const { logoutUrl } = await logout.mutateAsync();
      // Auth logout uses full-page navigation to clear both frontend and backend sessions.
      window.location.assign(logoutUrl || "/");
    } catch {
      window.location.replace("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#06152f] text-white font-sans selection:bg-blue-600 selection:text-white">
      {/* ─── Top Navigation Bar ─── */}
      <header className="sticky top-0 z-50 bg-[#06152f]/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center gap-2 px-3 sm:gap-4 sm:px-6 lg:gap-6">
          <Link
            href="#top"
            className="flex min-w-0 shrink items-center gap-3"
            aria-label={t(
              "Russia-Vietnam Science-Technology Intelligence Network",
            )}
          >
            <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/20 bg-white shadow-md">
              <span className="absolute inset-y-0 left-0 w-[64%] -skew-x-12 bg-[#1d4ed8]" />
              <span className="absolute inset-y-0 right-0 w-[48%] -skew-x-12 bg-error" />
            </span>
            <span className="hidden leading-tight sm:block">
              <strong className="block whitespace-nowrap text-base font-bold tracking-tight text-white">
                {t("VN–RU Network")}
              </strong>
              <small className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                {t("Science · Technology · Cooperation")}
              </small>
            </span>
          </Link>

          <nav
            className="ml-auto hidden shrink-0 items-center gap-6 whitespace-nowrap text-sm font-semibold text-white/90 lg:flex"
            aria-label={t("Menu chính")}
          >
            <a href="#network" className="transition hover:text-white">
              {t("Mạng lưới tri thức")}
            </a>
            <a href="#modules" className="transition hover:text-white">
              {t("Năng lực")}
            </a>
            <a href="#knowledge" className="transition hover:text-white">
              {t("Kho tri thức")}
            </a>
            <a href="#cooperation" className="transition hover:text-white">
              {t("Hợp tác 2+2")}
            </a>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 lg:ml-0">
            <LanguageSwitcher variant="dark" />

            {/* Auth Button */}
            {isAuthenticated ? (
              <>
                <Link
                  href={workspaceHref}
                  className="inline-flex h-9 items-center rounded-lg bg-[#1d4ed8] px-3 text-xs font-bold text-white shadow-md transition hover:bg-[#1e40af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#55bfea] sm:px-4"
                >
                  <span className="sm:hidden">{t("Workspace")}</span>
                  <span className="hidden sm:inline">
                    {t("Vào không gian làm việc")}
                  </span>
                </Link>
                <a
                  href="#logout"
                  onClick={handleLogout}
                  className="inline-flex h-9 items-center rounded-lg border border-white/20 bg-white/10 px-2.5 text-xs font-bold text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#55bfea] sm:px-4"
                >
                  <span className="sm:hidden">{t("Thoát")}</span>
                  <span className="hidden sm:inline">{t("Đăng xuất")}</span>
                </a>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-9 items-center rounded-lg bg-[#1d4ed8] px-3 text-xs font-bold text-white shadow-md transition hover:bg-[#1e40af] sm:px-4"
              >
                {t("Đăng nhập →")}
              </Link>
            )}
          </div>
        </div>
      </header>

      <main id="top">
        {/* ─── Hero Section ─── */}
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          {/* Hero SVG Map Background */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 1600 900"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <linearGradient id="heroBridge" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#2563eb" />
                  <stop offset="1" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              <g className="opacity-40">
                <path
                  d="M0 740 H1600"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
                <path
                  d="M0 120 H1600"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
                <path
                  d="M220 0 V900"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
                <path
                  d="M1180 0 V900"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
              </g>
              <path
                className="fill-white/[0.02] stroke-white/[0.12] stroke-[1.5]"
                fillRule="evenodd"
                d="M679.6,228.0 L666.4,232.7 L663.6,235.5 L663.6,240.2 L658.0,243.9 L656.1,243.0 L649.6,246.7 L644.0,243.9 L634.6,251.4 L626.2,245.8 L622.4,247.7 L617.8,244.9 L615.9,248.6 L607.5,255.1 L602.8,253.3 L599.0,248.6 L591.6,245.8 L588.7,249.5 L585.0,251.4 L585.0,263.6 L591.6,268.3 L597.2,278.6 L601.9,276.7 L606.5,279.5 L606.5,283.2 L602.8,293.5 L611.2,305.7 L615.9,308.5 L620.6,308.5 L627.1,311.3 L629.9,307.6 L642.1,303.8 L650.5,308.5 L655.2,313.2 L655.2,316.9 L648.7,321.6 L656.1,324.4 L658.0,328.2 L664.6,331.0 L666.4,332.9 L666.4,336.6 L662.7,339.4 L662.7,342.2 L653.3,349.7 L647.7,347.8 L641.2,347.8 L639.3,349.7 L638.4,355.3 L634.6,359.1 L645.9,364.7 L658.0,374.0 L671.1,379.7 L670.2,387.1 L673.0,392.8 L684.2,401.2 L688.9,412.4 L703.0,426.5 L705.8,427.4 L710.4,433.0 L715.1,435.8 L715.1,446.1 L718.9,453.6 L725.4,455.5 L729.2,459.2 L731.0,458.3 L736.7,462.0 L736.7,464.9 L742.3,468.6 L742.3,473.3 L736.7,477.0 L736.7,479.8 L740.4,485.4 L748.8,490.1 L747.9,501.4 L744.1,504.2 L746.0,506.0 L746.0,517.3 L741.3,524.8 L739.5,534.1 L743.2,536.9 L743.2,542.6 L747.0,546.3 L748.8,553.8 L748.8,558.5 L744.1,565.0 L744.1,570.6 L746.0,572.5 L746.0,586.6 L739.5,591.2 L735.7,590.3 L725.4,597.8 L720.7,597.8 L715.1,601.5 L711.4,601.5 L709.5,604.3 L709.5,608.1 L704.8,610.9 L701.1,609.0 L695.5,609.0 L690.8,612.8 L690.8,621.2 L694.5,625.9 L701.1,630.6 L700.1,639.0 L693.6,640.9 L688.9,638.0 L687.0,632.4 L675.8,635.2 L671.1,638.0 L667.4,637.1 L666.4,640.9 L661.8,643.7 L659.0,647.4 L655.2,649.3 L649.6,648.3 L644.9,652.1 L648.7,654.9 L649.6,659.6 L652.4,657.7 L656.1,659.6 L658.0,662.4 L659.0,661.4 L663.6,664.3 L663.6,668.0 L657.1,672.7 L656.1,688.6 L658.0,690.5 L658.0,695.1 L656.1,697.0 L655.2,701.7 L657.1,705.4 L657.1,709.2 L655.2,711.1 L656.1,712.0 L663.6,710.1 L669.3,705.4 L675.8,695.1 L686.1,690.5 L697.3,687.7 L700.1,682.0 L704.8,679.2 L710.4,680.2 L712.3,677.4 L712.3,671.7 L715.1,669.9 L715.1,661.4 L719.8,651.1 L725.4,648.3 L730.1,651.1 L732.9,651.1 L754.4,641.8 L758.2,641.8 L761.9,636.2 L767.6,633.4 L768.5,634.3 L775.0,627.7 L781.6,625.9 L784.4,622.1 L788.1,620.3 L791.0,621.2 L791.9,615.6 L798.4,609.0 L799.4,601.5 L795.6,598.7 L795.6,595.0 L797.5,593.1 L797.5,587.5 L800.3,585.6 L799.4,579.1 L804.1,576.3 L803.1,571.6 L805.0,569.7 L801.3,564.1 L797.5,545.4 L797.5,536.9 L799.4,535.1 L796.6,532.3 L797.5,525.7 L793.8,520.1 L793.8,513.5 L788.1,504.2 L787.2,493.9 L780.7,491.1 L776.9,486.4 L776.9,483.6 L769.4,472.3 L770.4,466.7 L762.9,464.9 L760.1,461.1 L757.3,462.0 L753.5,460.2 L751.6,456.4 L743.2,450.8 L742.3,447.1 L735.7,442.4 L726.4,433.0 L726.4,431.1 L717.9,423.7 L711.4,413.4 L711.4,403.1 L695.5,390.9 L688.9,380.6 L688.0,375.9 L685.2,373.1 L685.2,366.6 L689.9,360.9 L690.8,350.6 L694.5,341.3 L700.1,337.5 L703.0,337.5 L706.7,333.8 L708.6,329.1 L715.1,325.4 L715.1,317.9 L720.7,313.2 L719.8,305.7 L724.5,302.9 L727.3,304.8 L731.0,302.9 L734.8,304.8 L737.6,303.8 L740.4,300.1 L740.4,294.5 L744.1,292.6 L745.1,293.5 L748.8,289.8 L757.3,286.0 L755.4,284.2 L745.1,286.0 L732.0,279.5 L719.8,270.1 L719.8,262.6 L716.1,259.8 L716.1,253.3 L717.9,251.4 L717.9,248.6 L722.6,245.8 L717.0,242.0 L711.4,243.9 L704.8,239.2 L700.1,239.2 L696.4,241.1 L685.2,234.6 L683.3,230.8 Z M632.7,654.0 L629.9,655.8 L633.7,660.5 L634.6,655.8 Z"
              />
              <path
                className="fill-white/[0.02] stroke-error/[0.18] stroke-[1.5]"
                fillRule="evenodd"
                d="M1440.6,260.7 L1445.0,259.3 L1445.0,261.7 L1441.2,261.8 L1440.6,260.7 Z M991.9,346.2 L990.3,348.3 L987.0,348.9 L983.5,352.4 L986.7,355.7 L986.3,358.1 L990.1,362.1 L990.1,362.1 L988.1,363.5 L987.5,364.4 L985.9,364.2 L983.6,362.1 L982.6,361.9 L980.4,361.1 L979.3,359.7 L976.1,359.0 L974.0,359.5 L973.4,358.9 L968.7,357.2 L963.6,356.7 L960.7,356.1 L960.3,356.5 L955.8,353.6 L951.9,352.3 L948.9,350.2 L951.4,349.7 L954.3,346.8 L952.4,345.4 L957.5,344.0 L957.4,343.2 L954.3,343.8 L954.4,342.3 L956.2,341.3 L959.5,341.0 L960.0,339.9 L959.3,338.0 L960.7,336.2 L960.6,335.2 L955.5,334.0 L953.5,334.1 L951.4,332.4 L948.7,333.0 L944.3,331.8 L944.4,331.1 L943.2,329.6 L940.4,329.4 L940.1,328.4 L941.0,327.7 L938.8,325.7 L935.2,326.0 L934.1,325.9 L933.3,326.6 L932.0,326.5 L932.0,326.5 L931.1,324.3 L930.3,323.1 L931.0,322.8 L933.8,322.9 L935.1,322.2 L934.1,321.2 L931.8,320.6 L932.0,320.0 L930.6,319.4 L928.4,317.1 L929.2,316.2 L928.8,314.6 L925.4,313.7 L923.6,314.1 L923.1,313.3 L919.5,312.4 L918.4,310.4 L918.1,308.7 L916.4,307.9 L917.9,306.8 L916.9,303.6 L919.3,301.6 L918.8,301.0 L918.8,301.0 L922.7,299.1 L919.1,297.4 L919.1,297.4 L926.5,293.0 L929.7,291.0 L931.0,289.2 L925.9,286.9 L927.3,284.6 L924.2,282.0 L926.5,279.1 L922.5,275.1 L925.7,272.5 L920.4,270.2 L920.9,267.8 L923.7,267.5 L929.6,266.1 L929.6,266.1 L933.2,264.9 L938.9,267.0 L948.3,267.8 L961.4,271.7 L964.1,273.3 L964.3,275.6 L960.5,277.5 L954.8,278.4 L939.4,275.8 L936.8,276.2 L942.5,278.7 L942.7,280.3 L942.9,283.9 L947.4,284.9 L950.1,285.8 L950.5,284.2 L948.4,282.7 L950.6,281.4 L959.0,283.5 L961.9,282.7 L959.6,280.1 L967.7,276.7 L970.8,276.9 L974.1,278.1 L976.1,275.8 L973.2,273.7 L974.9,271.6 L972.4,269.5 L982.0,270.6 L984.0,272.5 L979.6,273.0 L979.7,274.9 L982.4,276.1 L987.7,275.3 L988.6,273.1 L995.8,271.5 L1007.9,268.5 L1010.5,268.7 L1007.1,270.8 L1011.4,271.1 L1013.9,269.9 L1020.4,269.8 L1025.5,268.4 L1029.4,270.5 L1033.4,268.2 L1029.7,266.2 L1031.5,265.1 L1041.8,266.1 L1046.6,267.2 L1059.1,271.1 L1061.4,269.3 L1057.9,267.5 L1057.8,266.8 L1053.6,266.4 L1054.8,264.8 L1052.9,262.1 L1052.8,261.0 L1059.2,257.8 L1061.5,254.7 L1064.0,254.0 L1073.2,254.9 L1073.9,256.9 L1070.7,259.7 L1072.8,260.8 L1073.9,263.2 L1073.1,267.9 L1077.0,270.1 L1075.5,272.4 L1068.7,277.3 L1072.6,277.8 L1074.0,276.5 L1077.8,275.7 L1078.7,273.9 L1081.7,272.3 L1079.7,270.3 L1081.3,268.0 L1077.6,267.8 L1076.7,265.8 L1079.5,262.4 L1075.0,259.5 L1081.2,257.2 L1080.4,254.7 L1082.1,254.7 L1083.9,256.6 L1082.6,259.9 L1086.3,260.5 L1084.7,258.1 L1090.5,256.7 L1097.7,256.5 L1104.1,258.5 L1101.0,255.6 L1100.6,251.9 L1106.7,251.2 L1115.0,251.4 L1122.5,250.9 L1119.7,249.1 L1123.7,246.8 L1127.7,246.7 L1134.4,245.0 L1143.5,244.6 L1144.7,243.6 L1153.8,243.3 L1156.6,244.1 L1164.4,242.2 L1170.7,242.3 L1171.7,240.8 L1175.0,239.3 L1183.2,237.9 L1189.1,239.0 L1184.4,239.9 L1192.2,240.4 L1193.2,242.1 L1196.3,241.3 L1206.5,241.3 L1214.3,243.0 L1217.0,244.3 L1216.2,246.1 L1212.3,247.1 L1203.2,249.0 L1200.6,250.1 L1204.9,250.6 L1210.1,251.4 L1213.2,250.8 L1214.9,253.0 L1216.5,252.1 L1222.0,251.5 L1233.1,252.1 L1233.9,253.7 L1248.4,254.3 L1248.6,251.6 L1256.0,252.2 L1261.5,252.2 L1267.1,254.0 L1268.7,256.2 L1266.6,257.7 L1271.0,260.4 L1276.4,261.8 L1279.8,258.2 L1285.3,259.7 L1291.2,258.8 L1297.9,259.9 L1300.5,258.9 L1306.1,259.4 L1303.6,256.2 L1308.2,254.7 L1339.5,256.9 L1342.4,259.0 L1351.5,261.6 L1365.4,261.0 L1372.3,261.5 L1375.2,263.0 L1374.8,265.5 L1379.1,266.5 L1383.7,265.8 L1389.8,265.7 L1396.4,266.4 L1402.9,266.0 L1409.0,269.1 L1413.2,268.0 L1410.4,265.7 L1412.0,264.2 L1423.0,265.2 L1430.2,265.0 L1440.2,266.6 L1445.0,268.1 L1445.0,281.9 L1445.0,281.9 L1440.6,283.5 L1436.1,283.2 L1439.2,285.0 L1441.3,287.9 L1442.9,288.8 L1443.3,290.3 L1442.4,291.2 L1435.9,290.4 L1426.2,293.0 L1423.2,293.4 L1417.9,295.9 L1412.8,298.0 L1411.6,299.6 L1406.6,297.2 L1397.6,299.9 L1396.0,298.6 L1392.7,300.1 L1388.1,299.6 L1386.9,301.9 L1382.8,305.2 L1382.9,306.6 L1386.9,307.4 L1386.4,312.5 L1383.2,312.6 L1381.7,315.5 L1383.1,317.0 L1377.1,318.7 L1375.9,322.7 L1370.7,323.5 L1369.7,327.0 L1364.7,330.3 L1363.4,327.9 L1361.9,322.8 L1360.0,315.1 L1361.7,310.3 L1364.6,308.3 L1364.8,306.7 L1370.1,305.9 L1376.3,301.5 L1382.3,298.0 L1388.5,295.2 L1391.3,290.3 L1387.1,290.6 L1385.0,293.5 L1376.2,297.3 L1373.4,293.0 L1364.5,294.2 L1355.8,300.0 L1358.6,302.1 L1350.9,303.0 L1345.6,303.4 L1345.8,300.9 L1340.4,300.3 L1336.1,302.0 L1325.6,301.5 L1314.2,302.5 L1303.0,309.2 L1289.7,317.4 L1295.2,317.8 L1296.9,320.0 L1300.2,320.8 L1302.4,319.0 L1306.2,319.3 L1311.2,323.1 L1311.3,326.0 L1308.6,329.5 L1308.3,333.6 L1306.8,339.2 L1301.6,344.2 L1300.4,346.6 L1295.7,350.6 L1291.0,354.6 L1288.8,356.6 L1284.2,358.7 L1282.0,358.7 L1279.8,357.0 L1275.2,359.6 L1274.7,360.7 L1274.7,360.7 L1274.7,360.7 L1274.7,360.7 L1274.2,360.1 L1274.2,360.1 L1274.1,358.3 L1275.9,358.2 L1276.4,354.2 L1275.5,351.2 L1278.5,350.0 L1282.7,350.6 L1285.0,347.2 L1286.2,343.4 L1287.5,342.2 L1289.4,339.0 L1283.6,340.1 L1280.6,341.4 L1275.4,341.4 L1274.0,338.2 L1269.9,335.7 L1263.8,334.6 L1262.6,331.2 L1261.4,329.1 L1260.1,327.6 L1257.9,324.1 L1254.9,322.8 L1249.7,321.8 L1245.1,321.9 L1240.8,322.5 L1238.0,324.2 L1239.9,325.1 L1239.9,327.0 L1238.0,328.1 L1234.8,331.8 L1234.9,333.3 L1230.0,335.5 L1225.8,334.2 L1221.7,334.4 L1219.9,333.3 L1217.8,332.9 L1212.8,335.4 L1208.2,335.9 L1205.0,336.8 L1200.7,336.2 L1197.4,336.3 L1195.3,334.5 L1192.0,332.8 L1188.5,332.4 L1184.1,332.8 L1180.8,333.5 L1175.9,332.0 L1175.3,329.4 L1171.2,328.5 L1168.0,328.1 L1164.2,326.7 L1160.6,330.3 L1162.0,332.3 L1158.6,334.7 L1153.6,333.9 L1150.2,333.7 L1147.8,332.1 L1144.2,332.1 L1141.2,331.0 L1136.0,332.6 L1129.4,335.6 L1125.7,336.2 L1124.4,336.5 L1122.5,334.4 L1118.1,334.8 L1116.6,333.4 L1114.2,332.7 L1112.5,330.7 L1110.6,330.1 L1105.6,331.0 L1100.8,329.0 L1099.0,330.8 L1091.3,322.0 L1086.8,319.3 L1088.1,318.2 L1079.4,321.5 L1076.1,321.7 L1076.4,319.8 L1072.0,318.6 L1068.3,319.5 L1067.3,315.9 L1061.0,315.1 L1057.9,316.6 L1049.3,317.8 L1047.6,318.7 L1034.6,319.9 L1033.0,321.1 L1035.5,323.5 L1032.2,324.4 L1032.8,325.3 L1029.5,327.0 L1035.1,329.4 L1034.3,331.0 L1029.4,330.9 L1028.4,331.9 L1024.0,330.1 L1018.5,330.2 L1014.8,331.6 L1010.7,330.2 L1003.1,327.8 L997.7,327.9 L990.5,331.7 L990.1,334.2 L986.5,332.2 L983.8,336.0 L984.8,336.7 L982.8,339.3 L985.7,341.7 L988.3,341.6 L990.5,343.9 L990.2,345.7 L991.9,346.2 Z M1146.6,226.4 L1154.1,225.6 L1160.8,227.3 L1168.8,230.7 L1167.9,233.8 L1160.3,234.2 L1150.7,233.2 L1145.0,231.9 L1142.3,229.4 L1137.6,228.7 L1146.6,226.4 Z M1177.9,232.4 L1186.7,234.4 L1185.7,235.8 L1166.2,237.1 L1172.5,232.6 L1175.3,232.2 L1177.9,232.4 Z M1302.5,243.3 L1311.7,243.4 L1324.2,245.3 L1321.5,247.9 L1308.7,247.8 L1303.0,248.6 L1296.1,246.3 L1298.0,243.9 L1302.5,243.3 Z M1335.0,246.0 L1343.7,246.9 L1339.7,248.3 L1334.2,248.0 L1327.8,246.6 L1328.6,245.5 L1335.0,246.0 Z M1306.1,252.9 L1309.4,251.5 L1313.7,251.2 L1318.6,252.5 L1319.0,253.4 L1313.8,253.4 L1306.7,253.1 L1306.1,252.9 Z M977.2,227.9 L983.9,227.3 L989.2,227.2 L989.9,228.1 L991.9,227.3 L995.2,226.7 L1000.3,227.5 L999.0,228.0 L994.3,228.5 L991.2,228.7 L990.7,229.3 L986.7,229.9 L982.9,229.1 L984.9,228.0 L977.2,227.9 Z M900.6,318.8 L894.3,318.8 L890.0,318.5 L890.8,316.9 L895.6,315.8 L899.2,316.4 L900.7,317.0 L900.4,317.9 L900.6,318.8 Z M1007.2,251.6 L1015.5,248.5 L1014.5,247.0 L1022.3,245.1 L1033.7,242.9 L1045.2,242.3 L1051.1,241.0 L1057.9,240.5 L1060.3,241.9 L1058.0,243.0 L1045.7,244.7 L1035.1,246.3 L1024.4,249.6 L1019.2,253.0 L1013.8,256.3 L1014.5,259.2 L1021.1,262.0 L1019.1,262.4 L1007.8,261.9 L1006.8,260.4 L1000.6,259.4 L1000.1,257.6 L1003.6,256.8 L1003.5,254.9 L1010.4,252.0 L1007.2,251.6 Z M1316.7,320.9 L1317.9,324.3 L1317.8,327.7 L1319.2,331.2 L1322.7,337.3 L1317.6,336.2 L1315.4,341.2 L1318.8,344.7 L1318.7,347.1 L1316.1,345.1 L1313.8,347.7 L1313.2,344.8 L1313.6,341.5 L1313.2,337.7 L1314.0,335.1 L1314.1,330.5 L1312.1,327.1 L1312.4,322.3 L1315.6,320.8 L1314.2,319.1 L1315.8,318.7 L1316.7,320.9 Z M1462.6,274.2 L1462.3,276.4 L1464.6,277.2 L1463.8,274.7 L1473.2,275.2 L1480.0,278.5 L1476.6,280.0 L1470.9,280.3 L1470.8,283.7 L1469.4,284.4 L1466.2,284.3 L1463.5,283.1 L1458.9,282.1 L1458.2,280.6 L1454.7,280.0 L1450.7,280.5 L1448.8,279.3 L1449.6,278.0 L1445.4,278.8 L1447.0,280.5 L1445.0,281.9 L1445.0,268.1 L1453.5,270.8 L1462.6,274.2 Z M1449.6,261.4 L1445.0,261.7 L1445.0,259.3 L1445.5,259.1 L1448.4,259.2 L1453.4,260.1 L1453.1,260.6 L1449.6,261.4 Z M937.7,347.7 L938.6,346.9 L941.1,347.6 L942.2,347.7 L942.6,348.4 L943.1,348.5 L943.2,348.8 L944.9,349.7 L948.4,349.5 L947.7,350.7 L943.9,351.3 L939.2,353.3 L937.3,352.6 L938.1,351.0 L934.3,349.9 L934.9,349.3 L938.2,348.1 L937.7,347.7 Z"
              />
              <path
                className="fill-none stroke-white/15 stroke-[1.5] [stroke-dasharray:6_10]"
                d="M620 288 C650 315 670 340 690 376"
              />
              <path
                className="fill-none stroke-white/15 stroke-[1.5] [stroke-dasharray:6_10]"
                d="M650 465 C680 450 705 435 735 418"
              />
              <path
                className="fill-none stroke-white/15 stroke-[1.5] [stroke-dasharray:6_10]"
                d="M635 612 C685 565 725 505 765 445"
              />
              <path
                className="fill-none stroke-[url(#heroBridge)] stroke-2 opacity-80"
                d="M700 390 C820 344 925 322 1045 300"
              />
              <path
                className="fill-none stroke-[url(#heroBridge)] stroke-2 opacity-80"
                d="M735 468 C850 440 970 421 1115 410"
              />
              <path
                className="fill-none stroke-white/15 stroke-[1.5] [stroke-dasharray:6_10]"
                d="M1045 300 C1135 266 1220 252 1320 258"
              />
              <path
                className="fill-none stroke-white/15 stroke-[1.5] [stroke-dasharray:6_10]"
                d="M1115 410 C1205 396 1280 390 1370 402"
              />
              <circle
                className="fill-white opacity-90"
                cx="520"
                cy="248"
                r="5"
              />
              <circle
                className="fill-white opacity-90"
                cx="493"
                cy="390"
                r="5"
              />
              <circle
                className="fill-white opacity-90"
                cx="515"
                cy="605"
                r="5"
              />
              <circle
                className="fill-white opacity-90"
                cx="650"
                cy="354"
                r="5"
              />
              <circle
                className="fill-white opacity-90"
                cx="698"
                cy="456"
                r="5"
              />
              <circle className="fill-error" cx="1038" cy="196" r="5" />
              <circle className="fill-error" cx="1126" cy="322" r="5" />
              <circle className="fill-error" cx="1188" cy="466" r="5" />
              <circle className="fill-error" cx="1310" cy="256" r="5" />
              <circle className="fill-error" cx="1356" cy="336" r="5" />
            </svg>
          </div>

          <div className="mx-auto max-w-6xl relative z-10">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <motion.div
                initial={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion
                    ? 0
                    : HERO_FADE_DURATION_MS / 1000,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="max-w-2xl py-4 sm:py-6"
              >
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-md shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                  </span>
                  <span>
                    {t(
                      "Nền tảng Hợp tác Nghiên cứu & Đổi mới Sáng tạo Song phương",
                    )}
                  </span>
                </div>

                <h1 className="min-h-28 text-balance font-serif text-4xl font-bold leading-[1.06] tracking-[-0.045em] sm:min-h-32 sm:text-5xl">
                  <span className="block text-white">{staticTitle}</span>
                  <span className="relative mt-3 block h-20 font-sans text-2xl font-bold leading-tight tracking-[-0.03em] text-[#7dd3fc] sm:h-12 sm:text-3xl">
                    <span className="absolute inset-0">{dynamicText}</span>
                  </span>
                </h1>
                <p className="mt-6 text-base leading-relaxed text-white/90 sm:text-lg">
                  {t(
                    "Russia-Vietnam Science-Technology Intelligence Network kết nối nhà khoa học, công bố, chủ đề nghiên cứu, tổ chức, doanh nghiệp và dự án thành một mạng tri thức xuyên biên giới — nơi bản đồ Nga–Việt không chỉ để nhìn thấy địa lý, mà để nhìn thấy các luồng liên kết, tín hiệu hợp tác và cơ hội hình thành consortium thực sự.",
                  )}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#network"
                    className="future-cta inline-flex min-h-12 items-center justify-center rounded-xl bg-linear-to-r from-[#1d4ed8] to-[#3b82f6] px-7 py-3 text-sm font-bold text-white shadow-[0_16px_34px_-16px_rgba(59,130,246,.95)] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_42px_-16px_rgba(59,130,246,1)]"
                  >
                    {t("Khám phá mạng tri thức")}
                  </a>
                  <a
                    href="#cooperation"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-sky-300/30 bg-sky-300/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-md transition-[transform,background-color,border-color] duration-300 hover:-translate-y-1 hover:border-sky-200/50 hover:bg-sky-300/20"
                  >
                    {t("Tìm hiểu mô hình 2+2")}
                  </a>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-6 text-xs font-semibold text-white/90">
                  <span className="flex items-center gap-2">
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-blue-500/20 text-xs text-blue-400">
                      ✓
                    </span>
                    {t("Tri thức liên kết xuyên Nga – Việt")}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-blue-500/20 text-xs text-blue-400">
                      ✓
                    </span>
                    {t("Gợi ý đối tác có lý do giải thích")}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-blue-500/20 text-xs text-blue-400">
                      ✓
                    </span>
                    {t("Semantic search · expert matching")}
                  </span>
                </div>
              </motion.div>

              {/* ─── Hero Visual Stage ─── */}
              <motion.div
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, x: 36, rotateY: -5 }
                }
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : 0.72,
                  duration: shouldReduceMotion ? 0 : 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="future-stage signal-surface relative min-h-110 rounded-3xl border border-sky-300/25 p-6 shadow-[0_35px_100px_-45px_rgba(37,99,235,.95)]"
              >
                {/* Floating Tags */}
                <div className="future-tag border-runner absolute z-20 hidden sm:block rounded-lg border border-sky-300/30 bg-[#0c1e38]/95 px-3 py-1.5 text-xs font-bold text-white shadow-md backdrop-blur-md">
                  <strong className="text-white">RU–VN</strong>{" "}
                  {t("Knowledge Graph")}
                </div>

                {/* Search Mock Card */}
                <div className="future-glass rounded-2xl border border-white/15 bg-white/5 p-4">
                  <div className="flex items-center gap-3 border-b border-white/10 px-1 pb-3 text-xs text-white">
                    <span
                      className="relative flex h-2.5 w-2.5"
                      aria-hidden="true"
                    >
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </span>
                    <strong>{t("Mạng tri thức đang hoạt động")}</strong>
                    <span className="ml-auto text-sky-200">
                      128 {t("nút kết nối")}
                    </span>
                  </div>
                  <div className="mt-3 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/15 text-xs font-black text-white">
                      P
                    </span>
                    <div>
                      <strong className="block text-xs font-bold text-white">
                        {t("Công bố liên quan đến vật liệu nhiệt độ cao")}
                      </strong>
                      <span className="mt-0.5 block text-xs text-slate-300">
                        {t("Chủ đề · Công bố · Việt Nam")}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/15 text-xs font-black text-white">
                      E
                    </span>
                    <div>
                      <strong className="block text-xs font-bold text-white">
                        {t("Chuyên gia nghiên cứu vật liệu & năng lượng")}
                      </strong>
                      <span className="mt-0.5 block text-xs text-slate-300">
                        {t("Chuyên môn · Công bố · Tổ chức")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Flags Bridge Card */}
                <div className="future-glass mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-center">
                  <div className="rounded-xl bg-white/10 p-2">
                    <strong className="block text-sm font-bold text-white">
                      {t("RU")}
                    </strong>
                    <span className="text-xs text-slate-300">
                      {t("Liên bang Nga")}
                    </span>
                  </div>
                  <div className="h-1 w-10 rounded-full bg-linear-to-r from-[#2563eb] to-error" />
                  <div className="rounded-xl bg-white/10 p-2">
                    <strong className="block text-sm font-bold text-white">
                      {t("VN")}
                    </strong>
                    <span className="text-xs text-slate-300">
                      {t("Việt Nam")}
                    </span>
                  </div>
                </div>

                {/* Partner Match Card */}
                <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-slate-300">
                        {t("Đối tác đề xuất")}
                      </span>
                      <strong className="block text-xs font-bold text-white">
                        {t("Research Partner")}
                      </strong>
                    </div>
                    <span className="rounded-lg border border-white/20 bg-white/15 px-2.5 py-1 text-xs font-black text-white">
                      Khớp nối cao
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-xs font-semibold text-white">
                      {t("Chủ đề tương đồng")}
                    </span>
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-xs font-semibold text-white">
                      {t("Công bố liên quan")}
                    </span>
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-xs font-semibold text-white">
                      {t("Bổ sung chuyên môn")}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Trust Bar ─── */}
        <section className="border-y border-sky-300/15 bg-[#06152b] px-4 py-8 shadow-[inset_0_1px_0_rgba(125,211,252,.06)] sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="border-r border-white/10 pr-4">
              <strong className="font-serif text-2xl font-bold text-white sm:text-3xl">
                03
              </strong>
              <span className="mt-1 block text-xs text-white/90">
                {t("module lõi của Portal")}
              </span>
            </div>
            <div className="border-r border-white/10 pr-4">
              <strong className="font-serif text-2xl font-bold text-white sm:text-3xl">
                04
              </strong>
              <span className="mt-1 block text-xs text-white/90">
                {t("nhóm thành phần tối thiểu trong mô hình 2+2")}
              </span>
            </div>
            <div className="border-r border-white/10 pr-4">
              <strong className="font-serif text-2xl font-bold text-white sm:text-3xl">
                01
              </strong>
              <span className="mt-1 block text-xs text-white/90">
                {t("cổng danh tính & phân quyền thống nhất")}
              </span>
            </div>
            <div>
              <strong className="font-serif text-2xl font-bold text-white sm:text-3xl">
                ∞
              </strong>
              <span className="mt-1 block text-xs text-white/90">
                {t("mối liên kết tri thức có thể khám phá")}
              </span>
            </div>
          </div>
        </section>

        {/* ─── Network Knowledge Map Section ─── */}
        <section
          id="network"
          className="relative overflow-hidden bg-[#06152f] px-4 py-20 text-white sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-white">
                  {t("Không phải bản đồ tĩnh.")}
                  <br />
                  {t("Một mạng tri thức Nga–Việt đang chuyển động.")}
                </h2>
              </div>
              <div>
                <p className="text-base leading-relaxed text-slate-300">
                  <strong className="text-white">
                    {t("Mỗi chuyên gia không đứng một mình.")}
                  </strong>{" "}
                  {t(
                    "Hồ sơ của họ được đặt trong ngữ cảnh của công bố, chủ đề nghiên cứu, tổ chức, dự án và những chuyên gia liên quan. Từ một điểm dữ liệu, Portal mở ra toàn bộ chuỗi quan hệ để người dùng khám phá tri thức và tìm cơ hội hợp tác Nga – Việt.",
                  )}
                </p>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/12 bg-white/5 p-4">
                    <strong className="block text-sm font-bold text-white">
                      {t("Tri thức có ngữ cảnh")}
                    </strong>
                    <span className="mt-1 block text-xs text-slate-300">
                      {t("Công bố → tác giả → chủ đề → tổ chức → dự án.")}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-white/5 p-4">
                    <strong className="block text-sm font-bold text-white">
                      {t("Chuyên gia có quan hệ")}
                    </strong>
                    <span className="mt-1 block text-xs text-slate-300">
                      {t(
                        "Chuyên môn, hướng nghiên cứu và công bố tạo tín hiệu ghép nối.",
                      )}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-white/5 p-4">
                    <strong className="block text-sm font-bold text-white">
                      {t("Kết nối xuyên biên giới")}
                    </strong>
                    <span className="mt-1 block text-xs text-slate-300">
                      {t(
                        "Khám phá các quan hệ phù hợp giữa hệ sinh thái Việt Nam và Liên bang Nga.",
                      )}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-white/5 p-4">
                    <strong className="block text-sm font-bold text-white">
                      {t("Từ khám phá đến hợp tác")}
                    </strong>
                    <span className="mt-1 block text-xs text-slate-300">
                      {t(
                        "Mạng lưới tri thức là lớp dẫn đường tới đối tác, consortium và dự án song phương.",
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Map Canvas */}
            <div
              className="relative mt-12 min-h-[560px] overflow-hidden rounded-3xl border border-white/15 bg-[#0c1e38]/70 shadow-2xl backdrop-blur-xl"
              aria-label={t("Mô hình mạng lưới tri thức Nga - Việt")}
            >
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 1180 610"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="bridgeGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0" stopColor="#2563eb" />
                    <stop offset="1" stopColor="#dc2626" />
                  </linearGradient>
                </defs>
                <path
                  className="fill-none stroke-white/20 stroke-[1.4] [stroke-dasharray:5_10]"
                  d="M135 130 C250 145,270 265,430 290"
                />
                <path
                  className="fill-none stroke-white/20 stroke-[1.4] [stroke-dasharray:5_10]"
                  d="M160 300 C270 290,320 305,430 290"
                />
                <path
                  className="fill-none stroke-white/20 stroke-[1.4] [stroke-dasharray:5_10]"
                  d="M145 475 C250 430,320 350,430 290"
                />
                <path
                  className="fill-none stroke-white/20 stroke-[1.4] [stroke-dasharray:5_10]"
                  d="M390 108 C420 170,445 220,505 268"
                />
                <path
                  className="fill-none stroke-white/20 stroke-[1.4] [stroke-dasharray:5_10]"
                  d="M390 500 C435 430,470 365,505 320"
                />
                <path
                  className="fill-none stroke-[url(#bridgeGradient)] stroke-2 opacity-90"
                  d="M505 292 C590 250,660 250,745 292"
                />
                <path
                  className="fill-none stroke-white/20 stroke-[1.4] [stroke-dasharray:5_10]"
                  d="M745 292 C855 250,900 150,1010 125"
                />
                <path
                  className="fill-none stroke-white/20 stroke-[1.4] [stroke-dasharray:5_10]"
                  d="M745 292 C875 292,900 300,1035 300"
                />
                <path
                  className="fill-none stroke-white/20 stroke-[1.4] [stroke-dasharray:5_10]"
                  d="M745 292 C850 350,900 430,1015 485"
                />
                <path
                  className="fill-none stroke-white/20 stroke-[1.4] [stroke-dasharray:5_10]"
                  d="M680 268 C725 210,760 165,805 105"
                />
                <path
                  className="fill-none stroke-white/20 stroke-[1.4] [stroke-dasharray:5_10]"
                  d="M680 320 C720 382,755 445,805 510"
                />
                <path
                  className="fill-none stroke-white/20 stroke-[1.4] [stroke-dasharray:5_10]"
                  d="M160 300 C360 380,810 380,1035 300"
                />
              </svg>

              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 min-w-[124px] rounded-xl border border-white/18 bg-[#0c1e38]/95 p-2.5 shadow-lg"
                style={{ left: "11%", top: "21%" }}
              >
                <strong className="block text-xs font-bold text-white">
                  {t("Công bố khoa học")}
                </strong>
                <span className="text-xs text-slate-300">
                  {t("Publication · VN")}
                </span>
              </div>
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 min-w-[124px] rounded-xl border border-white/18 bg-[#0c1e38]/95 p-2.5 shadow-lg"
                style={{ left: "13%", top: "49%" }}
              >
                <strong className="block text-xs font-bold text-white">
                  {t("Chuyên gia Việt Nam")}
                </strong>
                <span className="text-xs text-slate-300">
                  {t("Expert · Researcher")}
                </span>
              </div>
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 min-w-[124px] rounded-xl border border-white/18 bg-[#0c1e38]/95 p-2.5 shadow-lg"
                style={{ left: "12%", top: "77%" }}
              >
                <strong className="block text-xs font-bold text-white">
                  {t("Viện / Trường VN")}
                </strong>
                <span className="text-xs text-slate-300">
                  {t("Organization")}
                </span>
              </div>
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 min-w-[124px] rounded-xl border border-white/18 bg-[#0c1e38]/95 p-2.5 shadow-lg"
                style={{ left: "33%", top: "17%" }}
              >
                <strong className="block text-xs font-bold text-white">
                  {t("Chủ đề nghiên cứu")}
                </strong>
                <span className="text-xs text-slate-300">
                  {t("Knowledge Topic")}
                </span>
              </div>
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 min-w-[124px] rounded-xl border border-white/18 bg-[#0c1e38]/95 p-2.5 shadow-lg"
                style={{ left: "33%", top: "81%" }}
              >
                <strong className="block text-xs font-bold text-white">
                  {t("Dự án & Công nghệ")}
                </strong>
                <span className="text-xs text-slate-300">
                  {t("Project · Technology")}
                </span>
              </div>

              {/* Core Knowledge Hub */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 w-[190px] min-h-[92px] grid place-items-center rounded-2xl border-2 border-white/30 bg-[#071831] p-3 text-center shadow-xl"
                style={{ left: "50%", top: "48%" }}
              >
                <div>
                  <strong className="block text-sm font-bold text-white">
                    {t(
                      "Russia-Vietnam Science-Technology Intelligence Network",
                    )}
                  </strong>
                  <span className="mt-1 block text-xs text-slate-300">
                    {t("Identity · Knowledge · Expertise · Cooperation")}
                  </span>
                </div>
              </div>

              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 min-w-[124px] rounded-xl border border-white/18 bg-[#0c1e38]/95 p-2.5 shadow-lg"
                style={{ left: "68%", top: "17%" }}
              >
                <strong className="block text-xs font-bold text-white">
                  {t("Research Domain")}
                </strong>
                <span className="text-xs text-slate-300">
                  {t("Shared expertise")}
                </span>
              </div>
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 min-w-[124px] rounded-xl border border-white/18 bg-[#0c1e38]/95 p-2.5 shadow-lg"
                style={{ left: "68%", top: "82%" }}
              >
                <strong className="block text-xs font-bold text-white">
                  {t("Joint Project")}
                </strong>
                <span className="text-xs text-slate-300">
                  {t("Cooperation opportunity")}
                </span>
              </div>
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 min-w-[124px] rounded-xl border border-white/18 bg-[#0c1e38]/95 p-2.5 shadow-lg"
                style={{ left: "86%", top: "20%" }}
              >
                <strong className="block text-xs font-bold text-white">
                  {t("Scientific Publication")}
                </strong>
                <span className="text-xs text-slate-300">
                  {t("Publication · RU")}
                </span>
              </div>
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 min-w-[124px] rounded-xl border border-white/18 bg-[#0c1e38]/95 p-2.5 shadow-lg"
                style={{ left: "88%", top: "49%" }}
              >
                <strong className="block text-xs font-bold text-white">
                  {t("Chuyên gia Liên bang Nga")}
                </strong>
                <span className="text-xs text-slate-300">
                  {t("Expert · Researcher")}
                </span>
              </div>
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 min-w-[124px] rounded-xl border border-white/18 bg-[#0c1e38]/95 p-2.5 shadow-lg"
                style={{ left: "86%", top: "79%" }}
              >
                <strong className="block text-xs font-bold text-white">
                  {t("Viện / Trường Nga")}
                </strong>
                <span className="text-xs text-slate-300">
                  {t("Organization")}
                </span>
              </div>

              {/* Bottom Legend */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-white/15 bg-[#071831]/95 px-4 py-3 text-xs text-white">
                <div>
                  <strong>{t("Mạng lưới tri thức Nga–Việt")}</strong>{" "}
                  <span className="text-slate-300">
                    {t(
                      "· từ dữ liệu khoa học phân tán đến quan hệ có thể khám phá và hành động.",
                    )}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#1c57d7]" />{" "}
                    {t("Việt Nam")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#dc2626]" />{" "}
                    {t("Liên bang Nga")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-linear-to-r from-[#1c57d7] to-[#dc2626]" />{" "}
                    {t("Liên kết song phương")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Current portal capabilities ─── */}
        <section
          id="modules"
          className="bg-[#f8fafc] px-4 py-20 text-[#0b192c] sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              {t("Một hạ tầng số. Ba năng lực chiến lược.")}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#334155]">
              {t(
                "Danh tính và governance tạo nền tin cậy. Mạng lưới tri thức tạo năng lực khám phá. Quy trình 2+2 biến kết nối thành cấu trúc hợp tác nghiên cứu – doanh nghiệp song phương.",
              )}
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <article className="flex flex-col rounded-3xl border border-[#e2e8f0] bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:shadow-md">
                <span className="text-xs font-black uppercase tracking-wider text-[#1d4ed8]">
                  {t("NỀN TẢNG TIN CẬY")}
                </span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-[#0b192c]">
                  {t("Danh tính & Truy cập")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#334155]">
                  {t(
                    "Cổng danh tính thống nhất cho toàn Portal, xác định người dùng là ai, đang ở context nào và được phép làm gì.",
                  )}
                </p>
                <ul className="mt-4 space-y-2 text-xs font-medium text-[#1e293b]">
                  <li className="flex items-center gap-2">
                    • {t("SSO / Identity Provider")}
                  </li>
                  <li className="flex items-center gap-2">
                    • {t("Role, permission & resource scope")}
                  </li>
                  <li className="flex items-center gap-2">
                    • {t("Session, 2FA theo policy, audit")}
                  </li>
                </ul>
                <span className="mt-auto pt-6 text-xs font-bold text-slate-500">
                  {t("Nền tảng truy cập thống nhất")}
                </span>
              </article>

              <article className="flex flex-col rounded-3xl border border-[#e2e8f0] bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:shadow-md">
                <span className="text-xs font-black uppercase tracking-wider text-[#1d4ed8]">
                  {t("KHÁM PHÁ")}
                </span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-[#0b192c]">
                  {t("Kho tri thức & Chuyên gia")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#334155]">
                  {t(
                    "Biến dữ liệu khoa học phân tán thành mạng tri thức có thể tìm kiếm, liên kết và hỗ trợ ghép nối đối tác.",
                  )}
                </p>
                <ul className="mt-4 space-y-2 text-xs font-medium text-[#1e293b]">
                  <li className="flex items-center gap-2">
                    • {t("Công bố, bằng sáng chế, tài liệu")}
                  </li>
                  <li className="flex items-center gap-2">
                    • {t("Hồ sơ chuyên gia & hướng nghiên cứu")}
                  </li>
                  <li className="flex items-center gap-2">
                    • {t("Tìm kiếm ngữ nghĩa & gợi ý đối tác")}
                  </li>
                </ul>
                <a
                  href="#knowledge"
                  className="mt-auto pt-6 text-xs font-bold text-[#1d4ed8] hover:underline"
                >
                  {t("Khám phá kho tri thức →")}
                </a>
              </article>

              <article className="flex flex-col rounded-3xl border border-[#e2e8f0] bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:shadow-md">
                <span className="text-xs font-black uppercase tracking-wider text-[#1d4ed8]">
                  {t("CỘNG TÁC")}
                </span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-[#0b192c]">
                  {t("Nghiên cứu & Kết nối 2+2")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#334155]">
                  {t(
                    "Hình thành cấu trúc hợp tác cân bằng giữa khối nghiên cứu và doanh nghiệp của cả Việt Nam và Liên bang Nga.",
                  )}
                </p>
                <ul className="mt-4 space-y-2 text-xs font-medium text-[#1e293b]">
                  <li className="flex items-center gap-2">
                    • {t("Viện/Trường Việt Nam")}
                  </li>
                  <li className="flex items-center gap-2">
                    • {t("Doanh nghiệp Việt Nam")}
                  </li>
                  <li className="flex items-center gap-2">
                    • {t("Viện/Trường Nga + Doanh nghiệp Nga")}
                  </li>
                </ul>
                <a
                  href="#cooperation"
                  className="mt-auto pt-6 text-xs font-bold text-[#1d4ed8] hover:underline"
                >
                  {t("Xem mô hình 2+2 →")}
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* ─── Intelligent Knowledge Repository Section ─── */}
        <section
          id="knowledge"
          className="bg-[#06152f] px-4 py-20 text-white sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                  {t("Đi từ một truy vấn đến cả hệ sinh thái tri thức.")}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/90">
                  {t(
                    "Người dùng không cần biết dữ liệu nằm ở “kho” nào. Một trải nghiệm tìm kiếm toàn cổng có thể dẫn từ công bố đến tác giả, chủ đề, tổ chức, dự án và những chuyên gia liên quan trong toàn mạng lưới Nga–Việt.",
                  )}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                    <strong className="block text-sm font-bold text-white">
                      {t("Tìm kiếm ngữ nghĩa")}
                    </strong>
                    <span className="mt-1 block text-xs text-white/90">
                      {t(
                        "Khám phá nội dung theo ý nghĩa, không chỉ khớp từ khóa.",
                      )}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                    <strong className="block text-sm font-bold text-white">
                      {t("Ghép nối giải thích được")}
                    </strong>
                    <span className="mt-1 block text-xs text-white/90">
                      {t(
                        "Hiển thị lý do phù hợp: chủ đề, công bố, hướng nghiên cứu.",
                      )}
                    </span>
                  </div>
                </div>

                <Link
                  href="/knowledge"
                  className="future-cta mt-8 inline-flex min-h-12 items-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-[#06152f] shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-[#eaf2ff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7dd3fc]"
                >
                  {t("Khám phá kho tri thức")}
                  <span aria-hidden="true" className="text-lg">
                    ↗
                  </span>
                </Link>
              </div>

              {/* Search Showcase Component */}
              <div className="rounded-3xl border border-white/15 bg-[#0c1e38] p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white">
                  <span>⌕</span>
                  <span>{t("Tìm chuyên gia, công bố, chủ đề…")}</span>
                  <span className="ml-auto font-bold">↵</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {[
                    t("Lĩnh vực"),
                    t("Tổ chức"),
                    t("Quốc gia"),
                    t("Chủ đề"),
                    t("Ngôn ngữ"),
                    t("Năm"),
                  ].map((filter) => (
                    <span
                      key={filter}
                      className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-white"
                    >
                      {filter}
                    </span>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/15 text-xs font-bold text-white">
                        EX
                      </span>
                      <div>
                        <strong className="block text-xs font-bold text-white">
                          {t("Chuyên gia vật liệu tiên tiến")}
                        </strong>
                        <span className="text-xs text-slate-300">
                          {t("18 công bố liên quan · Nghiên cứu vật liệu")}
                        </span>
                      </div>
                    </div>
                    <span className="rounded-md bg-white/15 px-2 py-0.5 text-xs font-bold text-white">
                      {t("CHUYÊN GIA")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/15 text-xs font-bold text-white">
                        PB
                      </span>
                      <div>
                        <strong className="block text-xs font-bold text-white">
                          {t("High-temperature materials for energy systems")}
                        </strong>
                        <span className="text-xs text-slate-300">
                          {t("Công bố · Chủ đề liên quan · 2025")}
                        </span>
                      </div>
                    </div>
                    <span className="rounded-md bg-white/15 px-2 py-0.5 text-xs font-bold text-white">
                      {t("CÔNG BỐ")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/15 text-xs font-bold text-white">
                        OR
                      </span>
                      <div>
                        <strong className="block text-xs font-bold text-white">
                          {t("Viện nghiên cứu công nghệ & năng lượng")}
                        </strong>
                        <span className="text-xs text-slate-300">
                          {t("Tổ chức · Nga / Việt Nam")}
                        </span>
                      </div>
                    </div>
                    <span className="rounded-md bg-white/15 px-2 py-0.5 text-xs font-bold text-white">
                      {t("TỔ CHỨC")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2+2 Cooperation Model ─── */}
        <section
          id="cooperation"
          className="bg-[#051124] px-4 py-20 text-white sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              {t(
                "Mô hình 2+2: cấu trúc hợp tác chiến lược giữa nghiên cứu và ứng dụng.",
              )}
            </h2>
            <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-300">
              {t(
                "2+2 không chỉ là bốn ô thông tin. Đây là khung hợp tác tối thiểu để kết nối một viện/trường và một doanh nghiệp của Liên bang Nga với một viện/trường và một doanh nghiệp của Việt Nam — tạo ra một hệ hợp tác cân bằng, có năng lực nghiên cứu, thử nghiệm, ứng dụng và thương mại hóa.",
              )}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-[#60a5fa]" />
                {t("2 quốc gia · 4 thành phần cốt lõi")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-[#60a5fa]" />
                {t("Research + Industry trên cả hai phía")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-[#60a5fa]" />
                {t("Từ tri thức đến hợp tác có thể triển khai")}
              </span>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_160px_1fr] lg:items-center">
              {/* Russia Ecosystem */}
              <div className="rounded-3xl border border-white/15 bg-[#0c1e38]/95 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white">
                      {t("🇷🇺 Liên bang Nga")}
                    </h3>
                  </div>
                  <span className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-bold text-white">
                    {t("Research + Industry")}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {t(
                    "Phía Nga cung cấp năng lực nghiên cứu chuyên sâu, cơ sở thí nghiệm, công nghệ nền và khả năng ứng dụng – công nghiệp hóa trong hệ sinh thái doanh nghiệp.",
                  )}
                </p>

                {/* Role 01 */}
                <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#1c57d7] text-base font-bold text-white">
                      ⌘
                    </div>
                    <div>
                      <span className="font-serif text-lg font-bold text-white">
                        01
                      </span>
                      <strong className="block text-base font-bold text-white">
                        {t("Viện / Trường")}
                      </strong>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-300">
                        {t(
                          "Bổ sung chuyên môn, công nghệ, phòng thí nghiệm và đội ngũ nghiên cứu.",
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs font-medium text-white">
                      {t("Lab & R&D")}
                    </span>
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs font-medium text-white">
                      {t("Scientific expertise")}
                    </span>
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs font-medium text-white">
                      {t("Technology base")}
                    </span>
                  </div>
                </div>

                {/* Plus */}
                <div className="my-2 grid place-items-center">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-lg font-bold text-white">
                    +
                  </span>
                </div>

                {/* Role 02 */}
                <div className="rounded-2xl border border-white/12 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#dc2626] text-base font-bold text-white">
                      ◫
                    </div>
                    <div>
                      <span className="font-serif text-lg font-bold text-white">
                        02
                      </span>
                      <strong className="block text-base font-bold text-white">
                        {t("Doanh nghiệp")}
                      </strong>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-300">
                        {t(
                          "Năng lực ứng dụng, công nghiệp hóa và tiếp cận thị trường Nga.",
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs font-medium text-white">
                      {t("Industrial partner")}
                    </span>
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs font-medium text-white">
                      {t("Commercialization")}
                    </span>
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs font-medium text-white">
                      {t("Market access")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Center 2+2 Connector */}
              <div className="flex flex-col items-center justify-center py-4 text-center lg:py-0">
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-3 border-white/30 bg-[#071831] shadow-2xl">
                  <span className="text-sm font-bold text-slate-200">
                    {t("RU–VN")}
                  </span>
                  <span className="text-2xl font-black text-white">
                    {t("2+2")}
                  </span>
                </div>
                <div className="mt-4 max-w-[140px] text-xs leading-relaxed text-slate-300">
                  <b className="block text-xs font-bold text-white">
                    {t("Strategic collaboration")}
                  </b>
                  <span>
                    {t(
                      "Một cấu trúc hợp tác tối thiểu nhưng đủ để đi từ nghiên cứu tới ứng dụng thực tế.",
                    )}
                  </span>
                </div>
              </div>

              {/* Vietnam Ecosystem */}
              <div className="rounded-3xl border border-white/15 bg-[#0c1e38]/95 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white">
                      {t("🇻🇳 Việt Nam")}
                    </h3>
                  </div>
                  <span className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-bold text-white">
                    {t("Research + Industry")}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {t(
                    "Phía Việt Nam mang vào bài toán năng lực nghiên cứu, phát triển tri thức, thử nghiệm ứng dụng và mạng lưới doanh nghiệp có nhu cầu triển khai, sản xuất và mở rộng thị trường.",
                  )}
                </p>

                {/* Role 03 */}
                <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#1c57d7] text-base font-bold text-white">
                      ⌘
                    </div>
                    <div>
                      <span className="font-serif text-lg font-bold text-white">
                        03
                      </span>
                      <strong className="block text-base font-bold text-white">
                        {t("Viện / Trường")}
                      </strong>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-300">
                        {t(
                          "Tạo và phát triển tri thức, công nghệ, năng lực nghiên cứu.",
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs font-medium text-white">
                      {t("Research capacity")}
                    </span>
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs font-medium text-white">
                      {t("Knowledge creation")}
                    </span>
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs font-medium text-white">
                      {t("Applied science")}
                    </span>
                  </div>
                </div>

                {/* Plus */}
                <div className="my-2 grid place-items-center">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-lg font-bold text-white">
                    +
                  </span>
                </div>

                {/* Role 04 */}
                <div className="rounded-2xl border border-white/12 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#dc2626] text-base font-bold text-white">
                      ◫
                    </div>
                    <div>
                      <span className="font-serif text-lg font-bold text-white">
                        04
                      </span>
                      <strong className="block text-base font-bold text-white">
                        {t("Doanh nghiệp")}
                      </strong>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-300">
                        {t(
                          "Nhu cầu ứng dụng, thử nghiệm, sản xuất và thị trường.",
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs font-medium text-white">
                      {t("Pilot deployment")}
                    </span>
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs font-medium text-white">
                      {t("Production")}
                    </span>
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs font-medium text-white">
                      {t("Demand signal")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 3 Cards */}
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/12 bg-white/5 p-4">
                <b className="block text-sm font-bold text-white">
                  {t("Cân bằng hai phía")}
                </b>
                <span className="mt-1 block text-sm leading-relaxed text-slate-300">
                  {t(
                    "Mỗi quốc gia đều có một khối nghiên cứu và một khối doanh nghiệp, giúp hợp tác không dừng ở trao đổi học thuật.",
                  )}
                </span>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/5 p-4">
                <b className="block text-sm font-bold text-white">
                  {t("Gắn với công nghệ / mục tiêu chung")}
                </b>
                <span className="mt-1 block text-sm leading-relaxed text-slate-300">
                  {t(
                    "Cấu trúc 2+2 phù hợp để xoay quanh một chủ đề, một công nghệ hoặc một nhu cầu ứng dụng cụ thể.",
                  )}
                </span>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/5 p-4">
                <b className="block text-sm font-bold text-white">
                  {t("Từ kết nối đến triển khai")}
                </b>
                <span className="mt-1 block text-sm leading-relaxed text-slate-300">
                  {t(
                    "Portal không chỉ ghép nối đối tác mà còn dẫn tới một cấu trúc hợp tác có thể hình thành consortium song phương.",
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Collaboration Flow ─── */}
        <section
          id="collaboration"
          className="bg-[#071831] px-4 py-20 text-white sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                  {t("Từ một điểm tri thức đến một quan hệ hợp tác thực sự.")}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-300">
                  {t(
                    "Russia-Vietnam Science-Technology Intelligence Network không dừng ở việc hiển thị hồ sơ hay công bố. Mạng lưới tri thức giúp người dùng đi từ khám phá chủ đề, tìm chuyên gia phù hợp, hiểu lý do ghép nối và tiến tới cấu trúc hợp tác song phương 2+2.",
                  )}
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-white/12 pt-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#1c57d7] text-base font-bold text-white">
                    ↗
                  </span>
                  <div>
                    <b className="block text-sm font-bold text-white">
                      {t("Khám phá có định hướng")}
                    </b>
                    <small className="block text-xs text-slate-300">
                      {t("Từ công bố → chuyên gia → tổ chức → cơ hội hợp tác.")}
                    </small>
                  </div>
                </div>
              </div>

              {/* 3 Step Cards */}
              <div className="grid min-w-0 gap-4 sm:grid-cols-3">
                {/* Step 1 */}
                <article className="relative min-w-0 rounded-2xl border border-white/15 bg-[#0c1e38]/85 p-5 shadow-xl backdrop-blur-md">
                  <span className="absolute top-4 right-4 text-xs font-bold text-slate-400">
                    01
                  </span>
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-base font-bold text-white">
                    ⌕
                  </div>
                  <h3 className="mt-6 hyphens-auto font-serif text-xl font-bold leading-tight text-white [overflow-wrap:anywhere]">
                    {t("Discover")}
                  </h3>
                  <p className="mt-2 hyphens-auto text-xs leading-relaxed text-slate-300 [overflow-wrap:anywhere]">
                    {t(
                      "Tìm kiếm toàn cổng theo chủ đề, lĩnh vực, tổ chức, quốc gia và đối tượng tri thức.",
                    )}
                  </p>
                </article>

                {/* Step 2 - Featured */}
                <article className="relative min-w-0 rounded-2xl border border-white/30 bg-[#1c57d7]/35 p-5 shadow-xl backdrop-blur-md">
                  <span className="absolute top-4 right-4 text-xs font-bold text-white/80">
                    02
                  </span>
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/20 text-base font-bold text-white">
                    ◎
                  </div>
                  <h3 className="mt-6 hyphens-auto font-serif text-xl font-bold leading-tight text-white [overflow-wrap:anywhere]">
                    {t("Match")}
                  </h3>
                  <p className="mt-2 hyphens-auto text-xs leading-relaxed text-slate-200 [overflow-wrap:anywhere]">
                    {t(
                      "Gợi ý chuyên gia và đối tác dựa trên công bố, hướng nghiên cứu và các tín hiệu tương đồng có thể giải thích.",
                    )}
                  </p>
                </article>

                {/* Step 3 */}
                <article className="relative min-w-0 rounded-2xl border border-white/15 bg-[#0c1e38]/85 p-5 shadow-xl backdrop-blur-md">
                  <span className="absolute top-4 right-4 text-xs font-bold text-slate-400">
                    03
                  </span>
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-base font-bold text-white">
                    2+2
                  </div>
                  <h3 className="mt-6 hyphens-auto font-serif text-xl font-bold leading-tight text-white [overflow-wrap:anywhere]">
                    {t("Collaborate")}
                  </h3>
                  <p className="mt-2 hyphens-auto text-xs leading-relaxed text-slate-300 [overflow-wrap:anywhere]">
                    {t(
                      "Chuyển kết nối phù hợp thành cấu trúc nghiên cứu – doanh nghiệp Nga–Việt quanh một mục tiêu hoặc công nghệ chung.",
                    )}
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Call to Action ─── */}
        <section className="bg-[#040d1e] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-3xl border border-white/15 bg-[#06152f] p-8 sm:p-12">
            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
              {t(
                "Biến mạng tri thức Nga–Việt thành năng lực hợp tác có thể hành động.",
              )}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/90">
              {t(
                "Russia-Vietnam Science-Technology Intelligence Network không dừng ở việc số hóa dữ liệu. Portal tạo một lớp kết nối giữa con người, tri thức, tổ chức và dự án — để từ một công bố có thể tìm ra chuyên gia, từ chuyên gia tìm ra đối tác, và từ đối tác hình thành cấu trúc hợp tác Nga–Việt có thể triển khai thực tế.",
              )}
            </p>
            <div className="mt-6">
              <a
                href="#top"
                className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/20 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-white/20"
              >
                {t("Bắt đầu khám phá ↑")}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/10 bg-[#06152f] px-4 py-8 text-xs text-slate-400 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="relative grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-md border border-white/20 bg-white">
              <span className="absolute inset-y-0 left-0 w-[64%] -skew-x-12 bg-[#1d4ed8]" />
              <span className="absolute inset-y-0 right-0 w-[48%] -skew-x-12 bg-error" />
            </span>
            <span>
              {t("Russia-Vietnam Science-Technology Intelligence Network")}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 font-semibold text-slate-300">
            <a href="#network" className="hover:text-white">
              {t("Mạng lưới tri thức")}
            </a>
            <a href="#modules" className="hover:text-white">
              {t("Năng lực")}
            </a>
            <a href="#knowledge" className="hover:text-white">
              {t("Kho tri thức")}
            </a>
            <a href="#cooperation" className="hover:text-white">
              {t("Hợp tác 2+2")}
            </a>
          </div>
          <div>
            {t(
              "Concept landing page · dựa trên tài liệu phân tích Russia-Vietnam Science-Technology Intelligence Network",
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
