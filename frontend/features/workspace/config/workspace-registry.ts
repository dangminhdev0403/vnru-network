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
  COLLABORATION_MANAGER: {
    key: "COLLABORATION_MANAGER",
    name: "Quản lý cộng tác",
    matchCapabilities: ["collab.opportunities.create", "collab.opportunities.publish", "collab.proposals.screen"],
    primaryLanding: "/workspace/collaboration",
  },
  RESEARCHER: {
    key: "RESEARCHER",
    name: "Nhà nghiên cứu (PI)",
    matchCapabilities: ["collab.proposals.create", "collab.proposals.submit", "projects.milestones.update"],
    primaryLanding: "/workspace/collaboration",
  },
  ORGANIZATION_REPRESENTATIVE: {
    key: "ORGANIZATION_REPRESENTATIVE",
    name: "Đại diện tổ chức",
    matchCapabilities: ["collab.proposals.endorse", "projects.reports.view_org"],
    primaryLanding: "/workspace/collaboration",
  },
  REVIEWER: {
    key: "REVIEWER",
    name: "Chuyên gia phản biện",
    matchCapabilities: ["reviews.assignments.view_assigned", "reviews.evaluations.score", "reviews.evaluations.submit"],
    primaryLanding: "/workspace/collaboration",
  },
  FOUNDATION_DECISION_MAKER: {
    key: "FOUNDATION_DECISION_MAKER",
    name: "Quản trị quyết định của Quỹ",
    matchCapabilities: ["collab.decisions.issue_foundation"],
    primaryLanding: "/workspace/collaboration",
  },
  KNOWLEDGE_CURATOR: {
    key: "KNOWLEDGE_CURATOR",
    name: "Quản trị tri thức",
    matchCapabilities: ["knowledge.workspace.view"],
    primaryLanding: "/workspace/knowledge",
  },
};

export const WORKSPACE_NAV_REGISTRY: WorkspaceNavSection[] = [
  {
    key: "overview",
    labelKey: "overview",
    items: [
      { key: "workspace_home", href: "/workspace", labelKey: "workspaceOverview", icon: "dashboard" },
      { key: "knowledge_experts", href: "/workspace/knowledge", labelKey: "knowledge", icon: "hub", requiredCapabilities: ["knowledge.workspace.view"] },
      {
        key: "collaboration_hub",
        href: "/workspace/collaboration",
        labelKey: "collaboration",
        icon: "handshake",
        requiredCapabilities: [
          "collab.opportunities.create",
          "collab.opportunities.publish",
          "collab.proposals.create",
          "collab.proposals.submit",
          "collab.proposals.confirm_paired",
          "collab.proposals.endorse",
          "collab.proposals.screen",
          "collab.decisions.issue_foundation",
          "reviews.assignments.view_assigned",
          "projects.projects.view",
        ],
      },
      {
        key: "collaboration_opportunities",
        href: "/workspace/collaboration/opportunities",
        labelKey: "opportunities",
        icon: "campaign",
        requiredCapabilities: ["collab.opportunities.create", "collab.opportunities.publish", "collab.proposals.create"],
      },
      {
        key: "collaboration_reviews",
        href: "/workspace/collaboration/reviews",
        labelKey: "reviews",
        icon: "fact_check",
        requiredCapabilities: ["reviews.assignments.view_assigned", "reviews.assignments.manage"],
      },
      {
        key: "collaboration_projects",
        href: "/workspace/collaboration/projects",
        labelKey: "projects",
        icon: "account_tree",
        requiredCapabilities: ["projects.projects.view", "projects.projects.manage"],
      },
      { key: "iam_portal", href: "/workspace/iam", labelKey: "iam", icon: "badge" },
    ],
  },
  {
    key: "governance",
    labelKey: "governance",
    items: [
      { key: "sessions_security", href: "/workspace/iam/security", labelKey: "sessions", icon: "shield_lock" },
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
  return WORKSPACE_NAV_REGISTRY.map((section) => {
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
