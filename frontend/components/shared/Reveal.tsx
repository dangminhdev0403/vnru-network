"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase);
  try {
    CustomEase.create("institutional", "0.22, 1, 0.36, 1");
  } catch {
    // Already created
  }
}

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
  duration?: number;
  scale?: number;
  blur?: number | boolean;
  as?:
    | "div"
    | "article"
    | "section"
    | "span"
    | "header"
    | "footer"
    | "aside"
    | "main";
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 52,
  amount = 0.08,
  duration = 0.95,
  scale,
  blur = 6,
  as = "div",
}: RevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const blurVal = typeof blur === "number" ? blur : blur ? 6 : 0;
      const targetY =
        y === 0 ? 0 : y < 20 ? Math.round(y * 2.8) : Math.max(y, 48);
      const targetDuration = Math.max(duration, 0.9);
      const startPercent = Math.max(
        70,
        Math.min(95, Math.round((1 - amount) * 100)),
      );

      const mm = gsap.matchMedia();
      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 640px) and (max-width: 1023px)",
          isMobile: "(max-width: 639px)",
          isReduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, isTablet, isMobile, isReduced } =
            context.conditions ?? {};

          if (isReduced) {
            gsap.set(el, {
              opacity: 1,
              y: 0,
              filter: "none",
              clearProps: "all",
            });
            return;
          }

          // Adaptive travel distance, duration, blur, and trigger point by device size
          const responsiveY = isMobile
            ? Math.round(targetY * 0.58)
            : isTablet
              ? Math.round(targetY * 0.8)
              : targetY;

          const responsiveDuration = isMobile
            ? Math.min(targetDuration, 0.78)
            : isTablet
              ? Math.min(targetDuration, 0.88)
              : targetDuration;

          const responsiveBlur = isMobile
            ? Math.min(blurVal, 3)
            : isTablet
              ? Math.min(blurVal, 4)
              : blurVal;

          const responsiveStart = isMobile
            ? "top 95%"
            : isTablet
              ? "top 93%"
              : `top ${startPercent}%`;

          const responsiveDelay = isMobile ? Math.min(delay, 0.1) : delay;

          gsap.fromTo(
            el,
            {
              opacity: 0,
              y: responsiveY,
              ...(scale !== undefined ? { scale } : {}),
              ...(responsiveBlur > 0
                ? { filter: `blur(${responsiveBlur}px)` }
                : {}),
            },
            {
              opacity: 1,
              y: 0,
              ...(scale !== undefined ? { scale: 1 } : {}),
              ...(responsiveBlur > 0 ? { filter: "blur(0px)" } : {}),
              duration: responsiveDuration,
              delay: responsiveDelay,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: responsiveStart,
                once: true,
              },
              clearProps: "all",
            },
          );
        },
        containerRef,
      );
    },
    {
      scope: containerRef,
      dependencies: [delay, y, amount, duration, scale, blur],
    },
  );

  const Tag = as as unknown as React.ElementType;

  return (
    <Tag ref={containerRef} className={className}>
      {children}
    </Tag>
  );
}

export function Stagger({
  children,
  className,
  staggerDelay = 0.12,
  duration = 0.95,
  y = 52,
  amount = 0.08,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  duration?: number;
  y?: number;
  amount?: number;
  as?: "div" | "ul" | "ol" | "section";
}) {
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const items = Array.from(container.children);
      if (items.length === 0) return;

      const targetY =
        y === 0 ? 0 : y < 20 ? Math.round(y * 2.8) : Math.max(y, 48);
      const targetDuration = Math.max(duration, 0.9);
      const startPercent = Math.max(
        70,
        Math.min(95, Math.round((1 - amount) * 100)),
      );

      const mm = gsap.matchMedia();
      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 640px) and (max-width: 1023px)",
          isMobile: "(max-width: 639px)",
          isReduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, isTablet, isMobile, isReduced } =
            context.conditions ?? {};

          if (isReduced) {
            gsap.set(items, { opacity: 1, y: 0, clearProps: "all" });
            return;
          }

          const responsiveY = isMobile
            ? Math.round(targetY * 0.58)
            : isTablet
              ? Math.round(targetY * 0.8)
              : targetY;

          const responsiveDuration = isMobile
            ? Math.min(targetDuration, 0.78)
            : isTablet
              ? Math.min(targetDuration, 0.88)
              : targetDuration;

          const responsiveBlur = isMobile ? 3 : isTablet ? 4 : 6;

          const responsiveStart = isMobile
            ? "top 95%"
            : isTablet
              ? "top 93%"
              : `top ${startPercent}%`;

          const responsiveStagger = isMobile
            ? Math.min(staggerDelay, 0.08)
            : isTablet
              ? Math.min(staggerDelay, 0.1)
              : staggerDelay;

          gsap.fromTo(
            items,
            {
              opacity: 0,
              y: responsiveY,
              filter: `blur(${responsiveBlur}px)`,
            },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: responsiveDuration,
              stagger: {
                each: responsiveStagger,
                ease: "power2.out",
              },
              ease: "power3.out",
              scrollTrigger: {
                trigger: container,
                start: responsiveStart,
                once: true,
              },
              clearProps: "all",
            },
          );
        },
        containerRef,
      );
    },
    { scope: containerRef, dependencies: [staggerDelay, duration, y, amount] },
  );

  const Tag = as as unknown as React.ElementType;

  return (
    <Tag ref={containerRef} className={className}>
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Tag = as as unknown as React.ElementType;
  return <Tag className={className}>{children}</Tag>;
}
