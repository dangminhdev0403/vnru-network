import Link from "next/link";
import type { DiscoveryResult, PublicExpert, PublicPublication } from "../../knowledge/types";

type Props = Readonly<{
  publications: DiscoveryResult<PublicPublication>;
  experts: DiscoveryResult<PublicExpert>;
}>;

export default function DashboardView({ publications, experts }: Props) {
  return (
    <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8 space-y-6">
      {/* Compact Active-Context Introduction */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black uppercase text-slate-700">
              Runtime workspace · active context
            </div>
            <h1 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">Workspace Nga–Việt</h1>
            <p className="mt-1 text-sm text-slate-600">
              Chào mừng bạn đến với Cổng thông tin mạng lưới tri thức Việt – Nga. Phân quyền và ngữ cảnh hoạt động của bạn được cung cấp bởi hệ thống Quản lý Danh tính & Truy cập (Module 01 IAM).
            </p>
          </div>
        </div>
      </div>

      {/* Useful Shortcuts */}
      <section className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">Phím tắt nhanh</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/workspace/iam" className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-500 hover:shadow-md transition">
            <span className="material-symbols-outlined text-3xl text-blue-600 group-hover:scale-105 transition-transform">shield_person</span>
            <strong className="mt-3 block text-base font-black text-slate-950">IAM Workspace</strong>
            <p className="mt-1 text-xs text-slate-600">Quản lý định danh và quyền hạn của cá nhân trong mạng lưới.</p>
          </Link>
          <Link href="/workspace/knowledge" className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-500 hover:shadow-md transition">
            <span className="material-symbols-outlined text-3xl text-indigo-600 group-hover:scale-105 transition-transform">hub</span>
            <strong className="mt-3 block text-base font-black text-slate-950">Knowledge &amp; Experts</strong>
            <p className="mt-1 text-xs text-slate-600">Tra cứu công trình khoa học, chuyên gia và cơ hội hợp tác.</p>
          </Link>
          <Link href="/security" className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-500 hover:shadow-md transition">
            <span className="material-symbols-outlined text-3xl text-emerald-600 group-hover:scale-105 transition-transform">verified_user</span>
            <strong className="mt-3 block text-base font-black text-slate-950">Security &amp; Sessions</strong>
            <p className="mt-1 text-xs text-slate-600">Quản lý thiết bị đang đăng nhập và bảo mật tài khoản.</p>
          </Link>
        </div>
      </section>

      {/* Publications and Experts sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-lg font-black text-slate-900">Publications</h3>
            <Link href="/workspace/knowledge" className="text-xs font-black text-blue-600 hover:underline">
              Xem tất cả →
            </Link>
          </div>
          {publications.status === "success" ? (
            publications.items.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {publications.items.map((p) => (
                  <div key={p.id} className="py-3">
                    <strong className="text-sm text-slate-900 block hover:text-blue-600 transition-colors">{p.title}</strong>
                    <span className="block text-xs text-slate-500 mt-1">
                      {p.type} · {p.year} · {p.country}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                Không tìm thấy tài liệu công bố nào.
              </div>
            )
          ) : (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-800">
              Công bố khoa học tạm thời không khả dụng.
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-lg font-black text-slate-900">Experts</h3>
            <Link href="/workspace/knowledge" className="text-xs font-black text-blue-600 hover:underline">
              Xem tất cả →
            </Link>
          </div>
          {experts.status === "success" ? (
            experts.items.length > 0 ? (
              <div className="grid gap-3">
                {experts.items.map((e) => (
                  <div key={e.id} className="rounded-2xl bg-slate-50/80 border border-slate-200 p-3.5">
                    <strong className="text-sm text-slate-900 block">{e.displayName}</strong>
                    <span className="block text-xs text-slate-500 mt-1">
                      {e.organization.name} · {e.country}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                Không tìm thấy chuyên gia nào.
              </div>
            )
          ) : (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-800">
              Danh sách chuyên gia tạm thời không khả dụng.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
