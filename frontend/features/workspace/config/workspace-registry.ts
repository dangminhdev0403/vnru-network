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
};

export const WORKSPACE_NAV_REGISTRY: WorkspaceNavSection[] = [
  {
    key: "workspace_modules",
    labelKey: "workspaceModules",
    items: [
      { key: "workspace_hub", href: "/workspace", labelKey: "workspaceHub", icon: "space_dashboard" },
      { key: "researcher", href: "/workspace/researcher", labelKey: "researcher", icon: "science" },
      { key: "reviewer", href: "/workspace/reviewer", labelKey: "reviewer", icon: "rate_review" },
      { key: "organization", href: "/workspace/organization", labelKey: "organization", icon: "domain" },
      { key: "enterprise", href: "/workspace/enterprise", labelKey: "enterprise", icon: "handshake" },
      { key: "leadership", href: "/workspace/leadership", labelKey: "leadership", icon: "analytics" },
    ],
  },
  {
    key: "administration",
    labelKey: "administration",
    items: [
      { key: "governance", href: "/governance", labelKey: "governance", icon: "policy" },
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
