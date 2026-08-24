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
}

export const WORKSPACE_MEMBER_CAPABILITIES = [
  "collab.proposals.create",
  "reviews.assignments.view_assigned",
  "collab.proposals.endorse",
  "collab.opportunities.create",
  "collab.proposals.screen",
  "reviews.assignments.manage",
  "collab.decisions.issue_foundation",
] as const;

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
      { key: "workspace_overview", href: "/workspace", labelKey: "overview", icon: "home", requiredCapabilities: [...WORKSPACE_MEMBER_CAPABILITIES] },
    ],
  },
  {
    key: "research",
    labelKey: "research",
    items: [
      { key: "researcher_knowledge", href: "/workspace/researcher?view=knowledge", labelKey: "myKnowledge", icon: "library_books", requiredCapabilities: ["collab.proposals.create"] },
      { key: "researcher_collaboration", href: "/workspace/researcher?view=collaboration", labelKey: "researchCollaboration", icon: "sync_alt", requiredCapabilities: ["collab.proposals.create"] },
      { key: "researcher_projects", href: "/workspace/researcher?view=projects", labelKey: "myProjects", icon: "view_in_ar", requiredCapabilities: ["collab.proposals.create"] },
      { key: "researcher_academic", href: "/workspace/researcher?view=academic", labelKey: "academicExchange", icon: "menu_book", requiredCapabilities: ["collab.proposals.create"] },
    ],
  },
  {
    key: "review",
    labelKey: "review",
    items: [
      { key: "reviewer_assignments", href: "/workspace/reviewer?view=assignments", labelKey: "assignedDossiers", icon: "assignment", requiredCapabilities: ["reviews.assignments.view_assigned"] },
      { key: "reviewer_evaluation", href: "/workspace/reviewer?view=evaluation", labelKey: "evaluationWorkspace", icon: "rate_review", requiredCapabilities: ["reviews.assignments.view_assigned"] },
      { key: "reviewer_history", href: "/workspace/reviewer?view=history", labelKey: "reviewHistory", icon: "history", requiredCapabilities: ["reviews.assignments.view_assigned"] },
    ],
  },
  {
    key: "organization",
    labelKey: "organizationSection",
    items: [
      { key: "organization_endorsements", href: "/workspace/organization?view=endorsements", labelKey: "endorsementQueue", icon: "fact_check", requiredCapabilities: ["collab.proposals.endorse"] },
      { key: "organization_projects", href: "/workspace/organization?view=projects", labelKey: "relatedProjects", icon: "account_tree", requiredCapabilities: ["collab.proposals.endorse"] },
      { key: "organization_activity", href: "/workspace/organization?view=activity", labelKey: "organizationActivity", icon: "monitoring", requiredCapabilities: ["collab.proposals.endorse"] },
    ],
  },
  {
    key: "coordination",
    labelKey: "coordination",
    items: [
      { key: "manager_opportunities", href: "/workspace/collaboration?view=opportunities", labelKey: "opportunityManagement", icon: "campaign", requiredCapabilities: ["collab.opportunities.create", "collab.opportunities.publish"] },
      { key: "manager_screening", href: "/workspace/collaboration?view=screening", labelKey: "proposalScreening", icon: "rule", requiredCapabilities: ["collab.proposals.screen"] },
      { key: "manager_assignments", href: "/workspace/collaboration?view=assignments", labelKey: "reviewAssignments", icon: "assignment_ind", requiredCapabilities: ["reviews.assignments.manage"] },
      { key: "manager_projects", href: "/workspace/collaboration?view=projects", labelKey: "programProjects", icon: "account_tree", requiredCapabilities: ["collab.opportunities.create"] },
      { key: "manager_reports", href: "/workspace/collaboration?view=reports", labelKey: "reportApprovals", icon: "task", requiredCapabilities: ["projects.reports.approve"] },
    ],
  },
  {
    key: "decision",
    labelKey: "decisionSection",
    items: [
      { key: "decision_queue", href: "/workspace/decisions?view=queue", labelKey: "decisionQueue", icon: "pending_actions", requiredCapabilities: ["collab.decisions.issue_foundation"] },
      { key: "decision_history", href: "/workspace/decisions?view=history", labelKey: "decisionHistory", icon: "history", requiredCapabilities: ["collab.decisions.issue_foundation"] },
      { key: "decision_projects", href: "/workspace/decisions?view=projects", labelKey: "decisionProjects", icon: "view_in_ar", requiredCapabilities: ["collab.decisions.issue_foundation"] },
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
  const allowedSections = hasCapability(userCapabilities, ["iam.roles.manage", "iam.users.manage"])
    ? WORKSPACE_NAV_REGISTRY.filter((section) => !["workspace_overview", "research", "review", "organization", "coordination", "decision"].includes(section.key))
    : WORKSPACE_NAV_REGISTRY;

  return allowedSections.filter((section) =>
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
  if (hasCapability(userCapabilities, ["iam.roles.manage", "iam.users.manage"])) {
    return [WORKSPACE_PERSONAS.SUPER_ADMIN];
  }
  return WORKSPACE_PERSONAS.WORKSPACE_MEMBER.matchCapabilities.some((cap) => userCapabilities.includes(cap))
    ? [WORKSPACE_PERSONAS.WORKSPACE_MEMBER]
    : [];
}
