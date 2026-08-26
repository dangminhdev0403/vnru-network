import { RoleConfig, RoleType, ProposalItem, ConsortiumSlot } from './types';

export const ROLE_CONFIGS: Record<RoleType, RoleConfig> = {
  researcher: {
    id: 'researcher',
    name: 'Nhà nghiên cứu (Researcher)',
    badgeLabel: 'GS.TS. Trần Đình Nam · VAST',
    description: 'Quản lý đề xuất song phương, dự án đang chạy & hợp tác Co-PI Nga',
    accentColor: '#2d6cdf',
    softBg: '#dce9ff',
    avatarText: 'TN',
    avatarOrg: 'Viện Hải dương học · VAST',
    homePath: '/workspace/researcher'
  },
  reviewer: {
    id: 'reviewer',
    name: 'Hội đồng Phản biện (Reviewer)',
    badgeLabel: 'Chuyên gia Phản biện #07',
    description: 'Đánh giá hồ sơ nghiên cứu ẩn danh với hệ thống Rubric đa tiêu chí',
    accentColor: '#6f65b5',
    softBg: '#ebe8ff',
    avatarText: '07',
    avatarOrg: 'Hội đồng Khoa học Vật liệu Biển',
    homePath: '/workspace/reviewer'
  },
  organization: {
    id: 'organization',
    name: 'Đại diện Tổ chức (Organization)',
    badgeLabel: 'Ban HTQT · VAST',
    description: 'Thẩm định hồ sơ, cam kết hạ tầng & đóng dấu xác nhận bảo trợ',
    accentColor: '#287f7a',
    softBg: '#dff4f1',
    avatarText: 'VS',
    avatarOrg: 'Viện Hàn lâm KH & CN Việt Nam',
    homePath: '/workspace/organization'
  },
  enterprise: {
    id: 'enterprise',
    name: 'Đại diện Doanh nghiệp (Enterprise)',
    badgeLabel: 'Viettel R&D High-Tech',
    description: 'Khám phá công nghệ sẵn sàng chuyển giao & Ghép liên danh 2+2',
    accentColor: '#b8792f',
    softBg: '#fff0d8',
    avatarText: 'VT',
    avatarOrg: 'Tập đoàn Viettel (Viettel R&D)',
    homePath: '/workspace/enterprise'
  },
  leadership: {
    id: 'leadership',
    name: 'Lãnh đạo Chiến lược (Leadership)',
    badgeLabel: 'Ban Chỉ đạo Khoa học VN - Nga',
    description: 'Giám sát vĩ mô, phân tích tín hiệu & trích xuất báo cáo tham mưu',
    accentColor: '#435d82',
    softBg: '#e4ebf4',
    avatarText: 'BC',
    avatarOrg: 'Ủy ban Hợp tác KH & CN Liên Chính phủ',
    homePath: '/workspace/leadership'
  },
  governance: {
    id: 'governance',
    name: 'Quản trị Hệ thống (Governance)',
    badgeLabel: 'System Administrator',
    description: 'Quản lý danh tính OIDC, ma trận phân quyền IAM & Audit an toàn',
    accentColor: '#9a4e56',
    softBg: '#f8e5e8',
    avatarText: 'SA',
    avatarOrg: 'Foundation System Operator',
    homePath: '/governance'
  }
};

export const MOCK_PROPOSALS: ProposalItem[] = [
  {
    id: 'p-01',
    code: 'RU-VN-2026-NANO-01',
    title: 'Độ bền và biến tính bề mặt vật liệu Nano-composite trong môi trường biển nhiệt đới',
    field: 'Khoa học Vật liệu & Hóa lý Biển',
    vnPi: 'GS.TS. Trần Đình Nam',
    vnOrg: 'Viện Hải dương học (VAST)',
    ruPi: 'Prof. Alexei Morozov',
    ruOrg: 'FEB RAS Vladivostok',
    status: 'PENDING_COPI',
    statusLabel: 'Chờ xác nhận Co-PI Nga',
    durationMonths: 36,
    expectedOutcomes: '03 bài báo ISI Q1/Q2, 01 sáng chế giải pháp bảo vệ công trình biển'
  },
  {
    id: 'p-02',
    code: 'RU-VN-2026-BIO-08',
    title: 'Khảo sát đa dạng sinh học và động lực học hải lưu vùng biển chuyển tiếp Việt – Nga',
    field: 'Sinh học Biển & Hải dương học',
    vnPi: 'GS.TS. Trần Đình Nam',
    vnOrg: 'Viện Hải dương học (VAST)',
    ruPi: 'Prof. Alexei Morozov',
    ruOrg: 'Viện Sinh học Biển Vladivostok',
    status: 'ACTIVE',
    statusLabel: 'Đang triển khai (Milestone 2)',
    progressPercent: 75,
    durationMonths: 36,
    expectedOutcomes: '04 bài báo Q1, atlas đa dạng sinh học đáy biển sâu'
  },
  {
    id: 'p-03',
    code: 'RU-VN-2026-AI-04',
    title: 'Mô hình AI học sâu dự báo sớm tai biến địa chất và sạt lở bờ biển',
    field: 'Trí tuệ Nhân tạo & Địa chất Biển',
    vnPi: 'PGS.TS. Lê Hoài Thanh',
    vnOrg: 'Khoa Vật lý · ĐHQG Hà Nội',
    ruPi: 'Prof. Dmitry Sokolov',
    ruOrg: 'MISIS Moskva',
    status: 'UNDER_REVIEW',
    statusLabel: 'Hội đồng đang phản biện',
    durationMonths: 24,
    expectedOutcomes: 'Phần mềm dự báo sớm cảnh báo sạt lở bờ biển thời gian thực'
  }
];

export const INITIAL_2PLUS2_SLOTS: ConsortiumSlot[] = [
  {
    type: 'vn-inst',
    typeLabel: '01 · Viện / Trường Việt Nam',
    country: 'VN',
    orgName: 'Viện Hàn lâm KH & CN Việt Nam (VAST)',
    deptName: 'Viện Hải dương học Nha Trang',
    leadName: 'GS.TS. Trần Đình Nam',
    isFilled: true
  },
  {
    type: 'vn-ent',
    typeLabel: '02 · Doanh nghiệp ứng dụng VN',
    country: 'VN',
    orgName: 'Tập đoàn Viettel (Viettel R&D)',
    deptName: 'Bộ phận R&D Vật liệu mới',
    leadName: 'KS. Lê Anh Tuấn',
    isFilled: true
  },
  {
    type: 'ru-inst',
    typeLabel: '03 · Viện / Trường Liên bang Nga',
    country: 'RU',
    orgName: 'Viện Hàn lâm Khoa học LB Nga (FEB RAS)',
    deptName: 'Viện Sinh học Biển Vladivostok',
    leadName: 'Prof. Alexei Morozov',
    isFilled: true
  },
  {
    type: 'ru-ent',
    typeLabel: '04 · Doanh nghiệp ứng dụng Nga',
    country: 'RU',
    isFilled: false
  }
];

export const RU_ENTERPRISE_CANDIDATES = [
  {
    name: 'Rostec High-Tech Materials Group',
    dept: 'Ban Hợp tác Công nghệ Quốc tế (Moskva)',
    lead: 'Eng. Igor Volkov',
    description: 'Chuyên sản xuất sơn phủ composite công nghiệp chịu ăn mòn và hóa chất đặc biệt.'
  },
  {
    name: 'Biocad Pharmaceuticals St. Petersburg',
    dept: 'Trung tâm Chuyển giao Y sinh & Kháng thể',
    lead: 'Dr. Svetlana Ivanova',
    description: 'Doanh nghiệp dược sinh học hàng đầu LB Nga, có kinh nghiệm sản xuất quy mô lớn.'
  },
  {
    name: 'Rosseti Smart Grid Technologies',
    dept: 'Khối Phát triển Thiết bị Lưới điện Thông minh',
    lead: 'Eng. Mikhail Popov',
    description: 'Tập đoàn hạ tầng năng lượng, cung cấp thiết bị truyền tải và cảm biến đo lường.'
  }
];
