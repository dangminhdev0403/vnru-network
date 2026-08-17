export interface AuthorizationContext {
  userId: string;
  contextId: string;
  permissions: readonly string[];
}

export interface AuthorizationRequest {
  requiredPermission: string;
  resourceScopeMatched: boolean;
}

export type AuthorizationDenyReason =
  | 'INVALID_CONTEXT'
  | 'MISSING_PERMISSION'
  | 'RESOURCE_SCOPE_MISMATCH';

export type AuthorizationDecision =
  | { allowed: true }
  | { allowed: false; reason: AuthorizationDenyReason };
