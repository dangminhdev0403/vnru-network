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
    labelKey: "roleWorkspace",
    items: [
      { key: "researcher_overview", href: "/workspace/researcher", labelKey: "overview", icon: "home", requiredCapabilities: ["collab.proposals.create"] },
      { key: "researcher_knowledge", href: "/workspace/researcher?view=knowledge", labelKey: "myKnowledge", icon: "library_books", requiredCapabilities: ["collab.proposals.create"] },
      { key: "researcher_collaboration", href: "/workspace/researcher?view=collaboration", labelKey: "researchCollaboration", icon: "sync_alt", requiredCapabilities: ["collab.proposals.create"] },
      { key: "researcher_projects", href: "/workspace/researcher?view=projects", labelKey: "myProjects", icon: "view_in_ar", requiredCapabilities: ["collab.proposals.create"] },
      { key: "researcher_academic", href: "/workspace/researcher?view=academic", labelKey: "academicExchange", icon: "menu_book", requiredCapabilities: ["collab.proposals.create"] },
      { key: "reviewer_overview", href: "/workspace/reviewer", labelKey: "reviewOverview", icon: "dashboard", requiredCapabilities: ["reviews.assignments.view_assigned"] },
      { key: "reviewer_assignments", href: "/workspace/reviewer?view=assignments", labelKey: "assignedDossiers", icon: "assignment", requiredCapabilities: ["reviews.assignments.view_assigned"] },
      { key: "reviewer_evaluation", href: "/workspace/reviewer?view=evaluation", labelKey: "evaluationWorkspace", icon: "rate_review", requiredCapabilities: ["reviews.assignments.view_assigned"] },
      { key: "reviewer_history", href: "/workspace/reviewer?view=history", labelKey: "reviewHistory", icon: "history", requiredCapabilities: ["reviews.assignments.view_assigned"] },
      { key: "organization_overview", href: "/workspace/organization", labelKey: "organizationOverview", icon: "domain", requiredCapabilities: ["collab.proposals.endorse"] },
      { key: "organization_endorsements", href: "/workspace/organization?view=endorsements", labelKey: "endorsementQueue", icon: "fact_check", requiredCapabilities: ["collab.proposals.endorse"] },
      { key: "organization_projects", href: "/workspace/organization?view=projects", labelKey: "relatedProjects", icon: "account_tree", requiredCapabilities: ["collab.proposals.endorse"] },
      { key: "organization_activity", href: "/workspace/organization?view=activity", labelKey: "organizationActivity", icon: "monitoring", requiredCapabilities: ["collab.proposals.endorse"] },
    ],
  },
  {
    key: "administration",
    labelKey: "administration",
    items: [
      { key: "governance", href: "/admin/access", labelKey: "governance", icon: "policy", requiredCapabilities: ["iam.roles.manage"] },
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
