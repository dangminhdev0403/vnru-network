# Mock Data Agent Guide — Interactive Role Workflows

## Mục tiêu
Tạo bộ mock data đủ mạnh để kiểm thử toàn bộ UI Workspace của VN–RU Network mà không biến mock thành business backend giả. Mock data phải giúp người dùng nhìn thấy đầy đủ các trạng thái, edge case, deadline, conflict, permission và handoff giữa role.

## Nguyên tắc bắt buộc
1. Không sao chép cùng một flow giữa các role. Mỗi role có trách nhiệm, action và terminal state khác nhau.
2. Không tạo dữ liệu tài chính, đầu tư, ngân sách, giải ngân, tài trợ hoặc báo cáo tài chính.
3. Mỗi collection chính phải có đủ happy path và unhappy path.
4. Không để phần lớn record cùng một trạng thái.
5. Các record phải liên kết bằng id/code nhất quán để UI có thể deep-link và hiển thị timeline.
6. Mock data chỉ phục vụ UI Preview; không được tạo lời nhắn khiến người dùng hiểu nhầm rằng backend nghiệp vụ thật đã ghi nhận.
7. Dữ liệu song phương phải thể hiện cả phía Việt Nam và Liên bang Nga khi nghiệp vụ yêu cầu.

## Số lượng tối thiểu khuyến nghị
- experts: 24
- organizations: 14
- opportunities: 12
- proposals: 20
- projects: 12
- reviewAssignments: 14
- reviews: 16
- reports: 12
- notifications: 24
- activities: 36
- academicEvents: 12
- knowledgeResources: 20
- users / IAM demo: 18

## Trạng thái phải được bao phủ
### Proposal / collaboration
DRAFT, WAITING_PARTNER, WAITING_ORG_CONFIRMATION, SUBMITTED, NEEDS_INFO, ELIGIBLE, NOT_ELIGIBLE, WITHDRAWN, CANCELLED

### Review assignment / review
UNASSIGNED, ASSIGNED, NEW, IN_REVIEW, DRAFT, OVERDUE, CONFLICT, SUBMITTED, CANCELLED

### Decision
PENDING, REVISION, APPROVED, REJECTED

### Project
PLANNED, ACTIVE, AT_RISK, BLOCKED, COMPLETED, CANCELLED

### Report
DRAFT, SUBMITTED, PENDING, RETURNED, APPROVED, OVERDUE

### Notification
UNREAD, READ

### IAM / account
ACTIVE, INVITED, SUSPENDED, DEACTIVATED; assignment scopes PLATFORM, ORGANIZATION, REVIEW_BOARD khi phù hợp.

## Edge cases bắt buộc
- record gần deadline
- record deadline hôm nay
- record quá hạn
- reviewer conflict of interest
- record thiếu tài liệu
- record yêu cầu bổ sung
- action bị khóa do state
- action bị khóa do permission
- read-only record sau submit
- cancelled / withdrawn item
- empty filter result
- loading / retry fixture nếu UI hỗ trợ
- notification unread/read
- duplicate-like titles để kiểm tra code/id differentiation

## Khác biệt dữ liệu theo role
### RESEARCHER
Dữ liệu phải nhấn vào việc tạo/hoàn thiện proposal, ghép đối tác, theo dõi xác nhận tổ chức, project milestones, knowledge và academic activities. Researcher không có dữ liệu cho phép tự sàng lọc, tự assign reviewer hoặc ban hành decision.

### ORGANIZATION_REPRESENTATIVE
Dữ liệu phải nhấn vào endorsement/confirmation trong phạm vi tổ chức, xác nhận nguồn lực phi tài chính, theo dõi project của tổ chức và activity. Không cấp action review chuyên môn hay decision.

### COLLABORATION_MANAGER
Dữ liệu phải nhấn vào opportunity management, screening queue, reviewer assignment, conflict detection, programme project monitoring và report handling. Manager không chấm rubric phản biện thay reviewer và không ban hành final decision.

### REVIEWER
Dữ liệu phải là assigned dossiers, deadline, rubric draft, conflict, overdue, submitted history. Reviewer không tự chọn proposal ngoài assignment, không assign reviewer khác, không ban hành decision.

### FOUNDATION_DECISION_MAKER / DECISION AUTHORITY
Dữ liệu phải là hồ sơ đã qua screening + review summary, queue chờ quyết định, history và linked project. Decision role không sửa nội dung proposal, không chấm rubric và không xử lý tài chính.

### SUPER_ADMIN / IAM
Dữ liệu phải phục vụ user list, identity status, role assignment, context scope, permission matrix, audit events, session/security. Không dùng SUPER_ADMIN để giả lập nghiệp vụ chuyên môn của các role khác.

## Quan hệ ID bắt buộc
Một proposal cần có thể liên kết tới:
- opportunityId (nếu có)
- vnOrganizationId
- ruOrganizationId
- researcher user ids
- organization confirmations
- screening event
- reviewAssignment ids
- review ids
- decision id
- projectId nếu approved
- activity ids
- notification ids

Không bắt buộc mọi proposal đi hết flow. Cố ý tạo record dừng ở các bước khác nhau để UI kiểm tra đủ state.

## Notification fixtures
Notification phải có targetHref hoặc target descriptor để UI deep-link tới đúng collection/detail/workbench. Ví dụ:
- researcher: proposal needs info
- organization: proposal awaiting endorsement
- manager: new submitted proposal / unassigned eligible proposal
- reviewer: new assignment / deadline soon
- decision: review completed and ready for decision

## Activity fixtures
Mỗi entity quan trọng nên có timeline 4–10 event gồm actor, role, timestamp, action, description và state transition. Timeline phải phản ánh đúng quyền của actor.

## Deadline distribution
Trong mỗi collection có deadline, cố gắng phân bố:
- 10–15% overdue
- 10–15% due today / within 24h
- 20–30% due within 7 days
- còn lại future / completed / no deadline

## Yêu cầu đầu ra
Agent nên tạo mock data trong cấu trúc phù hợp với repo hiện tại, ưu tiên tách theo domain thay vì nhét toàn bộ vào một file lớn. Có thể dùng index export tập trung.

Ví dụ mong muốn:
frontend/features/workspace/mock-data/
- experts.ts
- organizations.ts
- opportunities.ts
- proposals.ts
- projects.ts
- reviews.ts
- reports.ts
- notifications.ts
- activities.ts
- academic-events.ts
- knowledge.ts
- iam.ts
- index.ts

## Validation checklist
- [ ] Tất cả role đều có dữ liệu đủ để render collection-first UI.
- [ ] Có đủ case normal, warning, blocked, overdue, returned, rejected, cancelled, completed.
- [ ] Không có role nào sở hữu action trái trách nhiệm nghiệp vụ.
- [ ] Không có dữ liệu tài chính/đầu tư/ngân sách/giải ngân.
- [ ] Các relation id/code không bị đứt.
- [ ] Notification deep-link tới đúng entity/workbench.
- [ ] Timeline actor/role hợp lệ.
- [ ] Dữ liệu VN/RU cân bằng hợp lý.
- [ ] Không dùng 2–3 record sơ sài để “demo cho xong”.

## Không làm
- Không tạo shared action engine hay fake business backend nếu task chỉ là mock data.
- Không tự đổi RBAC/capability model.
- Không tự thêm module ngoài phạm vi UI hiện có.
- Không dùng cùng một template dữ liệu cho mọi role rồi chỉ đổi màu/tên.
