"use client";

import React, { useState } from 'react';

export function LeadershipWorkspace() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 2500);
  };

  return (
    <div className="w-full px-6 md:px-10 lg:px-12 py-8 space-y-8">
      {/* Toast Notification */}
      {toastText && (
        <div className="fixed bottom-8 right-8 z-50 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white shadow-2xl animate-fade-in border border-slate-700">
          ✓ {toastText}
        </div>
      )}

      {/* Strategic Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#fffdf8] dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Ủy ban Hợp tác KH&amp;CN Việt – Nga</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Báo cáo Phân tích Tín hiệu Hợp tác Nghiên cứu Quý I/2026</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-6 text-sm max-h-[70vh] overflow-y-auto">
              <div className="p-6 rounded-2xl bg-card-surface-area border border-card-border shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="space-y-1">
                  <small className="text-slate-500 dark:text-slate-400 text-xs md:text-sm block">Đề xuất thụ lý</small>
                  <strong className="text-3xl lg:text-4xl font-extrabold text-blue-900 dark:text-blue-400 font-mono">48 hồ sơ</strong>
                </div>
                <div className="space-y-1">
                  <small className="text-slate-500 dark:text-slate-400 text-xs md:text-sm block">Bài báo ISI/Scopus</small>
                  <strong className="text-3xl lg:text-4xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">142 bài</strong>
                </div>
                <div className="space-y-1">
                  <small className="text-slate-500 dark:text-slate-400 text-xs md:text-sm block">Liên danh 2+2</small>
                  <strong className="text-3xl lg:text-4xl font-extrabold text-amber-700 dark:text-amber-400 font-mono">12 nhóm</strong>
                </div>
              </div>

              <div className="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                <strong className="text-base font-bold text-slate-900 dark:text-white block">Nhận định chiến lược &amp; Tham mưu chính sách:</strong>
                <p>
                  1. <strong>Lĩnh vực Biển &amp; Vật liệu tiên tiến:</strong> Tiếp tục là mũi nhọn hợp tác với số lượng bài báo ISI Q1 chiếm 62% tổng số công bố chung. Đợt khảo sát bằng tàu Viện sĩ Oparin dự kiến diễn ra vào Quý III/2026.
                </p>
                <p>
                  2. <strong>Cơ chế Liên danh 2+2:</strong> Mô hình liên danh doanh nghiệp - viện nghiên cứu đã thu hút sự tham gia tích cực từ Viettel R&amp;D, EVN phía Việt Nam và Rostec, Biocad phía LB Nga.
                </p>
                <p>
                  3. <strong>Khuyến nghị chính sách:</strong> Đơn giản hóa thủ tục cấp giấy phép xuất nhập khẩu mẫu phẩm sinh học biển và thiết bị cảm biến chuyên dụng phục vụ đo kiểm thực địa.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Đang chuẩn bị bản in PDF báo cáo tham mưu...');
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-900 text-white font-bold text-sm hover:bg-blue-950 shadow-md transition-all"
              >
                In / Xuất PDF báo cáo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Ribbon */}
      <div className="p-4 md:p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-slate-700 dark:bg-slate-300 shadow-[0_0_10px_rgba(100,116,139,0.7)]" />
          <span className="text-sm md:text-base font-bold">Ban Chỉ đạo Hợp tác KH&amp;CN Việt Nam – Liên bang Nga</span>
        </div>
        <span className="text-slate-600 dark:text-slate-400 font-medium text-xs md:text-sm">Bảng điều khiển Giám sát Vĩ mô (Read-only Strategic Analytics)</span>
      </div>

      {/* Hero */}
      <div className="p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-2">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          Dữ liệu phân tích chiến lược
        </span>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-snug">
          Bản đồ Tín hiệu Hợp tác Khoa học &amp; Công nghệ Song phương
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-4xl leading-relaxed">
          Trực quan hóa xu hướng nghiên cứu chung, mạng lưới đồng tác giả giữa VAST, ĐHQG Hà Nội/TP.HCM và Viện Hàn lâm Khoa học Nga (RAS), MIPT, Skoltech.
        </p>
      </div>

      {/* 3 Strategic Task Cards - Widescreen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">Báo cáo Quý I/2026</span>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Tổng quan Đề xuất &amp; Dự án Song phương</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Phân tích 48 đề xuất mới, tỉ lệ phê duyệt theo từng lĩnh vực trọng điểm và phân bổ ngân sách song phương.</p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-card-border">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-bold">Sẵn sàng xuất</span>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-900 text-white font-bold text-sm hover:bg-blue-950 shadow-sm transition-all"
            >
              Xem &amp; Xuất PDF
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">Mạng lưới Chuyên gia</span>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Bản đồ Kết nối Nhà khoa học Việt – Nga</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Đồ thị đồng tác giả và quan hệ hợp tác trực tiếp giữa 320 nhà khoa học đầu ngành hai nước.</p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-card-border">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 text-xs font-bold">Đồ thị tri thức</span>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Mở báo cáo
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">Thương mại hóa</span>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Hiệu quả Chuyển giao &amp; Liên danh 2+2</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Thống kê 12 liên danh 2+2 đang hình thành thử nghiệm pilot công nghệ và ứng dụng thực tiễn.</p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-card-border">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-xs font-bold">TRL 5 - 7</span>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Mở báo cáo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
