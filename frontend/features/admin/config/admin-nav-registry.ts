export interface AdminNavEntry {
  key: string;
  href: string;
  labelKey: string;
  icon: string;
  requiredCapabilities?: string[];
}

export interface AdminNavSection {
  key: string;
  labelKey: string;
  items: AdminNavEntry[];
}

export const ADMIN_NAV_REGISTRY: AdminNavSection[] = [
  {
    key: "access_management",
    labelKey: "access",
    items: [
      { key: "users", href: "/admin/access/users", labelKey: "users", icon: "group", requiredCapabilities: ["iam.users.manage"] },
      { key: "roles", href: "/admin/access/roles", labelKey: "roles", icon: "policy", requiredCapabilities: ["iam.roles.manage"] },
      { key: "assignments", href: "/admin/access/assignments", labelKey: "assignments", icon: "badge", requiredCapabilities: ["iam.roles.manage"] },
    ],
  },
  {
    key: "data_governance",
    labelKey: "dataGovernance",
    items: [
      { key: "catalogs", href: "/admin/catalogs", labelKey: "catalogs", icon: "category", requiredCapabilities: ["iam.roles.manage"] },
    ],
  },
  {
    key: "audit_control",
    labelKey: "auditControl",
    items: [
      { key: "audit", href: "/admin/audit", labelKey: "audit", icon: "security", requiredCapabilities: ["iam.roles.manage"] },
    ],
  },
];
