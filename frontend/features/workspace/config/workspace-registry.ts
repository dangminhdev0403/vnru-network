export interface WorkspaceNavEntry {
  key: string;
  href: string;
  labelKey: string;
  icon: string;
  requiredCapabilities?: string[];
}

export interface WorkspaceNavSection {
  key: string;
  labelKey: string;
  items: WorkspaceNavEntry[];
  requiredCapabilities?: string[];
}

export interface WorkspacePersona {
  key: string;
  name: string;
  matchCapabilities: string[];
}

export const WORKSPACE_MEMBER_CAPABILITIES = ["portal.member.access"] as const;

export const WORKSPACE_PERSONAS: Record<string, WorkspacePersona> = {
  SUPER_ADMIN: {
    key: "SUPER_ADMIN",
    name: "Quản trị tối cao",
    matchCapabilities: ["iam.roles.manage", "iam.users.manage"],
  },
  WORKSPACE_MEMBER: {
    key: "WORKSPACE_MEMBER",
    name: "Thành viên mạng lưới",
    matchCapabilities: [...WORKSPACE_MEMBER_CAPABILITIES],
  },
};

export const WORKSPACE_NAV_REGISTRY: WorkspaceNavSection[] = [
  {
    key: "workspace_overview",
    labelKey: "networkWorkspace",
    requiredCapabilities: [...WORKSPACE_MEMBER_CAPABILITIES],
    items: [
      {
        key: "workspace_overview",
        href: "/workspace",
        labelKey: "overview",
        icon: "home",
        requiredCapabilities: [...WORKSPACE_MEMBER_CAPABILITIES],
      },
    ],
  },
  {
    key: "administration",
    labelKey: "administration",
    items: [
      {
        key: "governance",
        href: "/admin/access",
        labelKey: "governance",
        icon: "policy",
        requiredCapabilities: ["iam.roles.manage"],
      },
    ],
  },
  {
    key: "account",
    labelKey: "accountSection",
    items: [
      {
        key: "sessions_security",
        href: "/security",
        labelKey: "account",
        icon: "person",
      },
    ],
  },
];

export function hasCapability(
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

export function filterNavSections(
  userCapabilities: string[] = [],
): WorkspaceNavSection[] {
  const allowedSections = hasCapability(userCapabilities, [
    "iam.roles.manage",
    "iam.users.manage",
  ])
    ? WORKSPACE_NAV_REGISTRY.filter(
        (section) => section.key !== "workspace_overview",
      )
    : WORKSPACE_NAV_REGISTRY;

  return allowedSections
    .filter((section) =>
      hasCapability(userCapabilities, section.requiredCapabilities),
    )
    .map((section) => {
      const visibleItems = section.items.filter((item) =>
        hasCapability(userCapabilities, item.requiredCapabilities),
      );
      return {
        ...section,
        items: visibleItems,
      };
    })
    .filter((section) => section.items.length > 0);
}

export function resolveUserPersonas(
  userCapabilities: string[] = [],
): WorkspacePersona[] {
  if (
    hasCapability(userCapabilities, ["iam.roles.manage", "iam.users.manage"])
  ) {
    return [WORKSPACE_PERSONAS.SUPER_ADMIN];
  }
  return WORKSPACE_PERSONAS.WORKSPACE_MEMBER.matchCapabilities.some((cap) =>
    userCapabilities.includes(cap),
  )
    ? [WORKSPACE_PERSONAS.WORKSPACE_MEMBER]
    : [];
}
