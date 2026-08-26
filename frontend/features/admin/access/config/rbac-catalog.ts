export type AccessScope = "Own" | "Organization" | "Portal" | "Global";

export interface PermissionDefinition {
  key: string;
  module: {
    vi: string;
    en: string;
    ru: string;
  };
  moduleKey: "iam" | "content" | "collab" | "knowledge";
  resource: {
    vi: string;
    en: string;
    ru: string;
  };
  action: {
    vi: string;
    en: string;
    ru: string;
  };
  actionType:
    | "read"
    | "create"
    | "update"
    | "publish"
    | "delete"
    | "manage"
    | "access";
  supportedScopes: AccessScope[];
  description: {
    vi: string;
    en: string;
    ru: string;
  };
}

export const PERMISSION_CATALOG: PermissionDefinition[] = [
  // ── IAM Module ──
  {
    key: "iam.users.manage",
    module: {
      vi: "Quản trị danh tính",
      en: "Identity Governance",
      ru: "Управление доступом",
    },
    moduleKey: "iam",
    resource: {
      vi: "Người dùng",
      en: "Users",
      ru: "Пользователи",
    },
    action: {
      vi: "Quản lý người dùng",
      en: "Manage Users",
      ru: "Управление пользователями",
    },
    actionType: "manage",
    supportedScopes: ["Portal", "Global"],
    description: {
      vi: "Quản lý tài khoản, thay đổi trạng thái hoạt động và cấp lại mật khẩu người dùng.",
      en: "Manage user accounts, toggle active status, and reset credentials.",
      ru: "Управление учетными записями, изменение статуса и сброс паролей.",
    },
  },
  {
    key: "iam.roles.manage",
    module: {
      vi: "Quản trị danh tính",
      en: "Identity Governance",
      ru: "Управление доступом",
    },
    moduleKey: "iam",
    resource: {
      vi: "Vai trò & Quyền",
      en: "Roles & Permissions",
      ru: "Роли и права",
    },
    action: {
      vi: "Quản lý vai trò",
      en: "Manage Roles",
      ru: "Управление ролями",
    },
    actionType: "manage",
    supportedScopes: ["Global"],
    description: {
      vi: "Cấu hình vai trò, phân quyền chức năng và gán vai trò trong ngữ cảnh hệ thống.",
      en: "Configure roles, assign capability matrices, and manage permissions.",
      ru: "Настройка ролей, распределение прав и управление доступом.",
    },
  },
  {
    key: "iam.audit.view",
    module: {
      vi: "Quản trị danh tính",
      en: "Identity Governance",
      ru: "Управление доступом",
    },
    moduleKey: "iam",
    resource: {
      vi: "Nhật ký kiểm toán",
      en: "Audit Trail",
      ru: "Журнал аудита",
    },
    action: {
      vi: "Xem nhật ký kiểm toán",
      en: "View Audit Trail",
      ru: "Просмотр журнала аудита",
    },
    actionType: "read",
    supportedScopes: ["Portal", "Global"],
    description: {
      vi: "Truy vết và xem toàn bộ nhật ký sự kiện bảo mật, đăng nhập và thay đổi quyền.",
      en: "Audit trail inspection for security events, authentication, and role assignments.",
      ru: "Просмотр журнала аудита безопасности и изменений прав.",
    },
  },

  // ── Content & Portal Module ──
  {
    key: "portal.member.access",
    module: {
      vi: "Nội dung & Thành viên",
      en: "Content & Members",
      ru: "Контент и участники",
    },
    moduleKey: "content",
    resource: {
      vi: "Không gian làm việc",
      en: "Workspace",
      ru: "Рабочее пространство",
    },
    action: {
      vi: "Truy cập Portal thành viên",
      en: "Access Member Portal",
      ru: "Доступ к порталу участников",
    },
    actionType: "access",
    supportedScopes: ["Own", "Portal"],
    description: {
      vi: "Quyền truy cập vào khu vực làm việc và các công cụ dành cho thành viên mạng lưới.",
      en: "Access to member workspace features and collaborative networks.",
      ru: "Доступ к рабочему пространству участника сети.",
    },
  },
  {
    key: "content.article.read",
    module: {
      vi: "Nội dung & Thành viên",
      en: "Content & Members",
      ru: "Контент и участники",
    },
    moduleKey: "content",
    resource: {
      vi: "Bài viết",
      en: "Articles",
      ru: "Статьи",
    },
    action: {
      vi: "Xem bài viết",
      en: "View Articles",
      ru: "Просмотр статей",
    },
    actionType: "read",
    supportedScopes: ["Own", "Portal", "Global"],
    description: {
      vi: "Xem chi tiết các bài viết, ấn phẩm và tài liệu nghiên cứu chuyên ngành.",
      en: "View published research papers, publications, and news articles.",
      ru: "Просмотр опубликованных исследовательских статей и материалов.",
    },
  },
  {
    key: "content.article.create",
    module: {
      vi: "Nội dung & Thành viên",
      en: "Content & Members",
      ru: "Контент и участники",
    },
    moduleKey: "content",
    resource: {
      vi: "Bài viết",
      en: "Articles",
      ru: "Статьи",
    },
    action: {
      vi: "Tạo bài viết",
      en: "Create Articles",
      ru: "Создание статей",
    },
    actionType: "create",
    supportedScopes: ["Own"],
    description: {
      vi: "Khởi tạo và soạn thảo bài viết, tin tức khoa học công nghệ mới.",
      en: "Create and draft new science & technology articles.",
      ru: "Создание и редактирование черновиков научных статей.",
    },
  },
  {
    key: "content.article.update",
    module: {
      vi: "Nội dung & Thành viên",
      en: "Content & Members",
      ru: "Контент и участники",
    },
    moduleKey: "content",
    resource: {
      vi: "Bài viết",
      en: "Articles",
      ru: "Статьи",
    },
    action: {
      vi: "Sửa bài viết",
      en: "Edit Articles",
      ru: "Редактирование статей",
    },
    actionType: "update",
    supportedScopes: ["Own", "Portal"],
    description: {
      vi: "Cập nhật và chỉnh sửa nội dung bài viết của mình hoặc trong phân quyền cho phép.",
      en: "Update and edit article contents within permitted boundary.",
      ru: "Редактирование содержания статей в пределах полномочий.",
    },
  },
  {
    key: "content.article.publish",
    module: {
      vi: "Nội dung & Thành viên",
      en: "Content & Members",
      ru: "Контент и участники",
    },
    moduleKey: "content",
    resource: {
      vi: "Bài viết",
      en: "Articles",
      ru: "Статьи",
    },
    action: {
      vi: "Xuất bản bài viết",
      en: "Publish Articles",
      ru: "Публикация статей",
    },
    actionType: "publish",
    supportedScopes: ["Portal", "Global"],
    description: {
      vi: "Phê duyệt bài viết đã thẩm định và phát hành công khai lên cổng thông tin.",
      en: "Approve reviewed submissions and publish them publicly to the portal.",
      ru: "Публикация одобренных материалов на портале.",
    },
  },

  // ── Collaboration Module ──
  {
    key: "collab.proposals.create",
    module: {
      vi: "Hợp tác & Đề xuất",
      en: "Collaboration & Proposals",
      ru: "Сотрудничество и проекты",
    },
    moduleKey: "collab",
    resource: {
      vi: "Đề xuất hợp tác",
      en: "Proposals",
      ru: "Проекты сотрудничества",
    },
    action: {
      vi: "Tạo đề xuất",
      en: "Create Proposals",
      ru: "Создание проектов",
    },
    actionType: "create",
    supportedScopes: ["Organization"],
    description: {
      vi: "Khởi xướng đề xuất hợp tác nghiên cứu khoa học song phương Việt - Nga.",
      en: "Initiate bilateral Vietnam - Russia scientific collaboration proposals.",
      ru: "Создание предложений по двустороннему научно-техническому сотрудничеству.",
    },
  },
  {
    key: "collab.proposals.review",
    module: {
      vi: "Hợp tác & Đề xuất",
      en: "Collaboration & Proposals",
      ru: "Сотрудничество и проекты",
    },
    moduleKey: "collab",
    resource: {
      vi: "Đề xuất hợp tác",
      en: "Proposals",
      ru: "Проекты сотрудничества",
    },
    action: {
      vi: "Thẩm định đề xuất",
      en: "Review Proposals",
      ru: "Рецензирование проектов",
    },
    actionType: "update",
    supportedScopes: ["Organization", "Global"],
    description: {
      vi: "Đánh giá, chấm điểm và phản hồi các đề xuất dự án khoa học công nghệ.",
      en: "Review, evaluate, and provide feedback on scientific project proposals.",
      ru: "Экспертная оценка и рецензирование научно-технических проектов.",
    },
  },

  // ── Knowledge & Events ──
  {
    key: "knowledge.publications.submit",
    module: {
      vi: "Tri thức & Ấn phẩm",
      en: "Knowledge & Publications",
      ru: "База знаний и публикации",
    },
    moduleKey: "knowledge",
    resource: {
      vi: "Ấn phẩm",
      en: "Publications",
      ru: "Публикации",
    },
    action: {
      vi: "Đăng ký ấn phẩm",
      en: "Submit Publications",
      ru: "Регистрация публикаций",
    },
    actionType: "create",
    supportedScopes: ["Own", "Organization"],
    description: {
      vi: "Đăng ký lưu trữ và chia sẻ công trình nghiên cứu vào kho tri thức số.",
      en: "Register and archive research works into the digital knowledge repository.",
      ru: "Регистрация и передача научных трудов в цифровой репозиторий.",
    },
  },
];

export const SCOPE_DESCRIPTIONS: Record<
  AccessScope,
  {
    label: { vi: string; en: string; ru: string };
    desc: { vi: string; en: string; ru: string };
    color: string;
  }
> = {
  Own: {
    label: { vi: "Cá nhân (Own)", en: "Own", ru: "Личный (Own)" },
    desc: {
      vi: "Truy cập và thao tác chỉ trên tài nguyên do chính người dùng sở hữu hoặc tạo ra.",
      en: "Access only resources owned or created by the user.",
      ru: "Доступ только к ресурсам, созданным самим пользователем.",
    },
    color:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
  },
  Organization: {
    label: {
      vi: "Tổ chức (Organization)",
      en: "Organization",
      ru: "Организация (Org)",
    },
    desc: {
      vi: "Thao tác trên toàn bộ tài nguyên thuộc tổ chức / đơn vị nghiên cứu của người dùng.",
      en: "Access all resources within the user's organization or research unit.",
      ru: "Доступ ко всем ресурсам организации или научного института.",
    },
    color:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
  },
  Portal: {
    label: { vi: "Cổng thông tin (Portal)", en: "Portal", ru: "Портал (Portal)" },
    desc: {
      vi: "Quyền hạn áp dụng trên toàn bộ phân hệ cổng thông tin và thành viên.",
      en: "Access across the entire member portal and networking boundaries.",
      ru: "Действует на всем портале участников сети.",
    },
    color:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
  },
  Global: {
    label: { vi: "Toàn hệ thống (Global)", en: "Global", ru: "Глобальный (Global)" },
    desc: {
      vi: "Quyền hạn cao nhất toàn hệ thống nền tảng, không bị giới hạn phạm vi.",
      en: "Platform-wide authority across all modules and boundaries.",
      ru: "Наивысшие полномочия во всей платформе без ограничений.",
    },
    color:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300",
  },
};
