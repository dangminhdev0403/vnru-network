import type { ActivityItem } from "../demo-v2/types";

export const DEMO_ACTIVITIES: ActivityItem[] = [
  // Proposal p02 timeline
  { id: "act01", entityId: "p02", entityType: "proposal", actor: "Điều phối hợp tác", action: "Yêu cầu bổ sung", detail: "Bổ sung nguồn dữ liệu dùng chung và phạm vi thử nghiệm ven bờ.", createdAt: "24/08/2026 16:20" },
  { id: "act02", entityId: "p02", entityType: "proposal", actor: "TS Nguyễn Minh Anh", action: "Gửi đề xuất", detail: "Hồ sơ được nộp sang bước sàng lọc sau khi hoàn tất hồ sơ.", createdAt: "24/08/2026 15:04" },
  { id: "act03", entityId: "p02", entityType: "proposal", actor: "Đại diện tổ chức VAST", action: "Ký xác nhận bảo trợ", detail: "Xác nhận cam kết cơ sở hạ tầng cụm tính toán GPU dùng chung.", createdAt: "24/08/2026 11:30" },
  { id: "act04", entityId: "p02", entityType: "proposal", actor: "Dr. Ivan Morozov", action: "Đồng thuận Co-PI", detail: "Xác nhận vai trò đồng chủ nhiệm phía Liên bang Nga.", createdAt: "23/08/2026 14:00" },
  { id: "act05", entityId: "p02", entityType: "proposal", actor: "TS Nguyễn Minh Anh", action: "Khởi tạo bản nháp", detail: "Tạo đề xuất hợp tác theo cơ hội OPP-2026-AI.", createdAt: "22/08/2026 09:15" },

  // Proposal p03 & Review rv03 timeline
  { id: "act06", entityId: "p03", entityType: "proposal", actor: "Điều phối hợp tác", action: "Đánh dấu đủ điều kiện", detail: "Hồ sơ vượt qua vòng sàng lọc hình thức, sẵn sàng phân công phản biện.", createdAt: "24/08/2026 14:05" },
  { id: "act07", entityId: "p03", entityType: "proposal", actor: "Đại diện tổ chức IO VAST", action: "Xác nhận hồ sơ", detail: "Ký số cam kết sử dụng tàu khảo sát và trạm Hòn Mun.", createdAt: "23/08/2026 10:20" },
  { id: "act08", entityId: "p03", entityType: "proposal", actor: "TS Trần Hải", action: "Nộp hồ sơ đề xuất", detail: "Hoàn tất 100% tài liệu và nộp trực tuyến.", createdAt: "22/08/2026 16:45" },

  // Proposal p07 & Review rv01 timeline
  { id: "act09", entityId: "rv01", entityType: "review", actor: "Chuyên gia #07", action: "Lưu bản nháp phản biện", detail: "Điểm tạm thời 8.45/10 · Đánh giá cao tính ứng dụng nhiệt đới.", createdAt: "24/08/2026 17:15" },
  { id: "act10", entityId: "rv01", entityType: "review", actor: "Chuyên gia #07", action: "Bắt đầu phản biện", detail: "Mở workbench phản biện hồ sơ RU-VN-2026-BIO-08.", createdAt: "23/08/2026 08:30" },
  { id: "act11", entityId: "rv01", entityType: "review", actor: "Điều phối hợp tác", action: "Phân công phản biện", detail: "Chỉ định Chuyên gia #07 thẩm định chuyên môn.", createdAt: "22/08/2026 16:00" },
  { id: "act12", entityId: "p07", entityType: "proposal", actor: "Điều phối hợp tác", action: "Chuyển vòng phản biện", detail: "Hồ sơ được chuyển sang Hội đồng chuyên môn.", createdAt: "22/08/2026 15:45" },

  // Proposal p06 & Review rv02 timeline
  { id: "act13", entityId: "rv02", entityType: "review", actor: "Hệ thống", action: "Cảnh báo quá hạn", detail: "Hạn chót đánh giá 24/08/2026 đã trôi qua, gửi thông báo nhắc nhở.", createdAt: "24/08/2026 18:00" },
  { id: "act14", entityId: "rv02", entityType: "review", actor: "Chuyên gia #07", action: "Lưu bản nháp tạm", detail: "Điểm sơ bộ 7.90/10 · Cần dữ liệu hiệu chỉnh.", createdAt: "23/08/2026 09:30" },
  { id: "act15", entityId: "rv02", entityType: "review", actor: "Điều phối hợp tác", action: "Phân công phản biện", detail: "Chỉ định Chuyên gia #07 đánh giá hồ sơ mô hình sóng ven biển.", createdAt: "21/08/2026 11:00" },

  // Proposal p08, Review rv05 & Decision dc01 timeline
  { id: "act16", entityId: "dc01", entityType: "decision", actor: "Cơ quan quyết định", action: "Yêu cầu hoàn thiện", detail: "Yêu cầu thu hẹp phạm vi thử nghiệm và bổ sung kế hoạch kiểm tra kênh sóng.", createdAt: "22/08/2026 15:30" },
  { id: "act17", entityId: "rv05", entityType: "review", actor: "Chuyên gia #12", action: "Nộp phản biện chính thức", detail: "Đánh giá 7.20/10 · Khuyến nghị điều chỉnh mục tiêu.", createdAt: "20/08/2026 16:30" },
  { id: "act18", entityId: "rv05", entityType: "review", actor: "Chuyên gia #12", action: "Bắt đầu phản biện", detail: "Tiếp nhận hồ sơ năng lượng sóng quy mô nhỏ.", createdAt: "19/08/2026 14:20" },

  // Proposal p09, Decision dc02 & Project pr01 timeline
  { id: "act19", entityId: "dc02", entityType: "decision", actor: "Cơ quan quyết định", action: "Chấp thuận phê duyệt", detail: "Phê duyệt triển khai dự án song phương giai đoạn 2026–2027.", createdAt: "18/08/2026 10:20" },
  { id: "act20", entityId: "rv12", entityType: "review", actor: "Chuyên gia #07", action: "Nộp phản biện", detail: "Đánh giá xuất sắc 8.90/10.", createdAt: "10/12/2025 11:30" },
  { id: "act21", entityId: "pr01", entityType: "project", actor: "TS Đỗ Hùng", action: "Hoàn tất mốc tiến độ", detail: "Mốc 'Chuẩn hóa cấu trúc dữ liệu' đạt 100%.", createdAt: "15/05/2026 16:00" },
  { id: "act22", entityId: "pr01", entityType: "project", actor: "Hệ thống", action: "Kích hoạt dự án", detail: "Dự án chuyển sang trạng thái ACTIVE sau quyết định phê duyệt.", createdAt: "01/01/2026 08:00" },

  // Proposal p10, Review rv06 & Decision dc03 timeline
  { id: "act23", entityId: "dc03", entityType: "decision", actor: "Cơ quan quyết định", action: "Không chấp thuận", detail: "Không phê duyệt do tính khả thi trong nước mặn chưa đáp ứng.", createdAt: "19/08/2026 14:00" },
  { id: "act24", entityId: "rv06", entityType: "review", actor: "Chuyên gia #21", action: "Nộp phản biện", detail: "Đánh giá 5.80/10 · Nêu rõ quan ngại về độ bền màng nhạy.", createdAt: "12/08/2026 11:45" },

  // Proposal p11 & Endorsement en01 timeline
  { id: "act25", entityId: "en01", entityType: "organization", actor: "Hệ thống", action: "Tạo yêu cầu xác nhận", detail: "Gửi thông báo tới Đại diện tổ chức NEU yêu cầu xác nhận trước 01/09.", createdAt: "24/08/2026 09:45" },
  { id: "act26", entityId: "p11", entityType: "proposal", actor: "TS Nguyễn Thảo", action: "Nộp hồ sơ bảo trợ", detail: "Chuyển hồ sơ sang tổ chức chủ trì xem xét hạ tầng.", createdAt: "24/08/2026 09:30" },

  // Proposal p04 & Project pr04 timeline
  { id: "act27", entityId: "p04", entityType: "proposal", actor: "PGS.TS Phạm Sơn", action: "Nộp đề xuất", detail: "Đề xuất liên thông dữ liệu nộp vào hệ thống.", createdAt: "24/08/2026 12:10" },
  { id: "act28", entityId: "pr04", entityType: "project", actor: "Hệ thống", action: "Cảnh báo điểm nghẽn", detail: "Mốc 'Xác minh chứng chỉ bảo mật' bị quá hạn 2 ngày, chuyển trạng thái BLOCKED.", createdAt: "24/08/2026 08:00" },

  // Proposal p01 & Review rv08 (Conflict) timeline
  { id: "act29", entityId: "rv08", entityType: "review", actor: "Hệ thống", action: "Phát hiện xung đột", detail: "Tự động phát hiện Chuyên gia #21 cùng viện nghiên cứu với chủ nhiệm đề tài.", createdAt: "24/08/2026 10:15" },
  { id: "act30", entityId: "p01", entityType: "proposal", actor: "PGS.TS Lê Thị Mai", action: "Gửi thư mời Co-PI", detail: "Gửi liên kết xác nhận hợp tác tới GS. Kurchatova.", createdAt: "22/08/2026 14:00" },

  // Proposal p12 (Cancelled) timeline
  { id: "act31", entityId: "p12", entityType: "proposal", actor: "TS Hoàng Long", action: "Thu hồi hồ sơ", detail: "Nhóm nghiên cứu chủ động xin hủy để bổ sung thỏa thuận chia sẻ dữ liệu.", createdAt: "21/08/2026 14:40" },

  // Opportunities & Reports timeline
  { id: "act32", entityId: "op01", entityType: "opportunity", actor: "Điều phối hợp tác", action: "Công bố cơ hội", detail: "Mở đợt tuyển chọn đề xuất hợp tác vật liệu và cảm biến biển.", createdAt: "15/06/2026 09:00" },
  { id: "act33", entityId: "op03", entityType: "opportunity", actor: "Điều phối hợp tác", action: "Công bố cơ hội", detail: "Mở đợt tuyển chọn chương trình hạ tầng dữ liệu khoa học song phương.", createdAt: "01/07/2026 09:00" },
  { id: "act34", entityId: "rp01", entityType: "report", actor: "PGS.TS Lê Thị Mai", action: "Nộp báo cáo tiến độ", detail: "Nộp báo cáo Q2/2026 dự án vật liệu sinh học.", createdAt: "22/08/2026 14:20" },
  { id: "act35", entityId: "rp02", entityType: "report", actor: "Điều phối hợp tác", action: "Trả lại báo cáo", detail: "Yêu cầu bổ sung dữ liệu kiểm chuẩn cảm biến đo độ mặn.", createdAt: "19/08/2026 16:30" },
  { id: "act36", entityId: "rp03", entityType: "report", actor: "Cơ quan quyết định", action: "Phê duyệt nghiệm thu", detail: "Nghiệm thu chính thức dự án rủi ro khí hậu đô thị ven biển.", createdAt: "10/08/2026 15:00" },

  // Additional timeline items for Project pr02 & pr07
  { id: "act37", entityId: "pr02", entityType: "project", actor: "PGS.TS Lê Thị Mai", action: "Cập nhật tiến độ mốc", detail: "Thử nghiệm gia tốc đạt 75% khối lượng.", createdAt: "24/08/2026 10:10" },
  { id: "act38", entityId: "pr07", entityType: "project", actor: "TS Đỗ Hùng", action: "Cập nhật kết quả chuyến đi", detail: "Hoàn tất xử lý sơ bộ 32 mặt cắt độ mặn - nhiệt độ.", createdAt: "20/07/2026 14:30" },
  { id: "act39", entityId: "p20", entityType: "proposal", actor: "Cơ quan quyết định", action: "Yêu cầu hoàn thiện", detail: "Yêu cầu chuẩn hóa phương pháp định tuổi chì-210.", createdAt: "22/08/2026 11:30" },
  { id: "act40", entityId: "p21", entityType: "proposal", actor: "Cơ quan quyết định", action: "Chấp thuận đề xuất", detail: "Ban hành quyết định chấp thuận đề xuất RU-VN-2025-EDDY-21.", createdAt: "19/08/2026 16:10" },
  { id: "act41", entityId: "en03", entityType: "organization", actor: "Đại diện tổ chức IO VAST", action: "Ký xác nhận bảo trợ", detail: "Cam kết bố trí 02 phòng lab nuôi cấy và tàu biển cho RU-VN-2026-MAR-02.", createdAt: "18/08/2026 14:00" },
  { id: "act42", entityId: "en04", entityType: "organization", actor: "Đại diện tổ chức HUST", action: "Từ chối bảo trợ", detail: "Từ chối xác nhận hồ sơ RU-VN-2026-ROBOT-05 do lịch bể thử đã kín.", createdAt: "19/08/2026 11:00" },
];

export function getActivitiesByEntity(entityId: string): ActivityItem[] {
  return DEMO_ACTIVITIES.filter((item) => item.entityId === entityId);
}

export function getActivitiesByEntityType(entityType: ActivityItem["entityType"]): ActivityItem[] {
  return DEMO_ACTIVITIES.filter((item) => item.entityType === entityType);
}
