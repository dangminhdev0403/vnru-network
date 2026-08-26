import type { Decision, DecisionState } from "../demo-v2/types";

export type DetailedDecision = Decision & {
  reviewSummary?: string;
  signatory?: string;
};

export const DEMO_DECISIONS: DetailedDecision[] = [
  {
    id: "dc01",
    proposalId: "p08",
    code: "RU-VN-2026-ENERGY-09",
    title: "Tối ưu vật liệu cho năng lượng sóng quy mô nhỏ",
    organizations: "HCMUT ↔ FEFU",
    score: 7.2,
    state: "REVISION",
    rationale: "Cần thu hẹp mục tiêu từ ứng dụng đại trà sang thử nghiệm buồng sóng kiểm soát và bổ sung phương án kiểm định độ bền cánh tuabin.",
    decidedAt: "22/08/2026 15:30",
    reviewSummary: "Điểm phản biện trung bình 7.20/10 (Chuyên gia #12 đánh giá 7.20). Khuyến nghị điều chỉnh.",
    signatory: "Hội đồng Điều hành Quỹ KH & CN Song phương",
  },
  {
    id: "dc02",
    proposalId: "p09",
    code: "RU-VN-2025-OCEAN-03",
    title: "Đồng bộ chuỗi quan trắc hải dương học ven bờ",
    organizations: "IO VAST ↔ FEB RAS",
    score: 8.9,
    state: "APPROVED",
    rationale: "Hồ sơ đáp ứng xuất sắc yêu cầu khoa học, tính cấp thiết và mức độ bổ trợ hạ tầng kỹ thuật giữa hai viện nghiên cứu biển hàng đầu.",
    decidedAt: "18/08/2026 10:20",
    reviewSummary: "Điểm phản biện 8.90/10 (Chuyên gia #07). Đánh giá xuất sắc, sẵn sàng kích hoạt dự án.",
    signatory: "Hội đồng Điều hành Quỹ KH & CN Song phương",
  },
  {
    id: "dc03",
    proposalId: "p10",
    code: "RU-VN-2026-SENSOR-10",
    title: "Cảm biến hóa học bền môi trường nước mặn",
    organizations: "VNU ↔ MISIS",
    score: 5.8,
    state: "REJECTED",
    rationale: "Tính khả thi của màng nhạy ion trong điều kiện biển thực tế chưa đạt ngưỡng yêu cầu; chưa có giải pháp chống bám bẩn sinh học.",
    decidedAt: "19/08/2026 14:00",
    reviewSummary: "Điểm phản biện 5.80/10 (Chuyên gia #21). Không đạt ngưỡng tối thiểu 7.0/10.",
    signatory: "Hội đồng Điều hành Quỹ KH & CN Song phương",
  },
  {
    id: "dc04",
    proposalId: "p07",
    code: "RU-VN-2026-BIO-08",
    title: "Độ bền vật liệu sinh học trong điều kiện biển",
    organizations: "VAST ↔ FEB RAS",
    score: 8.45,
    state: "PENDING",
    reviewSummary: "Chuyên gia #07 đánh giá 8.45/10. Hồ sơ hoàn tất vòng phản biện, nằm trong hàng đợi chờ ban hành quyết định.",
  },
  {
    id: "dc05",
    proposalId: "p20",
    code: "RU-VN-2026-SEDIMENT-20",
    title: "Phân tích địa hóa đồng vị trầm tích bồi tụ cửa sông",
    organizations: "VIGMR ↔ GEOKHI RAS",
    score: 8.5,
    state: "REVISION",
    rationale: "Hồ sơ đạt điểm khoa học cao nhưng cần thống nhất chuẩn hóa phương pháp đo phổ gamma định tuổi với phòng lab GEOKHI RAS trước khi cấp phép.",
    decidedAt: "22/08/2026 11:30",
    reviewSummary: "Điểm phản biện 8.50/10 (Chuyên gia #31). Đạt yêu cầu khoa học, cần hoàn thiện kỹ thuật.",
    signatory: "Hội đồng Điều hành Quỹ KH & CN Song phương",
  },
  {
    id: "dc06",
    proposalId: "p21",
    code: "RU-VN-2025-EDDY-21",
    title: "Cấu trúc vi mô và năng lượng xoáy nhiệt đới Tây Thái Bình Dương",
    organizations: "IO VAST ↔ FEB RAS",
    score: 9.1,
    state: "APPROVED",
    rationale: "Đề tài mang tầm chiến lược, tận dụng tối đa dữ liệu các đợt khảo sát hải dương học liên hợp trên tàu Viện sĩ Oparin.",
    decidedAt: "19/08/2026 16:10",
    reviewSummary: "Điểm phản biện 9.10/10 (Chuyên gia #21). Đạt mức xuất sắc cao nhất đợt xét duyệt 2025.",
    signatory: "Hội đồng Điều hành Quỹ KH & CN Song phương",
  },
  {
    id: "dc07",
    proposalId: "p03",
    code: "RU-VN-2026-MAR-02",
    title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh",
    organizations: "IO VAST ↔ POI RAS",
    score: 8.7,
    state: "PENDING",
    reviewSummary: "Chuyên gia #31 đánh giá 8.70/10. Đang tổng hợp phiếu ý kiến thành viên hội đồng.",
  },
  {
    id: "dc08",
    proposalId: "p11",
    code: "RU-VN-2026-CLIMATE-11",
    title: "Đánh giá rủi ro khí hậu cho đô thị ven biển",
    organizations: "NEU ↔ HSE",
    score: 8.6,
    state: "PENDING",
    reviewSummary: "Chuyên gia #12 đánh giá 8.60/10. Chờ văn bản ký bảo trợ của tổ chức chủ trì.",
  },
];

export function getDecisionById(id: string): DetailedDecision | undefined {
  return DEMO_DECISIONS.find((item) => item.id === id || item.code === id);
}

export function getDecisionByProposalId(proposalId: string): DetailedDecision | undefined {
  return DEMO_DECISIONS.find((item) => item.proposalId === proposalId);
}

export function getDecisionsByState(state: DecisionState): DetailedDecision[] {
  return DEMO_DECISIONS.filter((item) => item.state === state);
}
