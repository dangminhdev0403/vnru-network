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
      {
        key: "overview",
        href: "/admin/access",
        labelKey: "overview",
        icon: "space_dashboard",
        requiredCapabilities: ["iam.users.manage", "iam.roles.manage"],
      },
      {
        key: "users",
        href: "/admin/access/users",
        labelKey: "users",
        icon: "group",
        requiredCapabilities: ["iam.users.manage"],
      },
      {
        key: "roles",
        href: "/admin/access/roles",
        labelKey: "roles",
        icon: "policy",
        requiredCapabilities: ["iam.roles.manage"],
      },
      {
        key: "permissions",
        href: "/admin/access/permissions",
        labelKey: "permissions",
        icon: "key",
        requiredCapabilities: ["iam.roles.manage"],
      },
      {
        key: "logs",
        href: "/admin/access/logs",
        labelKey: "logs",
        icon: "receipt_long",
        requiredCapabilities: ["iam.roles.manage"],
      },
    ],
  },
];

export function hasAdminCapability(
  userCapabilities: string[],
  required?: string | string[],
): boolean {
  if (!required || (Array.isArray(required) && required.length === 0))
    return true;
  if (Array.isArray(required)) {
    return required.some((cap) => userCapabilities.includes(cap));
  }
  return userCapabilities.includes(required);
}

export function filterAdminNavSections(
  userCapabilities: string[] = [],
): AdminNavSection[] {
  return ADMIN_NAV_REGISTRY.map((section) => {
    const visibleItems = section.items.filter((item) =>
      hasAdminCapability(userCapabilities, item.requiredCapabilities),
    );
    return {
      ...section,
      items: visibleItems,
    };
  }).filter((section) => section.items.length > 0);
}
