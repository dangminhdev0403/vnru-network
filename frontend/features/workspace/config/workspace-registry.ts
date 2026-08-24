export interface WorkspaceNavEntry {
  key: string;
  href: string;
  labelKey: string;
  icon: string;
  requiredCapabilities?: string[];
  matchContexts?: string[];
}

export interface WorkspaceNavSection {
  key: string;
  labelKey: string;
  items: WorkspaceNavEntry[];
  requiredCapabilities?: string[];
}

export interface WorkspaceWidget {
  key: string;
  labelKey: string;
  icon: string;
  requiredCapabilities?: string[];
}

export interface WorkspacePersona {
  key: string;
  name: string;
  matchCapabilities: string[];
  primaryLanding: string;
}

export const WORKSPACE_PERSONAS: Record<string, WorkspacePersona> = {
  SUPER_ADMIN: {
    key: "SUPER_ADMIN",
    name: "Quản trị tối cao",
    matchCapabilities: ["iam.roles.manage", "iam.users.manage"],
    primaryLanding: "/admin/access",
  },
  RESEARCHER: {
    key: "RESEARCHER",
    name: "Nhà nghiên cứu",
    matchCapabilities: ["collab.proposals.create"],
    primaryLanding: "/workspace/researcher",
  },
  REVIEWER: {
    key: "REVIEWER",
    name: "Hội đồng phản biện",
    matchCapabilities: ["reviews.assignments.view_assigned"],
    primaryLanding: "/workspace/reviewer",
  },
  ORGANIZATION_REPRESENTATIVE: {
    key: "ORGANIZATION_REPRESENTATIVE",
    name: "Đại diện tổ chức",
    matchCapabilities: ["collab.proposals.endorse"],
    primaryLanding: "/workspace/organization",
  },
};

export const WORKSPACE_NAV_REGISTRY: WorkspaceNavSection[] = [
  {
    key: "workspace_modules",
    labelKey: "workspaceModules",
    items: [
      { key: "researcher", href: "/workspace/researcher", labelKey: "researcher", icon: "science", requiredCapabilities: ["collab.proposals.create"] },
      { key: "reviewer", href: "/workspace/reviewer", labelKey: "reviewer", icon: "rate_review", requiredCapabilities: ["reviews.assignments.view_assigned"] },
      { key: "organization", href: "/workspace/organization", labelKey: "organization", icon: "domain", requiredCapabilities: ["collab.proposals.endorse"] },
    ],
  },
  {
    key: "administration",
    labelKey: "administration",
    items: [
      { key: "governance", href: "/governance", labelKey: "governance", icon: "policy", requiredCapabilities: ["iam.roles.manage"] },
      { key: "access_control", href: "/admin/access/roles", labelKey: "accessControl", icon: "manage_accounts", requiredCapabilities: ["iam.roles.manage"] },
      { key: "audit", href: "/admin/audit", labelKey: "audit", icon: "security", requiredCapabilities: ["iam.audit.view", "iam.roles.manage"] },
    ],
  },
  {
    key: "account",
    labelKey: "account",
    items: [
      { key: "account_profile", href: "/account", labelKey: "accountProfile", icon: "person" },
      { key: "sessions_security", href: "/security", labelKey: "security", icon: "shield_lock" },
    ],
  },
];

export function hasCapability(userCapabilities: string[], required?: string | string[]): boolean {
  if (!required || (Array.isArray(required) && required.length === 0)) return true;
  if (Array.isArray(required)) {
    return required.some((cap) => userCapabilities.includes(cap));
  }
  return userCapabilities.includes(required);
}

export function filterNavSections(userCapabilities: string[] = []): WorkspaceNavSection[] {
  return WORKSPACE_NAV_REGISTRY.filter((section) =>
    hasCapability(userCapabilities, section.requiredCapabilities),
  ).map((section) => {
    const visibleItems = section.items.filter((item) => hasCapability(userCapabilities, item.requiredCapabilities));
    return {
      ...section,
      items: visibleItems,
    };
  }).filter((section) => section.items.length > 0);
}

export function resolveUserPersonas(userCapabilities: string[] = []): WorkspacePersona[] {
  return Object.values(WORKSPACE_PERSONAS).filter((persona) =>
    persona.matchCapabilities.some((cap) => userCapabilities.includes(cap))
  );
}
