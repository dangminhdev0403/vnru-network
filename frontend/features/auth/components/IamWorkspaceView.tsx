"use client";

import Link from "next/link";
import React from "react";

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
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-800 dark:text-blue-300">
            Module 01 · Identity &amp; Access Governance
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl text-text-primary">
            IAM / Governance Workspace
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
            Màn hình runtime cho identity, active context, capability và resource scope. Đây là lớp điều hướng/hiển thị; authorization authoritative vẫn nằm ở backend service boundary.
          </p>
        </div>
        <Link
          href="/admin/iam"
          className="rounded-2xl bg-slate-950 dark:bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          Mở Access Administration →
        </Link>
      </div>

      {/* Future Signal Mesh Section */}
      <section className="signal-surface relative overflow-hidden rounded-2xl border border-white/10 p-6 text-white shadow-[0_24px_70px_rgba(8,32,72,.16)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(52,132,255,.28),transparent_27%),radial-gradient(circle_at_88%_86%,rgba(239,91,115,.11),transparent_23%)]" />
        <div className="relative z-10 grid gap-7 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,.8fr)] xl:items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-sky-300">
              Security gateway contract
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-5xl text-white">
              Identity → Context → Capability → Resource Scope
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Module 01 không sở hữu publication, project hay expert state. Nó cung cấp security context để các domain khác tự enforce business authorization tại backend boundary.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Identity", "Authenticated member"],
              ["Active context", "Session-scoped"],
              ["Session", "Validated by auth-service"],
              ["Authorization", "Backend authoritative"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xs"
              >
                <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-300">
                  {label}
                </span>
                <strong className="mt-2 block text-sm text-white">{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decision Flow and Capabilities Grid */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
        {/* Decision Flow */}
        <section className="app-panel p-5 sm:p-6">
          <div>
            <h3 className="text-lg font-black text-text-primary">Authorization decision flow</h3>
            <p className="mt-1 text-xs text-text-secondary">
              Flow hiển thị để giải thích boundary, không duplicate backend business rules.
            </p>
          </div>
          <div className="mt-5 grid gap-3">
            {decisions.map(([index, title, description]) => (
              <div
                key={index}
                className="grid grid-cols-[42px_minmax(0,1fr)] gap-3 rounded-2xl border border-card-border bg-card-surface-area p-4 sm:grid-cols-[42px_minmax(0,1fr)_auto] sm:items-center"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-xs font-black text-blue-600 dark:text-blue-400">
                  {index}
                </span>
                <div>
                  <strong className="text-sm font-bold text-text-primary">{title}</strong>
                  <span className="mt-1 block text-xs leading-5 text-text-secondary">
                    {description}
                  </span>
                </div>
                <span className="hidden rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 sm:inline-flex">
                  Boundary
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities & Resource Scope */}
        <section className="app-panel p-5 sm:p-6">
          <div>
            <h3 className="text-lg font-black text-text-primary">Capabilities &amp; resource scope</h3>
            <p className="mt-1 text-xs text-text-secondary">
              Tên permission chỉ là minh họa giao diện tích hợp; backend contract là nguồn sự thật.
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {permissions.map(([permission, description]) => (
              <div
                key={permission}
                className="rounded-2xl border border-card-border bg-card-surface-area p-4"
              >
                <code className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {permission}
                </code>
                <p className="mt-2 text-xs leading-5 text-text-secondary">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 3 Domain Cards */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="app-panel p-5 sm:p-6">
          <span className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">
            passkey
          </span>
          <h3 className="mt-4 text-lg font-black text-text-primary">Authentication &amp; IdP</h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Keycloak/OIDC là auth boundary hiện tại. Provider upstream như Google được cấu hình phía IdP, không hard-code credential trong frontend.
          </p>
        </section>

        <section className="app-panel p-5 sm:p-6">
          <span className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">
            devices
          </span>
          <h3 className="mt-4 text-lg font-black text-text-primary">Sessions &amp; Security</h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Quản lý phiên đăng nhập, revoke session và security trail nằm ở surface chuyên biệt.
          </p>
          <Link href="/security" className="mt-4 inline-flex text-sm font-black text-blue-600 dark:text-blue-400 hover:underline">
            Mở Security &amp; Sessions →
          </Link>
        </section>

        <section className="app-panel p-5 sm:p-6">
          <span className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">
            admin_panel_settings
          </span>
          <h3 className="mt-4 text-lg font-black text-text-primary">Access Administration</h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            User status, roles và assignments tiếp tục dùng console hiện hữu và API admin đã có trong repo.
          </p>
          <Link href="/admin/iam" className="mt-4 inline-flex text-sm font-black text-blue-600 dark:text-blue-400 hover:underline">
            Mở IAM Admin →
          </Link>
        </section>
      </div>

      {/* Open Decisions */}
      <section className="mt-6 rounded-[24px] border border-amber-200 dark:border-amber-800/60 bg-amber-50/90 dark:bg-amber-950/20 p-5 sm:p-6">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-amber-900 dark:text-amber-200">
          Open decisions
        </span>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-white/70 dark:bg-slate-900/50 p-4">
            <strong className="text-sm font-bold text-text-primary">
              OPEN-01 · IdP / SSO policy
            </strong>
            <p className="mt-1 text-xs leading-5 text-amber-950 dark:text-amber-200">
              Không tự chốt provider policy trong UI; runtime dùng Keycloak/OIDC boundary hiện có.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-white/70 dark:bg-slate-900/50 p-4">
            <strong className="text-sm font-bold text-text-primary">
              OPEN-02 · Multi-context behavior
            </strong>
            <p className="mt-1 text-xs leading-5 text-amber-950 dark:text-amber-200">
              Context switcher chỉ là UX; cơ chế chuyển context phải dựa trên session contract đã được backend phê duyệt.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
