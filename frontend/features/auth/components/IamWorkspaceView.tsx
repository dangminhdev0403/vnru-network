import Link from "next/link";

const decisions = [
  ["01", "Resolve identity", "Xác định authenticated identity từ session hợp lệ."],
  ["02", "Resolve active context", "Áp dụng context đang active cho workspace hiện tại."],
  ["03", "Check capability", "Frontend chỉ dùng capability để điều khiển UX; backend vẫn quyết định."],
  ["04", "Apply resource scope", "Giới hạn hành động theo resource/context cụ thể."],
  ["05", "Audit sensitive action", "Các hành động governance quan trọng đi vào security/audit trail."],
];

const permissions = [
  ["IAM.USER.READ", "Đọc danh tính/user theo scope được cấp."],
  ["IAM.ROLE.ASSIGN", "Gán role/context khi backend cho phép."],
  ["KNOWLEDGE.PUBLICATION.READ", "Đọc tri thức theo access scope."],
  ["KNOWLEDGE.EXPERT.READ", "Đọc expert directory theo context."],
];

export default function IamWorkspaceView() {
  return (
    <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-800">Module 01 · Identity & Access Governance</span>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">IAM / Governance Workspace</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Màn hình runtime cho identity, active context, capability và resource scope. Đây là lớp điều hướng/hiển thị; authorization authoritative vẫn nằm ở backend service boundary.</p>
        </div>
        <Link href="/admin/iam" className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5">Mở Access Administration →</Link>
      </div>

      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#071831] p-6 text-white shadow-[0_24px_70px_rgba(8,32,72,.16)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(52,132,255,.28),transparent_27%),radial-gradient(circle_at_88%_86%,rgba(239,91,115,.11),transparent_23%)]" />
        <div className="relative z-10 grid gap-7 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,.8fr)] xl:items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-sky-300">Security gateway contract</span>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-5xl">Identity → Context → Capability → Resource Scope</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">Module 01 không sở hữu publication, project hay expert state. Nó cung cấp security context để các domain khác tự enforce business authorization tại backend boundary.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[["Identity", "Authenticated member"], ["Active context", "Session-scoped"], ["Session", "Validated by auth-service"], ["Authorization", "Backend authoritative"]].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"><span className="text-xs font-black uppercase tracking-[0.12em] text-slate-300">{label}</span><strong className="mt-2 block text-sm text-white">{value}</strong></div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(29,57,95,.05)] sm:p-6">
          <div><h3 className="text-lg font-black">Authorization decision flow</h3><p className="mt-1 text-xs text-slate-500">Flow hiển thị để giải thích boundary, không duplicate backend business rules.</p></div>
          <div className="mt-5 grid gap-3">
            {decisions.map(([index, title, description]) => (
              <div key={index} className="grid grid-cols-[42px_minmax(0,1fr)] gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-[42px_minmax(0,1fr)_auto] sm:items-center">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-xs font-black text-blue-700">{index}</span>
                <div><strong className="text-sm text-slate-900">{title}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span></div>
                <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-800 sm:inline-flex">Boundary</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(29,57,95,.05)] sm:p-6">
          <div><h3 className="text-lg font-black">Capabilities & resource scope</h3><p className="mt-1 text-xs text-slate-500">Tên permission chỉ là minh họa giao diện tích hợp; backend contract là nguồn sự thật.</p></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {permissions.map(([permission, description]) => (
              <div key={permission} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"><code className="text-xs font-black text-blue-700">{permission}</code><p className="mt-2 text-xs leading-5 text-slate-500">{description}</p></div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(29,57,95,.05)] sm:p-6">
          <span className="material-symbols-outlined text-3xl text-blue-600">passkey</span><h3 className="mt-4 text-lg font-black">Authentication & IdP</h3><p className="mt-2 text-sm leading-6 text-slate-600">Keycloak/OIDC là auth boundary hiện tại. Provider upstream như Google được cấu hình phía IdP, không hard-code credential trong frontend.</p>
        </section>
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(29,57,95,.05)] sm:p-6">
          <span className="material-symbols-outlined text-3xl text-blue-600">devices</span><h3 className="mt-4 text-lg font-black">Sessions & Security</h3><p className="mt-2 text-sm leading-6 text-slate-600">Quản lý phiên đăng nhập, revoke session và security trail nằm ở surface chuyên biệt.</p><Link href="/security" className="mt-4 inline-flex text-sm font-black text-blue-600">Mở Security & Sessions →</Link>
        </section>
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(29,57,95,.05)] sm:p-6">
          <span className="material-symbols-outlined text-3xl text-blue-600">admin_panel_settings</span><h3 className="mt-4 text-lg font-black">Access Administration</h3><p className="mt-2 text-sm leading-6 text-slate-600">User status, roles và assignments tiếp tục dùng console hiện hữu và API admin đã có trong repo.</p><Link href="/admin/iam" className="mt-4 inline-flex text-sm font-black text-blue-600">Mở IAM Admin →</Link>
        </section>
      </div>

      <section className="mt-5 rounded-[24px] border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-amber-900">Open decisions</span>
        <div className="mt-3 grid gap-3 md:grid-cols-2"><div className="rounded-2xl border border-amber-200 bg-white/70 p-4"><strong className="text-sm text-slate-900">OPEN-01 · IdP / SSO policy</strong><p className="mt-1 text-xs leading-5 text-amber-950">Không tự chốt provider policy trong UI; runtime dùng Keycloak/OIDC boundary hiện có.</p></div><div className="rounded-2xl border border-amber-200 bg-white/70 p-4"><strong className="text-sm text-slate-900">OPEN-02 · Multi-context behavior</strong><p className="mt-1 text-xs leading-5 text-amber-950">Context switcher chỉ là UX; cơ chế chuyển context phải dựa trên session contract đã được backend phê duyệt.</p></div></div>
      </section>
    </div>
  );
}
