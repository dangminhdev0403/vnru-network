"use client";

import React, { useState } from 'react';
import { ConsortiumSlot } from '../types';
import { INITIAL_2PLUS2_SLOTS, RU_ENTERPRISE_CANDIDATES } from '../mock-data';

export function EnterpriseWorkspace() {
  const [slots, setSlots] = useState<ConsortiumSlot[]>(INITIAL_2PLUS2_SLOTS);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  const filledCount = slots.filter((s) => s.isFilled).length;
  const isComplete = filledCount === 4;

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 2500);
  };

  const handleSelectPartner = (candidate: typeof RU_ENTERPRISE_CANDIDATES[0]) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.type === 'ru-ent'
          ? {
              ...slot,
              orgName: candidate.name,
              deptName: candidate.dept,
              leadName: candidate.lead,
              isFilled: true
            }
          : slot
      )
    );
    setIsSlotModalOpen(false);
    showToast(`Đã ghép ${candidate.name} vào vị trí thứ 4 của Liên danh 2+2`);
  };

  return (
    <div className="w-full px-6 md:px-10 lg:px-12 py-8 space-y-8">
      {/* Toast Notification */}
      {toastText && (
        <div className="fixed bottom-8 right-8 z-50 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white shadow-2xl animate-fade-in border border-slate-700">
          ✓ {toastText}
        </div>
      )}

      {/* Partner Selector Modal */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#fffdf8] dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Chọn Doanh nghiệp đối tác Liên bang Nga</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Danh mục doanh nghiệp công nghệ cao sẵn sàng tham gia Liên danh 2+2</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSlotModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-4 text-sm max-h-[70vh] overflow-y-auto">
              {RU_ENTERPRISE_CANDIDATES.map((c) => (
                <div
                  key={c.name}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <strong className="block text-base font-bold text-slate-900 dark:text-white">{c.name}</strong>
                    <span className="block text-slate-600 dark:text-slate-300 text-xs md:text-sm">{c.dept} · Phụ trách: <strong>{c.lead}</strong></span>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{c.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectPartner(c)}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-sm hover:bg-amber-700 shrink-0 shadow-sm transition-all self-start sm:self-auto"
                  >
                    Chọn đối tác
                  </button>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSlotModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Ribbon */}
      <div className="p-4 md:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200 text-sm font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.7)]" />
          <span className="text-sm md:text-base font-bold">Mô hình Liên danh 2+2 (Bilateral 2+2 Consortium)</span>
        </div>
        <span className="text-slate-600 dark:text-slate-400 font-medium text-xs md:text-sm">Mã liên danh: <strong className="font-mono">#C-2026-NANO-02</strong></span>
      </div>

      {/* Hero */}
      <div className="p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 mb-2">
              Liên danh Nghiên cứu &amp; Ứng dụng #C-2026-NANO-02
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-snug">
              Ứng dụng Sơn phủ Nano Composite Chống Ăn mòn Biển cho Công trình Dầu khí &amp; Tàu biển
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-4xl leading-relaxed">
              Cấu trúc chuẩn yêu cầu 4 đối tác độc lập: 1 Viện/Trường VN + 1 Doanh nghiệp VN + 1 Viện/Trường Nga + 1 Doanh nghiệp Nga để thử nghiệm pilot và thương mại hóa sản phẩm.
            </p>
          </div>
          <span className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold shrink-0 self-start border ${
            isComplete
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700'
          }`}>
            {isComplete ? 'ĐỦ 4/4 VỊ TRÍ 2+2' : 'ĐANG HOÀN THIỆN CẤU TRÚC (3/4)'}
          </span>
        </div>
      </div>

      {/* 4 Slots Grid - Fluid Widescreen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* VN Side */}
        <div className="p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-card-border pb-4">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">🇻🇳 Phía Việt Nam</h3>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              2/2 Vị trí đủ
            </span>
          </div>

          <div className="space-y-4">
            {slots.filter((s) => s.country === 'VN').map((slot) => (
              <div key={slot.type} className="p-5 rounded-2xl border border-card-border bg-slate-50/80 dark:bg-slate-800/50 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-xs uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">{slot.typeLabel}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-bold">
                    Đã xác nhận
                  </span>
                </div>
                <strong className="block text-base md:text-lg font-bold text-slate-900 dark:text-white">{slot.orgName}</strong>
                <span className="block text-sm text-slate-600 dark:text-slate-300">{slot.deptName} · Phụ trách: <strong>{slot.leadName}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* RU Side */}
        <div className="p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-card-border pb-4">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">🇷🇺 Phía Liên bang Nga</h3>
            <span className={`text-xs font-black px-3 py-1 rounded-full ${
              slots.find((s) => s.type === 'ru-ent')?.isFilled
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
            }`}>
              {slots.find((s) => s.type === 'ru-ent')?.isFilled ? '2/2 Vị trí đủ' : '1/2 Vị trí'}
            </span>
          </div>

          <div className="space-y-4">
            {slots.filter((s) => s.country === 'RU').map((slot) => {
              if (slot.isFilled) {
                return (
                  <div key={slot.type} className="p-5 rounded-2xl border border-card-border bg-slate-50/80 dark:bg-slate-800/50 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-xs uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">{slot.typeLabel}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-bold">
                        Đã xác nhận
                      </span>
                    </div>
                    <strong className="block text-base md:text-lg font-bold text-slate-900 dark:text-white">{slot.orgName}</strong>
                    <span className="block text-sm text-slate-600 dark:text-slate-300">{slot.deptName} · Phụ trách: <strong>{slot.leadName}</strong></span>
                  </div>
                );
              }
              return (
                <button
                  type="button"
                  key={slot.type}
                  onClick={() => setIsSlotModalOpen(true)}
                  className="w-full text-left p-6 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer space-y-3 transition-all block"
                >
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-xs uppercase font-black text-amber-800 dark:text-amber-300 tracking-wider">{slot.typeLabel}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 text-xs font-bold">
                      Cần bổ sung
                    </span>
                  </div>
                  <strong className="block text-base font-bold text-amber-900 dark:text-amber-200">Chưa ghép doanh nghiệp đối tác LB Nga</strong>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Nhấp vào đây để chọn doanh nghiệp từ danh bạ đối tác Nga</p>
                  <span className="inline-block px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs md:text-sm shadow-sm mt-1">
                    + Tìm &amp; Ghép Doanh nghiệp Nga ngay
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress & Signing Action */}
      <div className="p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3 max-w-3xl w-full">
          <div className="flex justify-between items-center text-sm md:text-base font-bold">
            <span className="text-slate-900 dark:text-white">Tiến độ hoàn thiện cấu trúc Liên danh 2+2</span>
            <span className="text-amber-800 dark:text-amber-400 font-mono">{filledCount}/4 Vị trí ({filledCount * 25}%)</span>
          </div>
          <div className="w-full h-4 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-600' : 'bg-amber-600'}`}
              style={{ width: `${filledCount * 25}%` }}
            />
          </div>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
            {isComplete
              ? '✓ Cấu trúc liên danh đã hoàn chỉnh 4 bên. Đã đủ điều kiện nộp hồ sơ xin cấp phép liên danh cấp quốc gia.'
              : '⚠️ Hãy bổ sung vị trí Doanh nghiệp Nga để hoàn tất điều kiện 2+2.'}
          </p>
        </div>

        <button
          type="button"
          disabled={!isComplete}
          onClick={() => showToast('Đã khởi tạo thỏa thuận pháp lý liên danh 2+2 bốn bên')}
          className="px-8 py-4 rounded-2xl bg-amber-600 text-white font-bold text-sm md:text-base hover:bg-amber-700 shadow-md disabled:opacity-40 shrink-0 transition-all"
        >
          Ký Thỏa thuận Liên danh 2+2
        </button>
      </div>
    </div>
  );
}
