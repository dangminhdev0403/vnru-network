"use client";

import React, { useState } from 'react';
import { WorkspacePreviewNotice } from './WorkspacePreviewNotice';
import { commitDemoMutation } from '../demo-backend';
import { DemoActivityPanel } from './DemoActivityPanel';
import { WorkspaceSectionSync } from './WorkspaceSectionSync';

export function ReviewerWorkspace() {
  const [novelty, setNovelty] = useState(8.5);
  const [methodology, setMethodology] = useState(8.0);
  const [feasibility, setFeasibility] = useState(9.0);
  const [impact, setImpact] = useState(8.5);
  const [commentText, setCommentText] = useState(
    'Đề xuất có luận cứ khoa học rất chặt chẽ, kết hợp nhuần nhuyễn giữa viện nghiên cứu phân viện Viễn Đông RAS và viện chuyên ngành VAST. Phương pháp biến tính bề mặt hạt nano silica có tính khả thi cao.'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitDemoReview = async () => {
    setIsSubmitting(true);
    await commitDemoMutation('reviewer', 'Đã nộp bản phản biện', `RU-VN-2026-BIO-08 · ${totalScore.toFixed(2)}/10`);
    setIsConfirmModalOpen(false);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  // Dynamic total score calculation
  const totalScore = novelty * 0.3 + methodology * 0.25 + feasibility * 0.3 + impact * 0.15;

  let gradeBadge = { label: 'Khuyến nghị duyệt (Xuất sắc)', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' };
  if (totalScore < 7.0) {
    gradeBadge = { label: 'Không khuyến nghị (Chưa đạt)', color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300 dark:border-red-700' };
  } else if (totalScore < 8.5) {
    gradeBadge = { label: 'Đạt yêu cầu (Cần chỉnh sửa nhỏ)', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700' };
  }

  return (
    <div className="w-full px-6 md:px-10 lg:px-12 py-8 space-y-8">
      <React.Suspense fallback={null}><WorkspaceSectionSync /></React.Suspense>
      <WorkspacePreviewNotice scope="không gian Phản biện" />

      {/* Submit Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div role="dialog" aria-modal="true" aria-labelledby="review-submit-title" className="bg-[#fffdf8] dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <h3 id="review-submit-title" className="text-xl font-bold text-slate-900 dark:text-white">Xem trước bước nộp đánh giá phản biện</h3>
              <button
                type="button"
                aria-label="Đóng cửa sổ xem trước bước nộp"
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-2xl font-bold"
              >
                <span aria-hidden="true" className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-4 text-sm">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                Bạn đang xem trước bản nhận xét &amp; điểm số phản biện cho đề xuất song phương mã số{' '}
                <strong className="font-mono text-purple-900 dark:text-purple-300">#RU-VN-2026-BIO-08</strong> với tổng điểm{' '}
                <strong className="text-purple-700 dark:text-purple-400 text-xl font-mono">{totalScore.toFixed(2)}/10</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-950 dark:text-purple-200 leading-relaxed text-sm">
                <strong>Quy chuẩn bảo mật ẩn danh hai chiều:</strong> Điểm số và nhận xét sẽ được chuyển trực tiếp tới Hội đồng Khoa học Liên Chính phủ, không tiết lộ danh tính của chuyên gia phản biện.
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Quay lại kiểm tra
              </button>
              <button
                type="button"
                onClick={() => void submitDemoReview()}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-sm hover:bg-purple-800 shadow-md disabled:cursor-wait disabled:opacity-60"
              >
                Mô phỏng nộp đánh giá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Ribbon */}
      <div data-workspace-view="overview" tabIndex={-1} className="scroll-mt-24 p-4 md:p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-950 dark:text-purple-200 text-sm font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs outline-none">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.7)]" />
          <span className="text-sm md:text-base font-bold">Hội đồng Phản biện Độc lập · Hồ sơ #RU-VN-2026-BIO-08</span>
        </div>
        <span className="text-slate-600 dark:text-slate-400 font-medium text-xs md:text-sm">Bảo mật ẩn danh tuyệt đối (Double-blind Peer Review)</span>
      </div>

      {/* Hero Dossier Card */}
      <section data-workspace-view="assignments" tabIndex={-1} className="scroll-mt-24 p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-3 outline-none">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
          Hồ sơ phản biện song phương
        </span>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-snug">
          Nghiên cứu độ bền và biến tính bề mặt vật liệu Nano-composite trong môi trường biển nhiệt đới
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
          Lĩnh vực: <strong className="text-slate-900 dark:text-white">Khoa học Vật liệu &amp; Hóa lý Biển</strong> · Mã phân công: <code className="font-bold text-purple-700 dark:text-purple-400 font-mono">#RU-VN-2026-BIO-08</code> · Hạn phản biện: <strong>30/08/2026</strong>
        </p>
      </section>

      {/* Grid: Rubric Scoring vs Dossier Sidebar - Fluid Widescreen */}
      <section data-workspace-view="evaluation" tabIndex={-1} className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start outline-none">
        {/* Rubric Form (8 Cols) */}
        <div className="lg:col-span-8 p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Phiếu Đánh giá Rubric Chuyên gia</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kéo các thanh trượt điểm số (thang 10) tương ứng từng tiêu chí</p>
            </div>
            <span className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold border ${gradeBadge.color} self-start sm:self-auto`}>
              {gradeBadge.label}
            </span>
          </div>

          {/* Criteria 1 */}
          <div className="p-5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-3">
            <div className="flex justify-between items-center text-sm md:text-base font-bold">
              <span className="text-slate-900 dark:text-white">1. Tính mới và giá trị khoa học (Trọng số 30%)</span>
              <span className="text-purple-900 dark:text-purple-300 font-mono text-lg font-extrabold">{novelty.toFixed(1)} / 10</span>
            </div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Đánh giá tính tiên phong của cấu trúc nano composite và cơ chế ức chế ăn mòn muối biển.</p>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={novelty}
              onChange={(e) => setNovelty(Number.parseFloat(e.target.value))}
              className="w-full accent-purple-600 h-3 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Criteria 2 */}
          <div className="p-5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-3">
            <div className="flex justify-between items-center text-sm md:text-base font-bold">
              <span className="text-slate-900 dark:text-white">2. Phương pháp nghiên cứu &amp; Thiết bị đo kiểm (Trọng số 25%)</span>
              <span className="text-purple-900 dark:text-purple-300 font-mono text-lg font-extrabold">{methodology.toFixed(1)} / 10</span>
            </div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Độ phù hợp của quy trình thử nghiệm gia tốc môi trường biển và kính hiển vi điện tử SEM/TEM.</p>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={methodology}
              onChange={(e) => setMethodology(Number.parseFloat(e.target.value))}
              className="w-full accent-purple-600 h-3 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Criteria 3 */}
          <div className="p-5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-3">
            <div className="flex justify-between items-center text-sm md:text-base font-bold">
              <span className="text-slate-900 dark:text-white">3. Tính khả thi &amp; Bổ trợ hợp tác song phương (Trọng số 30%)</span>
              <span className="text-purple-900 dark:text-purple-300 font-mono text-lg font-extrabold">{feasibility.toFixed(1)} / 10</span>
            </div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Sự phối hợp thế mạnh: Phía Nga mạnh về công nghệ tổng hợp nano, phía VN mạnh về trạm quan trắc biển thực địa.</p>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={feasibility}
              onChange={(e) => setFeasibility(Number.parseFloat(e.target.value))}
              className="w-full accent-purple-600 h-3 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Criteria 4 */}
          <div className="p-5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-3">
            <div className="flex justify-between items-center text-sm md:text-base font-bold">
              <span className="text-slate-900 dark:text-white">4. Tiềm năng công bố quốc tế &amp; Đào tạo cán bộ trẻ (Trọng số 15%)</span>
              <span className="text-purple-900 dark:text-purple-300 font-mono text-lg font-extrabold">{impact.toFixed(1)} / 10</span>
            </div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Kế hoạch công bố bài báo ISI/Scopus Q1/Q2 và hướng dẫn nghiên cứu sinh chung.</p>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={impact}
              onChange={(e) => setImpact(Number.parseFloat(e.target.value))}
              className="w-full accent-purple-600 h-3 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Live Total Score Box */}
          <div className="p-6 rounded-3xl bg-purple-100 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
            <div>
              <strong className="text-sm md:text-base uppercase tracking-wider text-purple-950 dark:text-purple-200 block">Tổng điểm quy đổi Hội đồng</strong>
              <small className="text-slate-600 dark:text-slate-400 text-xs md:text-sm">Tự động tổng hợp từ 4 nhóm tiêu chí trọng số</small>
            </div>
            <strong className="text-4xl lg:text-5xl font-extrabold font-mono text-slate-900 dark:text-white">{totalScore.toFixed(2)} / 10</strong>
          </div>

          {/* Comment Box */}
          <div>
            <label htmlFor="reviewer-comment-main" className="text-sm font-bold text-slate-800 dark:text-slate-200 block mb-2">
              Nhận xét chi tiết của chuyên gia phản biện:
            </label>
            <textarea
              id="reviewer-comment-main"
              rows={5}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 text-sm md:text-base text-slate-900 dark:text-white bg-white dark:bg-slate-800 font-medium leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-card-border">
            {isSubmitted ? (
              <span className="px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-sm font-bold">
                Đã cập nhật trạng thái bản xem trước · Chưa nộp backend
              </span>
            ) : (
              <span className="text-sm text-slate-500 dark:text-slate-400">Trạng thái: Đang soạn thảo bản nhận xét</span>
            )}
            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={isSubmitted}
              className="px-6 py-3 rounded-2xl bg-purple-700 text-white font-bold text-sm md:text-base hover:bg-purple-800 shadow-md disabled:opacity-50 transition-all"
            >
              Xem trước bước nộp
            </button>
          </div>
        </div>

        {/* Anonymized Dossier Summary (4 Cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-5 text-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-card-border pb-3">
              Hồ sơ Đề xuất (Bản tóm tắt)
            </h3>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block font-bold text-xs uppercase tracking-wider">Thời gian thực hiện</span>
              <strong className="text-slate-800 dark:text-slate-100 text-base">36 tháng (2026 – 2029)</strong>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block font-bold text-xs uppercase tracking-wider">Sản phẩm khoa học dự kiến</span>
              <strong className="text-slate-800 dark:text-slate-100 text-base">03 bài báo ISI Q1/Q2, 01 sáng chế giải pháp hữu ích</strong>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block font-bold text-xs uppercase tracking-wider">Giao lưu học thuật</span>
              <strong className="text-slate-800 dark:text-slate-100 text-base">04 đợt công tác trao đổi chuyên gia 2 chiều</strong>
            </div>

            <div className="pt-4 border-t border-card-border">
              <button
                type="button"
                className="w-full py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-xs"
              >
                <span aria-hidden="true" className="material-symbols-outlined mr-2 align-middle text-lg">description</span>
                Toàn văn đề cương (PDF 32 trang)
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8 rounded-3xl bg-[#231c3a] text-white border border-purple-900/40 shadow-lg text-sm space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-purple-300">Nguyên tắc Đánh giá Độc lập</span>
            <h4 className="text-base font-bold">Ranh giới Chuyên môn</h4>
            <p className="text-purple-200 text-xs md:text-sm leading-relaxed">
              Chuyên gia phản biện không được cấp quyền chỉnh sửa hồ sơ, không nhìn thấy điểm số của chuyên gia khác và không can thiệp vào quyết định phê duyệt cuối cùng.
            </p>
          </div>
        </aside>
      </section>
      <DemoActivityPanel scope="reviewer" />
    </div>
  );
}
