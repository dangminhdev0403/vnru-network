"use client";

import React, { useState } from 'react';
import { MOCK_PROPOSALS } from '../mock-data';

export function ResearcherWorkspace() {
  const [activeTab, setActiveTab] = useState<'all' | 'proposals' | 'active'>('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 2500);
  };

  const filteredProposals = MOCK_PROPOSALS.filter((p) => {
    if (activeTab === 'proposals') return p.status === 'PENDING_COPI' || p.status === 'UNDER_REVIEW';
    if (activeTab === 'active') return p.status === 'ACTIVE';
    return true;
  });

  return (
    <div className="w-full px-6 md:px-10 lg:px-12 py-8 space-y-8">
      {/* Toast Notification */}
      {toastText && (
        <div className="fixed bottom-8 right-8 z-50 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white shadow-2xl animate-fade-in border border-slate-700">
          ✓ {toastText}
        </div>
      )}

      {/* Invite Co-PI Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#fffdf8] dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Mời Đồng chủ nhiệm (Co-PI) phía LB Nga</h3>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-5 text-sm">
              <div>
                <label htmlFor="co-pi-select" className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                  Chọn nhà khoa học đối tác phía LB Nga:
                </label>
                <select id="co-pi-select" className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm">
                  <option>Prof. Alexei Morozov (Viện Sinh học Biển FEB RAS Vladivostok)</option>
                  <option>Prof. Dmitry Sokolov (Khoa Vật liệu MISIS Moskva)</option>
                  <option>Dr. Elena Petrova (Viện Dịch tễ Gamaleya)</option>
                </select>
              </div>
              <div>
                <label htmlFor="proposal-link-field" className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                  Đề xuất song phương liên kết:
                </label>
                <input
                  id="proposal-link-field"
                  type="text"
                  readOnly
                  value="RU-VN-2026-NANO-01: Độ bền vật liệu Nano-composite trong môi trường biển"
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 font-medium text-slate-700 dark:text-slate-300 text-sm"
                />
              </div>
              <div>
                <label htmlFor="invite-message" className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                  Lời nhắn &amp; Phân công trách nhiệm dự kiến:
                </label>
                <textarea
                  id="invite-message"
                  rows={4}
                  className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
                  defaultValue="Trân trọng kính mời Giáo sư Alexei Morozov đồng chủ nhiệm đề xuất nghiên cứu song phương VAST - FEB RAS..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsInviteModalOpen(false);
                  showToast('Đã gửi lời mời Co-PI tới Prof. Alexei Morozov');
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-md"
              >
                Gửi lời mời ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Ribbon */}
      <div className="p-4 md:p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-950 dark:text-blue-200 text-sm font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.7)]" />
          <span className="text-sm md:text-base font-bold">Nhà nghiên cứu: GS.TS. Trần Đình Nam (Viện Hải dương học · VAST)</span>
        </div>
        <span className="text-slate-600 dark:text-slate-400 font-medium text-xs md:text-sm">Phạm vi: Đề xuất song phương &amp; Dự án hợp tác</span>
      </div>

      {/* Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Nghiên cứu Song phương Việt Nam – Liên bang Nga
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base mt-2">
            Quản lý đề xuất hợp tác khoa học công nghệ, theo dõi tiến độ giải ngân &amp; thực hiện và kết nối Co-PI phía Nga.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="px-5 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-card-surface-area hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm shadow-xs transition-all"
          >
            + Mời Co-PI Nga
          </button>
          <button
            type="button"
            onClick={() => showToast('Mở trình soạn thảo đề xuất song phương mới')}
            className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-md transition-all"
          >
            + Soạn đề xuất mới
          </button>
        </div>
      </div>

      {/* KPI Cards - Widescreen Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-2 hover:shadow-md transition-all">
          <span className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-bold block uppercase tracking-wider">Đề xuất đang mở</span>
          <strong className="text-4xl lg:text-5xl font-extrabold text-blue-900 dark:text-blue-400 block font-mono">4</strong>
          <span className="text-xs md:text-sm text-amber-600 dark:text-amber-400 font-bold block">2 hồ sơ cần Co-PI phản hồi</span>
        </div>
        <div className="p-6 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-2 hover:shadow-md transition-all">
          <span className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-bold block uppercase tracking-wider">Dự án song phương</span>
          <strong className="text-4xl lg:text-5xl font-extrabold text-emerald-700 dark:text-emerald-400 block font-mono">2</strong>
          <span className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-bold block">Milestone 2 (75% tiến độ)</span>
        </div>
        <div className="p-6 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-2 hover:shadow-md transition-all">
          <span className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-bold block uppercase tracking-wider">Đồng tác giả Nga</span>
          <strong className="text-4xl lg:text-5xl font-extrabold text-indigo-900 dark:text-indigo-400 block font-mono">18</strong>
          <span className="text-xs md:text-sm text-indigo-600 dark:text-indigo-400 font-bold block">FEB RAS &amp; MISIS Moskva</span>
        </div>
        <div className="p-6 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-2 hover:shadow-md transition-all">
          <span className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-bold block uppercase tracking-wider">Hội thảo sắp tới</span>
          <strong className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-slate-200 block font-mono">3</strong>
          <span className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-bold block">Diễn đàn Biển 2026</span>
        </div>
      </div>

      {/* Stepper Pipeline - Spacious */}
      <div className="p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            Quy trình Hợp tác Nghiên cứu Song phương
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Các bước chuẩn từ ý tưởng khoa học đến dự án chính thức</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center text-xs md:text-sm font-bold pt-2">
          <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
            <span className="block text-sm font-black mb-1">01</span>
            <span>Ý tưởng nghiên cứu</span>
          </div>
          <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
            <span className="block text-sm font-black mb-1">02</span>
            <span>Ghép Co-PI LB Nga</span>
          </div>
          <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-md">
            <span className="block text-sm font-black mb-1">03</span>
            <span>Hoàn thiện Đề xuất</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <span className="block text-sm font-black mb-1">04</span>
            <span>Hội đồng Phản biện</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <span className="block text-sm font-black mb-1">05</span>
            <span>Triển khai Dự án</span>
          </div>
        </div>
      </div>

      {/* Tabs & Proposals List */}
      <div className="p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Tất cả ({MOCK_PROPOSALS.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('proposals')}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'proposals'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Đề xuất chờ duyệt (2)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'active'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Dự án đang chạy (1)
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredProposals.map((item) => (
            <div key={item.id} className="py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 p-5 rounded-3xl transition-all">
              <div className="space-y-2 max-w-4xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    item.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : item.status === 'UNDER_REVIEW'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                  }`}>
                    {item.statusLabel}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">{item.code}</span>
                  <span className="text-xs text-blue-700 dark:text-blue-400 font-bold">· {item.field}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Chủ nhiệm VN: <strong className="text-slate-900 dark:text-white">{item.vnPi}</strong> ({item.vnOrg}) ↔ Co-PI Nga: <strong className="text-slate-900 dark:text-white">{item.ruPi}</strong> ({item.ruOrg})
                </p>
                {Boolean(item.progressPercent) && (
                  <div className="mt-3 flex items-center gap-4">
                    <div className="w-64 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${item.progressPercent}%` }} />
                    </div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{item.progressPercent}% hoàn thành</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => showToast(`Mở chi tiết đề xuất ${item.code}`)}
                  className="px-5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-all"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
