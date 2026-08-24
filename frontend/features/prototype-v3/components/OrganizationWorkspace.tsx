"use client";

import React, { useState } from 'react';
import { WorkspacePreviewNotice } from './WorkspacePreviewNotice';

interface EndorsementItem {
  id: string;
  title: string;
  lead: string;
  partnerOrg: string;
  facilities: string;
  isEndorsed: boolean;
}

export function OrganizationWorkspace() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'endorsed'>('all');
  const [items, setItems] = useState<EndorsementItem[]>([
    {
      id: 'end-01',
      title: 'Nghiên cứu độ bền và biến tính bề mặt vật liệu Nano-composite trong môi trường biển nhiệt đới',
      lead: 'GS.TS. Trần Đình Nam (Viện Hải dương học)',
      partnerOrg: 'Viện Sinh học Biển FEB RAS Vladivostok',
      facilities: 'Trạm thử nghiệm biển Hòn Mun & Phòng Thí nghiệm Ăn mòn Biển VAST',
      isEndorsed: false
    },
    {
      id: 'end-02',
      title: 'Phát triển hệ thống cảm biến quang sợi đo biến dạng công trình ngầm ven biển',
      lead: 'PGS.TS. Lê Hoài Thanh (Viện Vật lý VAST)',
      partnerOrg: 'MISIS Moskva',
      facilities: 'Phòng Thí nghiệm Quang tử học & Thiết bị đo phổ OTDR',
      isEndorsed: false
    },
    {
      id: 'end-03',
      title: 'Hệ thống trao đổi dữ liệu hải dương học và giám sát đa dạng sinh học biển Đông',
      lead: 'TS. Nguyễn Văn Hùng (Viện Tài nguyên Môi trường Biển)',
      partnerOrg: 'Viện Hải dương học Thái Bình Dương (POI RAS)',
      facilities: 'Tàu nghiên cứu khoa học biển & Trung tâm Tích hợp Dữ liệu',
      isEndorsed: true
    }
  ]);

  const [selectedItemForModal, setSelectedItemForModal] = useState<EndorsementItem | null>(null);
  const [toastText, setToastText] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 2500);
  };

  const handleEndorse = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isEndorsed: true } : item))
    );
    setSelectedItemForModal(null);
    showToast('Đã mô phỏng bước xác nhận bảo trợ; chưa ghi dữ liệu lên backend.');
  };

  const filteredItems = items.filter((item) => {
    if (activeTab === 'pending') return !item.isEndorsed;
    if (activeTab === 'endorsed') return item.isEndorsed;
    return true;
  });

  return (
    <div className="w-full px-6 md:px-10 lg:px-12 py-8 space-y-8">
      <WorkspacePreviewNotice scope="không gian Tổ chức" />

      {/* Toast Notification */}
      {toastText && (
        <div role="status" aria-live="polite" className="fixed bottom-6 left-4 right-4 z-50 rounded-2xl border border-blue-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl animate-fade-in sm:left-auto sm:right-6 sm:max-w-md">
          <span className="mr-2 text-xs font-black uppercase tracking-wider text-blue-300">UI Preview</span>
          {toastText}
        </div>
      )}

      {/* Endorsement Confirmation Modal */}
      {selectedItemForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div role="dialog" aria-modal="true" aria-labelledby="endorsement-preview-title" className="bg-[#fffdf8] dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <h3 id="endorsement-preview-title" className="text-xl font-bold text-slate-900 dark:text-white">Xem trước Xác nhận Bảo trợ Đề xuất Song phương</h3>
              <button
                type="button"
                aria-label="Đóng cửa sổ xem trước xác nhận bảo trợ"
                onClick={() => setSelectedItemForModal(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-5 text-sm">
              <p className="text-slate-700 dark:text-slate-300 font-medium text-base">
                Xác nhận <strong>Viện Hàn lâm KH&amp;CN Việt Nam (VAST)</strong> đồng ý bảo trợ tư cách pháp nhân và hạ tầng kỹ thuật cho đề xuất:
              </p>
              <div className="p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-950 dark:text-teal-200 space-y-1">
                <strong className="block text-base md:text-lg font-bold">{selectedItemForModal.title}</strong>
                <span className="block text-slate-600 dark:text-slate-300 text-sm">Chủ nhiệm: {selectedItemForModal.lead}</span>
                <span className="block text-slate-600 dark:text-slate-300 text-sm">Đối tác: {selectedItemForModal.partnerOrg}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 space-y-2 text-sm leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-white block">Cam kết nguồn lực chính thức:</span>
                <ul className="space-y-2">
                  <li className="flex gap-2"><span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-teal-600" />Đảm bảo sử dụng: {selectedItemForModal.facilities}.</li>
                  <li className="flex gap-2"><span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-teal-600" />Đảm bảo tối thiểu 40% quỹ thời gian làm việc của chủ nhiệm tại phòng thí nghiệm chuyên ngành.</li>
                  <li className="flex gap-2"><span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-teal-600" />Hỗ trợ thủ tục pháp lý cho đoàn chuyên gia Nga sang làm việc tại Việt Nam.</li>
                </ul>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedItemForModal(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleEndorse(selectedItemForModal.id)}
                className="px-6 py-2.5 rounded-xl bg-teal-700 text-white font-bold text-sm hover:bg-teal-800 shadow-md"
              >
                Mô phỏng xác nhận bảo trợ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Ribbon */}
      <div className="p-4 md:p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-teal-950 dark:text-teal-200 text-sm font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-teal-600 shadow-[0_0_10px_rgba(20,184,166,0.7)]" />
          <span className="text-sm md:text-base font-bold">Ban Hợp tác Quốc tế · Viện Hàn lâm KH&amp;CN Việt Nam (VAST)</span>
        </div>
        <span className="text-slate-600 dark:text-slate-400 font-medium text-xs md:text-sm">Phạm vi: Đơn vị Chủ trì &amp; Bảo trợ cơ sở vật chất</span>
      </div>

      {/* Hero */}
      <div className="p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-2">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
          Thẩm định năng lực tổ chức
        </span>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-snug">
          Hàng đợi Xác nhận Bảo trợ Đề xuất Song phương
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-4xl">
          Xác nhận tư cách chủ trì, cam kết hạ tầng phòng thí nghiệm và thời gian nghiên cứu của cán bộ VAST tham gia các đề tài hợp tác với Viện Hàn lâm Khoa học LB Nga (RAS).
        </p>
      </div>

      {/* Main Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Tất cả đề xuất ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'pending'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Chờ xác nhận ({items.filter((i) => !i.isEndorsed).length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('endorsed')}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'endorsed'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Đã bảo trợ ({items.filter((i) => i.isEndorsed).length})
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredItems.map((item) => (
            <div key={item.id} className="py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 p-5 rounded-3xl transition-all">
              <div className="space-y-2 max-w-4xl">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    item.isEndorsed
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}>
                    {item.isEndorsed ? 'Đã bảo trợ (Endorsed)' : 'Chờ xác nhận'}
                  </span>
                  <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Đối tác: <strong>{item.partnerOrg}</strong></span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Chủ nhiệm: <strong className="text-slate-900 dark:text-white">{item.lead}</strong></p>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Cơ sở cam kết: {item.facilities}</p>
              </div>

              <div className="flex gap-3 shrink-0">
                {!item.isEndorsed ? (
                  <button
                    type="button"
                    onClick={() => setSelectedItemForModal(item)}
                    className="px-6 py-3 rounded-2xl bg-teal-700 text-white font-bold text-sm hover:bg-teal-800 shadow-md transition-all"
                  >
                    Xem trước bước xác nhận
                  </button>
                ) : (
                  <span className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm">
                    Trạng thái mẫu · Đã bảo trợ
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
