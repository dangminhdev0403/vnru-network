export type RoleType = 
  | 'researcher' 
  | 'reviewer' 
  | 'organization' 
  | 'enterprise' 
  | 'leadership' 
  | 'governance';

export interface RoleConfig {
  id: RoleType;
  name: string;
  badgeLabel: string;
  description: string;
  accentColor: string;
  softBg: string;
  avatarText: string;
  avatarOrg: string;
  homePath: string;
}

export interface ProposalItem {
  id: string;
  code: string;
  title: string;
  field: string;
  vnPi: string;
  vnOrg: string;
  ruPi: string;
  ruOrg: string;
  status: 'DRAFT' | 'PENDING_COPI' | 'UNDER_REVIEW' | 'ENDORSED' | 'APPROVED' | 'ACTIVE';
  statusLabel: string;
  progressPercent?: number;
  durationMonths: number;
  expectedOutcomes: string;
}

export interface RubricScore {
  novelty: number;
  methodology: number;
  feasibility: number;
  impact: number;
  comments: string;
}

export interface ConsortiumSlot {
  type: 'vn-inst' | 'vn-ent' | 'ru-inst' | 'ru-ent';
  typeLabel: string;
  country: 'VN' | 'RU';
  orgName?: string;
  deptName?: string;
  leadName?: string;
  isFilled: boolean;
}
