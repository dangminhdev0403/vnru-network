"use client";

import React, { useState } from 'react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  org: string;
  role: string;
  status: string;
  lastActive: string;
}

export function GovernanceWorkspace() {
  const [users, setUsers] = useState<UserRecord[]>([
    {
      id: 'u-1',
      name: 'GS.TS. Trần Đình Nam',
      email: 'nguyen.vana@vast.vn',
      org: 'Viện Hàn lâm KH&CN VN (VAST)',
      role: 'RESEARCHER',
      status: 'Active · Keycloak',
      lastActive: '2 giờ trước (Hà Nội)'
    },
    {
      id: 'u-2',
      name: 'Prof. Alexei Morozov',
      email: 'a.morozov@dvo.ru',
      org: 'FEB RAS Vladivostok',
      role: 'RESEARCHER',
      status: 'Active · Keycloak',
      lastActive: '15 phút trước (Vladivostok)'
    },
    {
      id: 'u-3',
      name: 'Chuyên gia Phản biện #07',
      email: 'reviewer07@vnru-eval.gov.vn',
      org: 'Hội đồng Khoa học Vật liệu Biển',
      role: 'REVIEWER',
      status: 'Active · TOTP MFA',
      lastActive: 'Vừa xong (Ẩn danh)'
    },
    {
      id: 'u-4',
      name: 'Ban Hợp tác Quốc tế VAST',
      email: 'htqt@vast.vn',
      org: 'Viện Hàn lâm KH&CN VN',
      role: 'ORGANIZATION_REP',
      status: 'Active',
      lastActive: '1 ngày trước'
    },
    {
      id: 'u-5',
      name: 'KS. Lê Anh Tuấn',
      email: 'tuanla@viettel.com.vn',
      org: 'Tập đoàn Viettel (Viettel R&D)',
      role: 'ENTERPRISE_REP',
      status: 'Active',
      lastActive: '3 giờ trước'
    }
  ]);

  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [newRole, setNewRole] = useState('RESEARCHER');
  const [toastText, setToastText] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 2500);
  };

  const handleSaveRole = () => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole } : u))
    );
    setSelectedUser(null);
    showToast(`Đã cập nhật vai trò mới cho ${selectedUser.name}`);
  };

  return (
    <div className="w-full px-6 md:px-10 lg:px-12 py-8 space-y-8">
      {/* Toast Notification */}
      {toastText && (
        <div className="fixed bottom-8 right-8 z-50 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white shadow-2xl animate-fade-in border border-slate-700">
          ✓ {toastText}
        </div>
      )}

      {/* Role Assignment Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#fffdf8] dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Phân quyền Tài khoản Quản trị</h3>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-5 text-sm">
              <div>
                <label htmlFor="user-info-readonly" className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                  Tên người dùng &amp; Email:
                </label>
                <input
                  id="user-info-readonly"
                  type="text"
                  readOnly
                  value={`${selectedUser.name} (${selectedUser.email})`}
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 font-medium text-slate-700 dark:text-slate-300 text-sm"
                />
              </div>
              <div>
                <label htmlFor="governance-role-select" className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                  Gán vai trò mới (Role):
                </label>
                <select
                  id="governance-role-select"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
                >
                  <option value="RESEARCHER">RESEARCHER (Nhà nghiên cứu)</option>
                  <option value="REVIEWER">REVIEWER (Hội đồng phản biện)</option>
                  <option value="ORGANIZATION_REP">ORGANIZATION_REP (Đại diện tổ chức VAST)</option>
                  <option value="ENTERPRISE_REP">ENTERPRISE_REP (Đại diện doanh nghiệp 2+2)</option>
                  <option value="LEADERSHIP_VIEWER">LEADERSHIP_VIEWER (Lãnh đạo chiến lược)</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                className="px-6 py-2.5 rounded-xl bg-rose-700 text-white font-bold text-sm hover:bg-rose-800 shadow-md transition-all"
              >
                Lưu phân quyền
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Ribbon */}
      <div className="p-4 md:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-950 dark:text-rose-200 text-sm font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.7)]" />
          <span className="text-sm md:text-base font-bold">Khu vực Quản trị Hệ thống (Governance Area)</span>
        </div>
        <span className="text-slate-600 dark:text-slate-400 font-medium text-xs md:text-sm">Tách biệt hoàn toàn khỏi Workspace thành viên</span>
      </div>

      {/* Hero */}
      <div className="p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-2">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300">
          Identity &amp; Access Governance
        </span>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-snug">
          Quản trị Danh tính OIDC &amp; Ma trận Phân quyền IAM
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-4xl leading-relaxed">
          Điều phối tài khoản nhà khoa học, hội đồng phản biện, đại diện viện/trường và doanh nghiệp. Đảm bảo tuân thủ nguyên tắc Least Privilege và phân bổ quyền theo năng lực thẩm định.
        </p>
      </div>

      {/* Users Table Card - Full Width */}
      <div className="p-6 md:p-8 rounded-3xl bg-card-surface-area border border-card-border shadow-sm space-y-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-4">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Danh sách Tài khoản &amp; Vai trò Hệ thống</h2>
          <button
            type="button"
            onClick={() => showToast('Mở form thêm người dùng mới')}
            className="px-5 py-2.5 rounded-2xl bg-rose-700 text-white font-bold text-sm hover:bg-rose-800 shadow-sm transition-all self-start sm:self-auto"
          >
            + Thêm người dùng mới
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-card-border bg-slate-50/80 dark:bg-slate-800/50 text-xs uppercase font-black tracking-wider text-slate-500 dark:text-slate-400">
                <th className="p-4">Họ tên &amp; Email</th>
                <th className="p-4">Cơ quan / Đơn vị</th>
                <th className="p-4">Vai trò được gán (Role)</th>
                <th className="p-4">Trạng thái OIDC</th>
                <th className="p-4">Phiên hoạt động</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-all">
                  <td className="p-4">
                    <strong className="block text-slate-900 dark:text-white text-base">{u.name}</strong>
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-mono">{u.email}</span>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">{u.org}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs md:text-sm text-slate-500 dark:text-slate-400">{u.lastActive}</td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUser(u);
                        setNewRole(u.role);
                      }}
                      className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-xs transition-all"
                    >
                      Sửa quyền
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
