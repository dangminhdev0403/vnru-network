import type {
  ActivityItem,
  Decision,
  Opportunity,
  OrganizationEndorsement,
  Project,
  Proposal,
  ReportItem,
  ReviewAssignment,
  WorkflowNotification,
} from "./types";

export const DEMO_PROPOSALS: Proposal[] = [
  { id: "p01", code: "RU-VN-2026-NANO-01", title: "Vật liệu nano-composite chịu ăn mòn biển nhiệt đới", field: "Vật liệu mới", vnOrg: "VAST", ruOrg: "FEB RAS", vnPi: "PGS.TS Lê Thị Mai", ruPi: "Prof. Elena Kurchatova", state: "WAITING_PARTNER", deadline: "30/08/2026", updatedAt: "24/08/2026 17:32", readiness: 62, missing: ["Xác nhận đồng chủ nhiệm phía Nga"] },
  { id: "p02", code: "RU-VN-2026-AI-04", title: "AI dự báo sớm tai biến địa chất ven biển", field: "AI · Địa chất biển", vnOrg: "VAST", ruOrg: "MISIS", vnPi: "TS Nguyễn Minh Anh", ruPi: "Dr. Ivan Morozov", state: "NEEDS_INFO", deadline: "25/08/2026", updatedAt: "24/08/2026 16:20", readiness: 78, missing: ["Nguồn dữ liệu dùng chung", "Phạm vi thử nghiệm"], note: "Điều phối yêu cầu bổ sung trước khi tiếp tục sàng lọc." },
  { id: "p03", code: "RU-VN-2026-MAR-02", title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh", field: "Sinh học biển", vnOrg: "IO VAST", ruOrg: "POI RAS", vnPi: "TS Trần Hải", ruPi: "Dr. Anna Volkova", state: "ELIGIBLE", deadline: "18/09/2026", updatedAt: "24/08/2026 14:05", readiness: 100 },
  { id: "p04", code: "RU-VN-2026-DATA-03", title: "Liên thông dữ liệu quan trắc hải dương VN–RU", field: "Dữ liệu khoa học", vnOrg: "VNU", ruOrg: "FEB RAS", vnPi: "PGS.TS Phạm Sơn", ruPi: "Dr. Pavel Sidorov", state: "SUBMITTED", deadline: "02/09/2026", updatedAt: "24/08/2026 12:10", readiness: 96 },
  { id: "p05", code: "RU-VN-2026-ROBOT-05", title: "Robot tự hành khảo sát vùng nước nông", field: "Robot biển", vnOrg: "HUST", ruOrg: "SPbPU", vnPi: "TS Đặng Quốc", ruPi: "Prof. Alexei Petrov", state: "NOT_ELIGIBLE", deadline: "19/08/2026", updatedAt: "23/08/2026 11:40", readiness: 71, missing: ["Phạm vi đối tác chưa đáp ứng điều kiện chương trình"] },
  { id: "p06", code: "RU-VN-2026-COAST-06", title: "Mô hình số biến động đường bờ khu vực nhiệt đới", field: "Địa mạo ven biển", vnOrg: "VNU", ruOrg: "MSU", vnPi: "TS Bùi Thu", ruPi: "Dr. Sergei Kozlov", state: "IN_REVIEW", deadline: "05/09/2026", updatedAt: "23/08/2026 09:18", readiness: 100 },
  { id: "p07", code: "RU-VN-2026-BIO-08", title: "Độ bền vật liệu sinh học trong điều kiện biển", field: "Vật liệu sinh học", vnOrg: "VAST", ruOrg: "FEB RAS", vnPi: "PGS.TS Lê Thị Mai", ruPi: "Prof. Elena Kurchatova", state: "IN_REVIEW", deadline: "30/08/2026", updatedAt: "22/08/2026 15:45", readiness: 100 },
  { id: "p08", code: "RU-VN-2026-ENERGY-09", title: "Tối ưu vật liệu cho năng lượng sóng quy mô nhỏ", field: "Năng lượng biển", vnOrg: "HCMUT", ruOrg: "FEFU", vnPi: "TS Vũ Linh", ruPi: "Dr. Kirill Romanov", state: "REVISION", deadline: "28/08/2026", updatedAt: "22/08/2026 13:11", readiness: 88, missing: ["Điều chỉnh mục tiêu nghiên cứu theo ý kiến phản biện"] },
  { id: "p09", code: "RU-VN-2025-OCEAN-03", title: "Đồng bộ chuỗi quan trắc hải dương học ven bờ", field: "Hải dương học", vnOrg: "IO VAST", ruOrg: "FEB RAS", vnPi: "TS Đỗ Hùng", ruPi: "Dr. Maria Orlova", state: "APPROVED", deadline: "15/12/2025", updatedAt: "20/08/2026 08:30", readiness: 100 },
  { id: "p10", code: "RU-VN-2026-SENSOR-10", title: "Cảm biến hóa học bền môi trường nước mặn", field: "Cảm biến", vnOrg: "VNU", ruOrg: "MISIS", vnPi: "TS Lương Hà", ruPi: "Dr. Olga Smirnova", state: "REJECTED", deadline: "12/08/2026", updatedAt: "18/08/2026 17:22", readiness: 100 },
  { id: "p11", code: "RU-VN-2026-CLIMATE-11", title: "Đánh giá rủi ro khí hậu cho đô thị ven biển", field: "Khí hậu", vnOrg: "NEU", ruOrg: "HSE", vnPi: "TS Nguyễn Thảo", ruPi: "Dr. Irina Belova", state: "WAITING_ORG_CONFIRMATION", deadline: "01/09/2026", updatedAt: "24/08/2026 10:05", readiness: 84, missing: ["Xác nhận của tổ chức phía Việt Nam"] },
  { id: "p12", code: "RU-VN-2026-GEO-12", title: "Cơ sở dữ liệu địa chất biển song phương", field: "Địa chất biển", vnOrg: "VIGMR", ruOrg: "GEOKHI RAS", vnPi: "TS Hoàng Long", ruPi: "Dr. Dmitri Levin", state: "CANCELLED", deadline: "10/09/2026", updatedAt: "21/08/2026 14:40", readiness: 44, note: "Nhóm nghiên cứu chủ động thu hồi bản nháp." },
];

export const DEMO_REVIEWS: ReviewAssignment[] = [
  { id: "rv01", proposalId: "p07", code: "RU-VN-2026-BIO-08", title: "Độ bền vật liệu sinh học trong điều kiện biển", field: "Vật liệu sinh học", reviewer: "Chuyên gia #07", deadline: "30/08/2026", state: "IN_REVIEW", score: 8.45, comment: "Hồ sơ có luận cứ khoa học rõ và phương pháp phù hợp." },
  { id: "rv02", proposalId: "p06", code: "RU-VN-2026-COAST-06", title: "Mô hình số biến động đường bờ khu vực nhiệt đới", field: "Địa mạo ven biển", reviewer: "Chuyên gia #07", deadline: "26/08/2026", state: "OVERDUE", score: 7.9, comment: "Cần hoàn thiện phần hiệu chỉnh mô hình và dữ liệu kiểm chứng." },
  { id: "rv03", proposalId: "p03", code: "RU-VN-2026-MAR-02", title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh", field: "Sinh học biển", reviewer: null, deadline: "08/09/2026", state: "UNASSIGNED" },
  { id: "rv04", proposalId: "p04", code: "RU-VN-2026-DATA-03", title: "Liên thông dữ liệu quan trắc hải dương VN–RU", field: "Dữ liệu khoa học", reviewer: "Chuyên gia #12", deadline: "09/09/2026", state: "ASSIGNED" },
  { id: "rv05", proposalId: "p08", code: "RU-VN-2026-ENERGY-09", title: "Tối ưu vật liệu cho năng lượng sóng quy mô nhỏ", field: "Năng lượng biển", reviewer: "Chuyên gia #12", deadline: "20/08/2026", state: "SUBMITTED", score: 7.2, comment: "Đề nghị chỉnh sửa mục tiêu và phạm vi thử nghiệm." },
  { id: "rv06", proposalId: "p10", code: "RU-VN-2026-SENSOR-10", title: "Cảm biến hóa học bền môi trường nước mặn", field: "Cảm biến", reviewer: "Chuyên gia #21", deadline: "12/08/2026", state: "SUBMITTED", score: 5.8, comment: "Tính khả thi chưa đủ thuyết phục trong phạm vi kịch bản." },
  { id: "rv07", proposalId: "p05", code: "RU-VN-2026-ROBOT-05", title: "Robot tự hành khảo sát vùng nước nông", field: "Robot biển", reviewer: null, deadline: "19/08/2026", state: "CANCELLED" },
  { id: "rv08", proposalId: "p01", code: "RU-VN-2026-NANO-01", title: "Vật liệu nano-composite chịu ăn mòn biển nhiệt đới", field: "Vật liệu mới", reviewer: "Chuyên gia #21", deadline: "12/09/2026", state: "ASSIGNED", conflict: true },
];

export const DEMO_DECISIONS: Decision[] = [
  { id: "dc01", proposalId: "p08", code: "RU-VN-2026-ENERGY-09", title: "Tối ưu vật liệu cho năng lượng sóng quy mô nhỏ", organizations: "HCMUT ↔ FEFU", score: 7.2, state: "REVISION", rationale: "Cần thu hẹp mục tiêu và bổ sung kế hoạch thử nghiệm.", decidedAt: "22/08/2026 15:30" },
  { id: "dc02", proposalId: "p09", code: "RU-VN-2025-OCEAN-03", title: "Đồng bộ chuỗi quan trắc hải dương học ven bờ", organizations: "IO VAST ↔ FEB RAS", score: 8.9, state: "APPROVED", rationale: "Hồ sơ đáp ứng yêu cầu khoa học và hợp tác song phương.", decidedAt: "18/08/2026 10:20" },
  { id: "dc03", proposalId: "p10", code: "RU-VN-2026-SENSOR-10", title: "Cảm biến hóa học bền môi trường nước mặn", organizations: "VNU ↔ MISIS", score: 5.8, state: "REJECTED", rationale: "Tính khả thi chưa đạt ngưỡng yêu cầu của kịch bản.", decidedAt: "19/08/2026 14:00" },
  { id: "dc04", proposalId: "p07", code: "RU-VN-2026-BIO-08", title: "Độ bền vật liệu sinh học trong điều kiện biển", organizations: "VAST ↔ FEB RAS", score: 8.45, state: "PENDING" },
];

export const DEMO_PROJECTS: Project[] = [
  { id: "pr01", proposalId: "p09", code: "RU-VN-2025-OCEAN-03", title: "Đồng bộ chuỗi quan trắc hải dương học ven bờ", partner: "FEB RAS", state: "ACTIVE", progress: 48, next: "Đồng bộ bộ từ điển dữ liệu phiên bản 2", milestones: [
    { id: "m01", title: "Chuẩn hóa cấu trúc dữ liệu", due: "15/05/2026", state: "DONE" },
    { id: "m02", title: "Đồng bộ pipeline trao đổi", due: "30/09/2026", state: "IN_PROGRESS" },
    { id: "m03", title: "Đối chiếu dữ liệu lịch sử", due: "15/12/2026", state: "TODO" },
  ] },
  { id: "pr02", proposalId: "p07", code: "RU-VN-2026-BIO-08", title: "Độ bền vật liệu sinh học trong điều kiện biển", partner: "FEB RAS", state: "ACTIVE", progress: 75, next: "Hoàn tất chuỗi thử nghiệm gia tốc", milestones: [
    { id: "m04", title: "Thiết lập mẫu chuẩn", due: "15/05/2026", state: "DONE" },
    { id: "m05", title: "Thử nghiệm gia tốc môi trường biển", due: "30/08/2026", state: "IN_PROGRESS" },
    { id: "m06", title: "Đối chiếu dữ liệu VN–RU", due: "20/12/2026", state: "TODO" },
  ] },
  { id: "pr03", proposalId: "p03", code: "RU-VN-2026-MAR-02", title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh", partner: "POI RAS", state: "PLANNED", progress: 8, next: "Chờ quyết định chính thức để kích hoạt dự án", milestones: [
    { id: "m07", title: "Khởi động dự án", due: "20/09/2026", state: "TODO" },
    { id: "m08", title: "Chuẩn hóa bộ ảnh mẫu", due: "30/11/2026", state: "TODO" },
  ] },
  { id: "pr04", proposalId: "p04", code: "RU-VN-2026-DATA-03", title: "Liên thông dữ liệu quan trắc hải dương VN–RU", partner: "FEB RAS", state: "BLOCKED", progress: 31, next: "Gỡ chặn quyền truy cập kho dữ liệu chung", milestones: [
    { id: "m09", title: "Thiết lập không gian dữ liệu", due: "20/07/2026", state: "DONE" },
    { id: "m10", title: "Xác minh quyền truy cập đối tác", due: "22/08/2026", state: "OVERDUE" },
  ] },
  { id: "pr05", proposalId: "p02", code: "RU-VN-2026-AI-04", title: "AI dự báo sớm tai biến địa chất ven biển", partner: "MISIS", state: "CANCELLED", progress: 12, next: "Không có việc tiếp theo", milestones: [] },
  { id: "pr06", proposalId: "p11", code: "RU-VN-2026-CLIMATE-11", title: "Đánh giá rủi ro khí hậu cho đô thị ven biển", partner: "HSE", state: "COMPLETED", progress: 100, next: "Đã hoàn tất", milestones: [
    { id: "m11", title: "Hoàn thiện báo cáo tổng kết", due: "10/08/2026", state: "DONE" },
  ] },
];

export const DEMO_OPPORTUNITIES: Opportunity[] = [
  { id: "op01", code: "OPP-2026-MARINE", title: "Vật liệu và cảm biến cho môi trường biển", field: "Vật liệu · Cảm biến", closes: "30/09/2026", state: "PUBLISHED" },
  { id: "op02", code: "OPP-2026-AI", title: "AI cho quan trắc và dự báo rủi ro ven biển", field: "AI · Địa chất biển", closes: "15/10/2026", state: "DRAFT" },
  { id: "op03", code: "OPP-2026-DATA", title: "Hạ tầng dữ liệu khoa học song phương", field: "Dữ liệu khoa học", closes: "10/10/2026", state: "PUBLISHED" },
  { id: "op04", code: "OPP-2026-COAST", title: "Đô thị và hệ sinh thái ven biển", field: "Khí hậu · Sinh thái", closes: "01/09/2026", state: "CLOSED" },
  { id: "op05", code: "OPP-2026-ROBOT", title: "Robot và thiết bị tự hành biển", field: "Robot biển", closes: "20/11/2026", state: "DRAFT" },
];

export const DEMO_REPORTS: ReportItem[] = [
  { id: "rp01", projectId: "pr02", code: "RU-VN-2026-BIO-08", title: "Báo cáo tiến độ giai đoạn 2", period: "Q2/2026", progress: 75, state: "PENDING" },
  { id: "rp02", projectId: "pr01", code: "RU-VN-2025-OCEAN-03", title: "Báo cáo tiến độ giai đoạn 1", period: "H1/2026", progress: 48, state: "RETURNED" },
  { id: "rp03", projectId: "pr06", code: "RU-VN-2026-CLIMATE-11", title: "Báo cáo hoàn tất", period: "Final", progress: 100, state: "APPROVED" },
  { id: "rp04", projectId: "pr04", code: "RU-VN-2026-DATA-03", title: "Báo cáo xử lý điểm nghẽn", period: "M2", progress: 31, state: "DRAFT" },
];

export const DEMO_ENDORSEMENTS: OrganizationEndorsement[] = [
  { id: "en01", proposalId: "p11", code: "RU-VN-2026-CLIMATE-11", title: "Đánh giá rủi ro khí hậu cho đô thị ven biển", lead: "TS Nguyễn Thảo", partnerOrg: "HSE", facilities: "Phòng GIS, dữ liệu khí hậu lịch sử, nhóm mô hình hóa.", state: "PENDING", deadline: "26/08/2026" },
  { id: "en02", proposalId: "p02", code: "RU-VN-2026-AI-04", title: "AI dự báo sớm tai biến địa chất ven biển", lead: "TS Nguyễn Minh Anh", partnerOrg: "MISIS", facilities: "Cụm GPU dùng chung và kho dữ liệu khảo sát địa chất.", state: "NEEDS_INFO", deadline: "25/08/2026" },
  { id: "en03", proposalId: "p03", code: "RU-VN-2026-MAR-02", title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh", lead: "TS Trần Hải", partnerOrg: "POI RAS", facilities: "Hệ thống camera và trạm quan trắc ven bờ.", state: "ENDORSED", deadline: "18/08/2026" },
  { id: "en04", proposalId: "p05", code: "RU-VN-2026-ROBOT-05", title: "Robot tự hành khảo sát vùng nước nông", lead: "TS Đặng Quốc", partnerOrg: "SPbPU", facilities: "Bể thử và xưởng cơ điện tử.", state: "DECLINED", deadline: "19/08/2026" },
];

export const DEMO_NOTIFICATIONS: WorkflowNotification[] = [
  { id: "n01", role: "RESEARCHER", title: "Hồ sơ cần bổ sung", message: "RU-VN-2026-AI-04 thiếu nguồn dữ liệu dùng chung và phạm vi thử nghiệm.", href: "/workspace/researcher?view=collaboration&id=p02", read: false, createdAt: "2 phút trước", tone: "warning" },
  { id: "n02", role: "RESEARCHER", title: "Sắp đến hạn báo cáo", message: "RU-VN-2026-BIO-08 còn 2 ngày tới hạn mốc hiện tại.", href: "/workspace/researcher?view=projects&id=pr02", read: false, createdAt: "18 phút trước", tone: "warning" },
  { id: "n03", role: "REVIEWER", title: "Hồ sơ phản biện quá hạn", message: "RU-VN-2026-COAST-06 đã quá hạn 1 ngày.", href: "/workspace/reviewer?view=evaluation&id=rv02", read: false, createdAt: "7 phút trước", tone: "danger" },
  { id: "n04", role: "REVIEWER", title: "Phân công mới", message: "Bạn được phân công RU-VN-2026-DATA-03.", href: "/workspace/reviewer?view=assignments&id=rv04", read: false, createdAt: "1 giờ trước", tone: "info" },
  { id: "n05", role: "ORGANIZATION_REPRESENTATIVE", title: "Cần xác nhận tổ chức", message: "RU-VN-2026-CLIMATE-11 đang chờ xác nhận trước hạn 26/08.", href: "/workspace/organization?view=endorsements&id=en01", read: false, createdAt: "12 phút trước", tone: "warning" },
  { id: "n06", role: "COLLABORATION_MANAGER", title: "Hồ sơ mới nộp", message: "RU-VN-2026-DATA-03 đã vào hàng đợi sàng lọc.", href: "/workspace/collaboration?view=screening&id=p04", read: false, createdAt: "4 phút trước", tone: "info" },
  { id: "n07", role: "COLLABORATION_MANAGER", title: "Chưa phân công phản biện", message: "RU-VN-2026-MAR-02 đủ điều kiện nhưng chưa có reviewer.", href: "/workspace/collaboration?view=assignments&id=rv03", read: false, createdAt: "28 phút trước", tone: "warning" },
  { id: "n08", role: "FOUNDATION_DECISION_MAKER", title: "Hồ sơ sẵn sàng quyết định", message: "RU-VN-2026-BIO-08 đã có kết quả phản biện tổng hợp.", href: "/workspace/decisions?view=queue&id=dc04", read: false, createdAt: "6 phút trước", tone: "info" },
];

export const DEMO_ACTIVITIES: ActivityItem[] = [
  { id: "a01", entityId: "p02", entityType: "proposal", actor: "Điều phối hợp tác", action: "Yêu cầu bổ sung", detail: "Bổ sung nguồn dữ liệu dùng chung và phạm vi thử nghiệm.", createdAt: "24/08/2026 16:20" },
  { id: "a02", entityId: "p02", entityType: "proposal", actor: "TS Nguyễn Minh Anh", action: "Gửi đề xuất", detail: "Hồ sơ được gửi sang bước sàng lọc.", createdAt: "24/08/2026 15:04" },
  { id: "a03", entityId: "p03", entityType: "proposal", actor: "Điều phối hợp tác", action: "Đánh dấu đủ điều kiện", detail: "Hồ sơ sẵn sàng phân công phản biện.", createdAt: "24/08/2026 14:05" },
  { id: "a04", entityId: "rv01", entityType: "review", actor: "Chuyên gia #07", action: "Lưu bản nháp", detail: "Điểm tạm thời 8.45/10.", createdAt: "24/08/2026 17:15" },
  { id: "a05", entityId: "dc02", entityType: "decision", actor: "Cơ quan quyết định", action: "Chấp thuận", detail: "Hồ sơ chuyển sang giai đoạn triển khai dự án.", createdAt: "18/08/2026 10:20" },
  { id: "a06", entityId: "pr02", entityType: "project", actor: "Nhà nghiên cứu", action: "Cập nhật mốc", detail: "Thử nghiệm gia tốc đang ở 75%.", createdAt: "24/08/2026 10:10" },
  { id: "a07", entityId: "en01", entityType: "organization", actor: "Hệ thống", action: "Tạo yêu cầu xác nhận", detail: "Đại diện tổ chức cần xác nhận trước 26/08.", createdAt: "24/08/2026 09:45" },
];
