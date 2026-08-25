import Image from "next/image";
import { cn } from "@/lib/cn";

type BrandMarkProps = { className?: string; alt?: string };

export function BrandMark({ className, alt = "Mạng lưới Tri thức Khoa học - Công nghệ Nga - Việt" }: Readonly<BrandMarkProps>) {
  return (
    <span aria-hidden="true" className={cn("vnru-brand-mark relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl", className)}>
      <Image
        src="/brand/vnru-logo-2026.png"
        alt={alt}
        width={96}
        height={96}
        priority
        className="size-full object-contain object-center"
      />
    </span>
  );
}
