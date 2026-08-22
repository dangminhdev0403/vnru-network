import Link from "next/link";

const links = [
  ["/knowledge", "Kho tri thức"],
  ["/experts", "Chuyên gia"],
  ["/search", "Tìm kiếm"],
] as const;

export default function PublicHeader() {
  return (
    <header className="border-b border-outline-variant bg-surface">
      <div className="mx-auto flex min-h-16 max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="font-bold text-on-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">
          VN–RU Network
        </Link>
        <nav aria-label="Khám phá công khai" className="flex flex-wrap items-center gap-4 text-sm font-semibold">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="text-on-surface-variant hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">
              {label}
            </Link>
          ))}
          <Link href="/login" className="rounded-lg bg-secondary px-3 py-2 text-on-secondary hover:bg-secondary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
            Đăng nhập
          </Link>
        </nav>
      </div>
    </header>
  );
}
