# Workspace Role Interaction Contract

## Mục tiêu

Workspace phải giúp người dùng hiểu luồng nghiệp vụ thông qua tương tác thật trong UI Preview, không chỉ qua dashboard tĩnh hoặc modal detail. Shared UI primitives được phép dùng lại, nhưng **state machine, action, validation, handoff và hậu quả của từng role phải khác nhau theo trách nhiệm nghiệp vụ**.

## Quy tắc collection-first

Các nav quản lý nhiều đối tượng phải đi theo luồng:

`Dashboard → Collection/List → Detail → Action/Workbench → Confirmation → State change → Activity → Notification/Handoff`

Không mở thẳng một record hard-code khi nav về bản chất là một collection. Workbench chuyên sâu chỉ mở sau khi người dùng chọn đối tượng phù hợp.

## Hợp đồng theo vai trò

### Nhà nghiên cứu

Sở hữu: tạo/chỉnh đề xuất, phản hồi yêu cầu bổ sung, ghép nhóm/đối tác, gửi hồ sơ, theo dõi đề xuất, cập nhật phần việc/mốc nghiên cứu, tài nguyên tri thức và hoạt động học thuật.

Không sở hữu: sàng lọc chương trình, phân reviewer, chấm phản biện, quyết định cuối.

Các fixture phải bao phủ tối thiểu: draft, chờ đối tác, chờ tổ chức, cần bổ sung, đã gửi, đang sàng lọc, đang phản biện, được chấp thuận, bị từ chối, đã thu hồi; dự án planned/active/at-risk/paused/completed.

### Reviewer

Sở hữu: nhận assignment, kiểm tra xung đột, bắt đầu phản biện, chấm rubric, lưu nháp, nộp phiếu.

Không sở hữu: tự chọn proposal, phân reviewer khác, xác nhận tổ chức, ra quyết định.

Các fixture phải bao phủ tối thiểu: new, in-review, waiting-info, conflict, overdue, draft, submitted, cancelled. Phiếu submitted phải read-only; waiting-info/conflict/cancelled phải khóa action không hợp lệ và giải thích lý do.

### Đại diện tổ chức

Sở hữu: xác nhận nhân sự/hạ tầng/phạm vi tổ chức, yêu cầu bổ sung, không xác nhận, theo dõi nghĩa vụ tổ chức trong dự án.

Không sở hữu: chấm điểm khoa học, phân reviewer, cập nhật milestone nghiên cứu, ra quyết định cuối.

Các fixture phải bao phủ tối thiểu: pending, needs-info, endorsed, declined, withdrawn, expired; project organization states bình thường, cần action, chờ đối tác, hoàn tất.

### Điều phối hợp tác

Sở hữu: quản lý cơ hội, tiếp nhận/sàng lọc, yêu cầu bổ sung, xác định đủ/không đủ điều kiện, phân reviewer có kiểm tra conflict/workload, theo dõi danh mục dự án và xử lý báo cáo.

Không sở hữu: chấm rubric phản biện hoặc ban hành quyết định cuối.

Các fixture phải bao phủ: opportunity draft/published/closed/archived; screening new/in-screening/needs-info/eligible/not-eligible; assignment unassigned/assigned/conflict/declined/completed; report pending/returned/approved/overdue.

### Cơ quan quyết định

Sở hữu: xem đầu vào đã hoàn chỉnh, xác nhận đã đọc bằng chứng, ghi rationale, chấp thuận/yêu cầu hoàn thiện/không chấp thuận/tạm hoãn, xem history read-only và dự án sau quyết định.

Không sở hữu: sửa proposal, phân reviewer, cập nhật milestone nghiên cứu.

Các fixture phải bao phủ: pending, approved, revision, rejected, deferred và project planned/active/at-risk/completed.

## Handoff bắt buộc

Các action làm thay đổi chủ sở hữu công việc phải tạo notification/handoff cho role tiếp theo. Ví dụ:

- Tổ chức xác nhận → Điều phối nhận hồ sơ sàng lọc.
- Reviewer báo conflict → Điều phối nhận task phân lại.
- Reviewer nộp phiếu → Cơ quan quyết định nhận hồ sơ.
- Quyết định chấp thuận → Nhà nghiên cứu, Đại diện tổ chức và Điều phối nhận trạng thái dự án.
- Yêu cầu bổ sung → Nhà nghiên cứu nhận task phản hồi.

Notification phải có deep link tới đúng collection/detail liên quan. Activity phải ghi lại action đủ ngữ cảnh để người demo hiểu điều gì vừa xảy ra.

## Không được làm

- Copy cùng một dashboard/list/detail rồi chỉ đổi màu và label cho các role.
- Đưa action ngoài trách nhiệm role để “demo cho đủ”.
- Chỉ hiện toast nhưng không đổi persistent state hoặc không tạo activity/handoff.
- Chỉ mock happy path.
- Dùng 1–2 record khiến filter, empty state, overdue, conflict, read-only và terminal state không kiểm thử được.

## Regression guardrail

`frontend/tests/workspace-role-interaction-contract.test.mjs` kiểm tra route đang dùng InteractiveWorkspace, coverage trạng thái và các action/anti-action quan trọng của từng role. Khi mở rộng role, cập nhật contract và test đồng thời.
