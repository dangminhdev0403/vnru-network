export * from "./experts";
export * from "./organizations";
export * from "./opportunities";
export * from "./proposals";
export * from "./projects";
export * from "./reviews";
export * from "./reports";
export * from "./notifications";
export * from "./activities";
export * from "./academic-events";
export * from "./knowledge";
export * from "./iam";
export * from "./endorsements";
export * from "./decisions";

import { DEMO_ACADEMIC_EVENTS } from "./academic-events";
import { DEMO_ACTIVITIES } from "./activities";
import { DEMO_DECISIONS } from "./decisions";
import { DEMO_ENDORSEMENTS } from "./endorsements";
import { DEMO_EXPERTS } from "./experts";
import { DEMO_IAM_USERS } from "./iam";
import { DEMO_KNOWLEDGE_RESOURCES } from "./knowledge";
import { DEMO_NOTIFICATIONS } from "./notifications";
import { DEMO_OPPORTUNITIES } from "./opportunities";
import { DEMO_ORGANIZATIONS } from "./organizations";
import { DEMO_PROJECTS } from "./projects";
import { DEMO_PROPOSALS } from "./proposals";
import { DEMO_REPORTS } from "./reports";
import { DEMO_REVIEWS } from "./reviews";

export function getMockDataStats() {
  return {
    experts: DEMO_EXPERTS.length,
    organizations: DEMO_ORGANIZATIONS.length,
    opportunities: DEMO_OPPORTUNITIES.length,
    proposals: DEMO_PROPOSALS.length,
    projects: DEMO_PROJECTS.length,
    reviews: DEMO_REVIEWS.length,
    reports: DEMO_REPORTS.length,
    notifications: DEMO_NOTIFICATIONS.length,
    activities: DEMO_ACTIVITIES.length,
    academicEvents: DEMO_ACADEMIC_EVENTS.length,
    knowledgeResources: DEMO_KNOWLEDGE_RESOURCES.length,
    iamUsers: DEMO_IAM_USERS.length,
    endorsements: DEMO_ENDORSEMENTS.length,
    decisions: DEMO_DECISIONS.length,
  };
}
