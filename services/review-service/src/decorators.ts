import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedUser } from './auth.guard';

export const RequireContext = (contextType: string) => SetMetadata('contextType', contextType);
export const RequireCapability = (capability: string) => SetMetadata('capability', capability);

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
