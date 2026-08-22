import { BadRequestException } from '@nestjs/common';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(val: any): boolean {
  return typeof val === 'string' && UUID_REGEX.test(val);
}

export function isBoundedString(val: any, minLen = 1, maxLen = 255): boolean {
  return typeof val === 'string' && val.trim().length >= minLen && val.trim().length <= maxLen;
}

export function validateUuid(val: any, fieldName: string): string {
  if (!isUuid(val)) {
    throw new BadRequestException(`${fieldName} must be a valid UUID`);
  }
  return val;
}

export function validateString(val: any, fieldName: string, minLen = 1, maxLen = 255): string {
  if (!isBoundedString(val, minLen, maxLen)) {
    throw new BadRequestException(`${fieldName} must be a non-empty string between ${minLen} and ${maxLen} characters`);
  }
  return val.trim();
}

export function validateOptionalString(val: any, fieldName: string, maxLen = 255): string | undefined {
  if (val === undefined || val === null) {
    return undefined;
  }
  if (typeof val !== 'string' || val.trim().length > maxLen) {
    throw new BadRequestException(`${fieldName} must be a string up to ${maxLen} characters`);
  }
  return val.trim();
}

export function validateVersion(val: any, fieldName = 'expectedVersion'): number {
  if (typeof val !== 'number' || !Number.isInteger(val) || val < 1) {
    throw new BadRequestException(`${fieldName} must be a positive integer`);
  }
  return val;
}

export function validateDate(val: any, fieldName: string): Date {
  if (typeof val !== 'string' || isNaN(Date.parse(val))) {
    throw new BadRequestException(`${fieldName} must be a valid ISO 8601 date string`);
  }
  return new Date(val);
}

export interface BootstrapProjectDto {
  decisionRef: string;
  proposalRef: string;
  fundingProgramId: string;
  title: string;
  description?: string;
  leadId: string;
  approved: boolean;
}

export function parseBootstrapDto(body: any): BootstrapProjectDto {
  if (!body || typeof body !== 'object') {
    throw new BadRequestException('Request body must be an object');
  }
  if (body.approved !== true) {
    throw new BadRequestException('Bootstrap requires explicit approved=true input');
  }
  return {
    decisionRef: validateString(body.decisionRef, 'decisionRef', 1, 255),
    proposalRef: validateString(body.proposalRef, 'proposalRef', 1, 255),
    fundingProgramId: validateUuid(body.fundingProgramId, 'fundingProgramId'),
    title: validateString(body.title, 'title', 1, 255),
    description: validateOptionalString(body.description, 'description', 5000),
    leadId: validateUuid(body.leadId, 'leadId'),
    approved: true,
  };
}

export interface AddMemberDto {
  userId: string;
  role: 'LEAD' | 'MEMBER';
}

export function parseAddMemberDto(body: any): AddMemberDto {
  if (!body || typeof body !== 'object') {
    throw new BadRequestException('Request body must be an object');
  }
  const role = body.role;
  if (role !== 'LEAD' && role !== 'MEMBER') {
    throw new BadRequestException('role must be either LEAD or MEMBER');
  }
  return {
    userId: validateUuid(body.userId, 'userId'),
    role,
  };
}

export interface DeliverableDto {
  title: string;
  description?: string;
  url?: string;
}

export interface CreateMilestoneDto {
  title: string;
  description?: string;
  dueDate: string;
  deliverables?: DeliverableDto[];
}

export function parseCreateMilestoneDto(body: any): CreateMilestoneDto {
  if (!body || typeof body !== 'object') {
    throw new BadRequestException('Request body must be an object');
  }
  const dto: CreateMilestoneDto = {
    title: validateString(body.title, 'title', 1, 255),
    description: validateOptionalString(body.description, 'description', 5000),
    dueDate: validateString(body.dueDate, 'dueDate'),
  };
  validateDate(body.dueDate, 'dueDate');

  if (body.deliverables !== undefined) {
    if (!Array.isArray(body.deliverables)) {
      throw new BadRequestException('deliverables must be an array');
    }
    dto.deliverables = body.deliverables.map((del: any, idx: number) => {
      return {
        title: validateString(del.title, `deliverables[${idx}].title`, 1, 255),
        description: validateOptionalString(del.description, `deliverables[${idx}].description`, 1000),
        url: validateOptionalString(del.url, `deliverables[${idx}].url`, 2048),
      };
    });
  }
  return dto;
}

export interface UpdateMilestoneDto {
  title?: string;
  description?: string;
  dueDate?: string;
  deliverables?: DeliverableDto[];
  expectedVersion: number;
}

export function parseUpdateMilestoneDto(body: any): UpdateMilestoneDto {
  if (!body || typeof body !== 'object') {
    throw new BadRequestException('Request body must be an object');
  }
  const dto: UpdateMilestoneDto = {
    expectedVersion: validateVersion(body.expectedVersion),
  };
  if (body.title !== undefined) {
    dto.title = validateString(body.title, 'title', 1, 255);
  }
  if (body.description !== undefined) {
    dto.description = validateOptionalString(body.description, 'description', 5000);
  }
  if (body.dueDate !== undefined) {
    dto.dueDate = validateString(body.dueDate, 'dueDate');
    validateDate(body.dueDate, 'dueDate');
  }
  if (body.deliverables !== undefined) {
    if (!Array.isArray(body.deliverables)) {
      throw new BadRequestException('deliverables must be an array');
    }
    dto.deliverables = body.deliverables.map((del: any, idx: number) => {
      return {
        title: validateString(del.title, `deliverables[${idx}].title`, 1, 255),
        description: validateOptionalString(del.description, `deliverables[${idx}].description`, 1000),
        url: validateOptionalString(del.url, `deliverables[${idx}].url`, 2048),
      };
    });
  }
  return dto;
}

export interface CreateReportDto {
  milestoneId?: string;
  title: string;
  content: string;
}

export function parseCreateReportDto(body: any): CreateReportDto {
  if (!body || typeof body !== 'object') {
    throw new BadRequestException('Request body must be an object');
  }
  return {
    milestoneId: body.milestoneId ? validateUuid(body.milestoneId, 'milestoneId') : undefined,
    title: validateString(body.title, 'title', 1, 255),
    content: validateString(body.content, 'content', 1, 10000),
  };
}

export interface UpdateReportDto {
  title?: string;
  content?: string;
  expectedVersion: number;
}

export function parseUpdateReportDto(body: any): UpdateReportDto {
  if (!body || typeof body !== 'object') {
    throw new BadRequestException('Request body must be an object');
  }
  const dto: UpdateReportDto = {
    expectedVersion: validateVersion(body.expectedVersion),
  };
  if (body.title !== undefined) {
    dto.title = validateString(body.title, 'title', 1, 255);
  }
  if (body.content !== undefined) {
    dto.content = validateString(body.content, 'content', 1, 10000);
  }
  return dto;
}

export interface ReviewDto {
  approved: boolean;
  feedback?: string;
  expectedVersion: number;
}

export function parseReviewDto(body: any): ReviewDto {
  if (!body || typeof body !== 'object') {
    throw new BadRequestException('Request body must be an object');
  }
  if (typeof body.approved !== 'boolean') {
    throw new BadRequestException('approved must be a boolean');
  }
  return {
    approved: body.approved,
    feedback: validateOptionalString(body.feedback, 'feedback', 5000),
    expectedVersion: validateVersion(body.expectedVersion),
  };
}

export interface OutcomeDto {
  outcomeType: string;
  outcomeRef: string;
}

export function parseOutcomeDto(body: any): OutcomeDto {
  if (!body || typeof body !== 'object') {
    throw new BadRequestException('Request body must be an object');
  }
  return {
    outcomeType: validateString(body.outcomeType, 'outcomeType', 1, 255),
    outcomeRef: validateString(body.outcomeRef, 'outcomeRef', 1, 1024),
  };
}

export interface TerminateDto {
  reason: string;
  expectedVersion: number;
}

export function parseTerminateDto(body: any): TerminateDto {
  if (!body || typeof body !== 'object') {
    throw new BadRequestException('Request body must be an object');
  }
  return {
    reason: validateString(body.reason, 'reason', 1, 5000),
    expectedVersion: validateVersion(body.expectedVersion),
  };
}

export interface SubmitDto {
  expectedVersion: number;
}

export function parseSubmitDto(body: any): SubmitDto {
  if (!body || typeof body !== 'object') {
    throw new BadRequestException('Request body must be an object');
  }
  return {
    expectedVersion: validateVersion(body.expectedVersion),
  };
}

export interface CompleteDto {
  expectedVersion: number;
}

export function parseCompleteDto(body: any): CompleteDto {
  if (!body || typeof body !== 'object') {
    throw new BadRequestException('Request body must be an object');
  }
  return {
    expectedVersion: validateVersion(body.expectedVersion),
  };
}
