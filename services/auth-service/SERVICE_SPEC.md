# Auth Service Specification — Module 1

## 1. Mục tiêu

`auth-service` hiện thực Module 1: **Quản trị, Định danh & Xác thực hợp nhất** của VN-RU Network.

Service này là nguồn sự thật cho IAM ở cấp nền tảng: danh tính nội bộ, xác thực, phiên đăng nhập, ngữ cảnh truy cập, vai trò/quyền và chính sách bảo mật liên quan xác thực.

Service không sở hữu nghiệp vụ của organization, expert, grant, review, project, academic, technology, knowledge hoặc analytics.

## 2. Trạng thái hiện tại

Base hiện tại chỉ khóa ranh giới module nội bộ:

```txt
src/modules/
  identity/
  authentication/
  session/
  access-control/
  security/
```

Các module đã được đăng ký trong `AppModule` nhưng chưa có entity, controller, persistence, JWT, SSO/IdP, 2FA implementation hay migration.

## 3. Ranh giới trách nhiệm

### 3.1 `identity`

Sở hữu danh tính nội bộ của người dùng trong VN-RU Network.

Trách nhiệm:

- `User` / internal identity;
- liên kết external/federated identity;
- trạng thái tài khoản;
- quy tắc liên kết và hợp nhất danh tính.

Không sở hữu:

- hồ sơ researcher/expert;
- organization profile;
- session;
- role/permission;
- provider-specific authentication flow.

Câu hỏi module trả lời: **Người này là ai trong VN-RU Network?**

### 3.2 `authentication`

Sở hữu orchestration cho quá trình xác thực.

Trách nhiệm:

- login entry flow;
- SSO / external IdP boundary;
- authentication callback;
- logout orchestration;
- điều phối step-up/2FA khi security policy yêu cầu.

Không sở hữu:

- user state;
- session persistence;
- role/permission state.

Câu hỏi module trả lời: **Danh tính này đã chứng minh mình là ai bằng cách nào?**

### 3.3 `session`

Sở hữu vòng đời phiên đăng nhập.

Trách nhiệm:

- tạo session sau khi xác thực thành công;
- kiểm tra session hiện tại;
- expiration;
- refresh/renewal nếu thiết kế sau này chấp thuận;
- revoke một session;
- revoke toàn bộ session của user khi cần.

Câu hỏi module trả lời: **Phiên xác thực này còn hợp lệ không?**

### 3.4 `access-control`

Sở hữu baseline access policy của IAM.

Trách nhiệm:

- Role;
- Permission;
- RoleAssignment;
- Active Authorization Context;
- permission resolution;
- baseline authorization decision.

Nguyên tắc:

```txt
Danh tính
+ ngữ cảnh hoạt động
+ quyền nền tảng
= baseline access decision
```

`access-control` không quyết định business state của tài nguyên. Ví dụ Grant/Review/Project vẫn phải tự kiểm tra ownership, assignment, workflow state và domain rules của chúng.

Câu hỏi module trả lời: **Trong ngữ cảnh hiện tại, danh tính này được dùng capability nền tảng nào?**

### 3.5 `security`

Sở hữu policy bảo mật quanh quá trình xác thực.

Trách nhiệm:

- 2FA policy;
- failed authentication policy;
- lock/disable security rule;
- suspicious authentication policy;
- security event cần thiết cho Module 1.

Không được trở thành một user store hoặc session store thứ hai.

Câu hỏi module trả lời: **Cần thêm điều kiện bảo mật nào trước khi tin cậy phiên truy cập?**

## 4. Luồng chính

### 4.1 Login

```txt
Client
  -> authentication
  -> external IdP / authentication provider
  -> identity resolve/link
  -> identity account-status check
  -> security policy / 2FA khi cần
  -> access-control context resolution
  -> session creation
  -> authenticated result
```

Kết quả mong muốn của login là một phiên đã xác thực gắn với một internal `userId` và authorization context hợp lệ; chi tiết token/session transport sẽ được quyết định ở implementation slice tương ứng.

### 4.2 Request đã xác thực

```txt
Request
  -> session validation
  -> identity/account status validation
  -> access-control resolve active context + permissions
  -> target business service
  -> business service validates resource scope + workflow state
```

IAM chỉ cung cấp baseline access. Business service là nguồn sự thật cho authorization phụ thuộc tài nguyên và trạng thái nghiệp vụ.

### 4.3 Logout

```txt
Client
  -> authentication logout orchestration
  -> session revoke
  -> security/audit hook khi cần
  -> completed
```

`authentication` điều phối logout; `session` sở hữu việc làm mất hiệu lực phiên.

### 4.4 Chuyển active context

Chỉ triển khai sau khi OPEN-02 được chốt.

Hướng dự kiến:

```txt
Authenticated user
  -> load allowed contexts
  -> select target context
  -> access-control validates assignment/scope
  -> activate context
  -> permission set is resolved for that context
```

Không cộng dồn quyền của các context khác nhau một cách mặc định.

## 5. Ownership dữ liệu logic

Các model sau thuộc `auth-service` về mặt ownership, nhưng chưa phải schema persistence chính thức:

```txt
identity
  User
  ExternalIdentity

session
  Session

access-control
  Role
  Permission
  RoleAssignment
  AuthorizationContext

security
  SecurityPolicy / SecurityEvent cần thiết cho IAM
```

Các model sau **không thuộc** `auth-service`:

```txt
Organization
Researcher
ExpertProfile
FundingCall
Proposal
ReviewAssignment
Project
Scholarship
Technology
Publication
```

Nếu authorization context cần organization/resource scope, chỉ giữ stable reference cần thiết; không sao chép business record sang IAM.

## 6. Dependency direction

Dependency nội bộ phải có chủ đích và không tạo vòng phụ thuộc.

Luồng orchestration chính:

```txt
authentication
  -> identity
  -> security
  -> access-control
  -> session
```

Các module chỉ được dùng public contract khi ranh giới đã đủ phức tạp để cần `*-public.ts`; không import repository hoặc persistence implementation của module khác như một shortcut.

## 7. Security invariants

- Backend là nguồn sự thật cho authentication và authorization.
- Endpoint private theo mặc định; public endpoint phải được khai báo rõ và có test.
- Quyết định truy cập phải fail closed khi thiếu identity/session/context cần thiết.
- User bị disable/suspend không được tiếp tục sử dụng session vô thời hạn.
- Business permission không thay thế resource ownership/workflow validation ở service sở hữu nghiệp vụ.
- Không ghi audit cho mọi UI interaction; chỉ ghi hành động IAM/bảo mật có giá trị truy vết.
- Không khóa IdP, token model hoặc multi-context behavior trước khi quyết định tương ứng được chốt.

## 8. Hợp đồng đầu ra của auth-service

Mục tiêu cuối cùng là cung cấp một authenticated request context ổn định cho các service khác, ở mức logic gồm:

```txt
userId
sessionId
activeContext
organizationScope? / stable scope references
permissions
authenticationLevel
```

Tên field và transport contract chính thức chỉ được khóa khi API/session design được triển khai và đưa vào OpenAPI.

## 9. OPEN decisions ảnh hưởng trực tiếp

- **OPEN-01** — lựa chọn SSO / Identity Provider chính xác.
- **OPEN-02** — mô hình multi-role / multi-context và cơ chế switching cuối cùng.

Không implementation nào được âm thầm đóng hai quyết định này.

## 10. Phạm vi chưa triển khai

Base hiện tại cố ý chưa có:

- JWT / Passport;
- SSO provider cụ thể;
- DB/ORM/Prisma schema hoặc migration;
- 2FA mechanism cụ thể;
- role/permission seed;
- public authentication endpoint;
- audit module/service riêng;
- event publishing;
- dependency/package mới.

## 11. Hướng triển khai

Thứ tự triển khai dự kiến theo capability, không phải tạo trước toàn bộ folder:

```txt
1. identity model + persistence boundary
2. authentication provider boundary
3. session lifecycle
4. current-user/session contract
5. access-control context + RBAC
6. security policy / 2FA
7. IAM administration + selective audit
```

Mỗi slice phải giữ boundary ở tài liệu này, bổ sung test tương ứng và chỉ mở rộng module structure khi có code thực sự cần đến.

## 12. Kết quả hoàn thành Module 1

Module 1 được xem là hoàn thành về mặt capability khi hệ thống có thể:

- xác định duy nhất internal user từ luồng xác thực được chấp thuận;
- quản lý trạng thái user và liên kết external identity;
- tạo, kiểm tra, hết hạn và revoke session;
- áp dụng 2FA/security policy đã được chốt;
- resolve active authorization context;
- resolve role/permission trong context đó;
- cung cấp authenticated context nhất quán cho service khác;
- quản trị user/role/access theo chính sách IAM;
- ghi lại các sự kiện IAM/bảo mật cần truy vết;
- từ chối truy cập an toàn khi identity/session/context không hợp lệ.
