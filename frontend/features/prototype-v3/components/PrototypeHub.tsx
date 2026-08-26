"use client";

import React from 'react';
import Link from 'next/link';

export function PrototypeHub() {
  return (
    <div className="w-full px-6 md:px-10 lg:px-12 py-8 space-y-8">
      {/* Header Banner - Full Width Fluid */}
      <div className="w-full p-8 md:p-10 rounded-3xl bg-linear-to-br from-[#081d37] via-[#06182f] to-[#041326] text-white shadow-xl border border-white/10 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Mạng lưới tri thức Nga - Việt</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Ba vùng truy cập độc lập.<br className="hidden sm:inline" />Không trộn lẫn vai trò và thẩm quyền.
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
            Kiến trúc hệ thống phân tách nghiêm ngặt không gian làm việc giữa <strong>Public (Tra cứu công khai)</strong>, <strong>Role-based Workspace (5 vai trò thành viên tác nghiệp)</strong> và <strong>Governance (Khu vực Quản trị &amp; Kiểm soát)</strong>.
          </p>
        </div>
      </div>

      {/* 3 Access Zones Grid - Widescreen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {/* Zone 1: Public */}
        <div className="p-7 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              01 · Tra cứu Công khai
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Public / Discovery</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Dành cho khách vãng lai và nhà khoa học tra cứu mở không cần đăng nhập: danh bạ chuyên gia, kho tri thức, công bố khoa học và cơ hội tài trợ song phương.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-card-border">
            <Link
              href="/"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-blue-700 dark:hover:text-blue-300 transition-all border border-card-border"
            >
              <span>Trang chủ Cổng thông tin (Landing)</span>
              <span className="text-blue-600 dark:text-blue-400 font-black text-base">→</span>
            </Link>
            <Link
              href="/experts"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-blue-700 dark:hover:text-blue-300 transition-all border border-card-border"
            >
              <span>Danh bạ Chuyên gia Việt – Nga</span>
              <span className="text-blue-600 dark:text-blue-400 font-black text-base">→</span>
            </Link>
            <Link
              href="/knowledge"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-blue-700 dark:hover:text-blue-300 transition-all border border-card-border"
            >
              <span>Kho Tri thức &amp; Dữ liệu Mở</span>
              <span className="text-blue-600 dark:text-blue-400 font-black text-base">→</span>
            </Link>
            <Link
              href="/opportunities"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-blue-700 dark:hover:text-blue-300 transition-all border border-card-border"
            >
              <span>Cơ hội Tài trợ &amp; Hợp tác Song phương</span>
              <span className="text-blue-600 dark:text-blue-400 font-black text-base">→</span>
            </Link>
          </div>
        </div>

        {/* Zone 2: Role-based Workspace */}
        <div className="p-7 md:p-8 rounded-3xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/60 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
              02 · Không gian Tác nghiệp Thành viên
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Role-based Workspace</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Trải nghiệm luồng công việc thực tế với dữ liệu mô phỏng viện, trường và doanh nghiệp công nghệ cao Việt Nam – LB Nga:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-blue-200/60 dark:border-blue-800/40">
            <Link
              href="/workspace/researcher"
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-left transition-all shadow-sm group"
            >
              <small className="block text-xs uppercase font-bold text-blue-600 dark:text-blue-400">Researcher</small>
              <strong className="block text-sm md:text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                Nhà nghiên cứu →
              </strong>
            </Link>

            <Link
              href="/workspace/reviewer"
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/40 border border-slate-200 dark:border-slate-700 hover:border-purple-400 text-left transition-all shadow-sm group"
            >
              <small className="block text-xs uppercase font-bold text-purple-600 dark:text-purple-400">Peer Review</small>
              <strong className="block text-sm md:text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                Hội đồng phản biện →
              </strong>
            </Link>

            <Link
              href="/workspace/organization"
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-900/40 border border-slate-200 dark:border-slate-700 hover:border-teal-400 text-left transition-all shadow-sm group"
            >
              <small className="block text-xs uppercase font-bold text-teal-600 dark:text-teal-400">Organization</small>
              <strong className="block text-sm md:text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                Đại diện tổ chức (VAST) →
              </strong>
            </Link>

            <Link
              href="/workspace/enterprise"
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-900/40 border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-left transition-all shadow-sm group"
            >
              <small className="block text-xs uppercase font-bold text-amber-600 dark:text-amber-400">Enterprise</small>
              <strong className="block text-sm md:text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                Doanh nghiệp (2+2) →
              </strong>
            </Link>

            <Link
              href="/workspace/leadership"
              className="sm:col-span-2 p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-slate-400 text-left transition-all shadow-sm group"
            >
              <small className="block text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Leadership Analytics</small>
              <strong className="block text-sm md:text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                Lãnh đạo Chiến lược (Dashboard Vĩ mô) →
              </strong>
            </Link>
          </div>
        </div>

        {/* Zone 3: Governance */}
        <div className="p-7 md:p-8 rounded-3xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/60 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 border border-rose-300 dark:border-rose-700">
              03 · Thẩm quyền Quản trị &amp; Giám sát
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Governance Area</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Khu vực độc lập dành cho ban quản trị hệ thống: Quản lý danh tính OIDC, ma trận phân quyền IAM, kiểm toán an ninh và thẩm định tài khoản.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-rose-200/60 dark:border-rose-800/40">
            <Link
              href="/governance"
              className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-sm md:text-base font-bold text-rose-800 dark:text-rose-200 transition-all border border-rose-200 dark:border-rose-800 shadow-sm"
            >
              <span>Truy cập Ma trận Phân quyền (IAM &amp; Audit)</span>
              <span className="text-rose-600 dark:text-rose-400 font-black text-base">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
