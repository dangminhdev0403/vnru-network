import { Injectable } from '@nestjs/common';
import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationRequest,
} from './authorization.types';

@Injectable()
export class AuthorizationService {
  authorize(
    context: AuthorizationContext,
    request: AuthorizationRequest,
  ): AuthorizationDecision {
    if (!this.isValidContext(context)) {
      return { allowed: false, reason: 'INVALID_CONTEXT' };
    }

    if (!context.permissions.includes(request.requiredPermission)) {
      return { allowed: false, reason: 'MISSING_PERMISSION' };
    }

    if (!request.resourceScopeMatched) {
      return { allowed: false, reason: 'RESOURCE_SCOPE_MISMATCH' };
    }

    return { allowed: true };
  }

  private isValidContext(context: AuthorizationContext): boolean {
    return Boolean(context.userId.trim() && context.contextId.trim());
  }
}
