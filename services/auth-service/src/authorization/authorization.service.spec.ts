import { AuthorizationService } from './authorization.service';

describe('AuthorizationService', () => {
  let service: AuthorizationService;

  beforeEach(() => {
    service = new AuthorizationService();
  });

  it('allows a request when the active context has the permission and resource scope matches', () => {
    expect(
      service.authorize(
        {
          userId: 'usr_1',
          contextId: 'ctx_researcher_1',
          permissions: ['grants.proposals.sign_paired'],
        },
        {
          requiredPermission: 'grants.proposals.sign_paired',
          resourceScopeMatched: true,
        },
      ),
    ).toEqual({ allowed: true });
  });

  it('denies when the active context is invalid', () => {
    expect(
      service.authorize(
        {
          userId: '',
          contextId: 'ctx_researcher_1',
          permissions: ['grants.proposals.sign_paired'],
        },
        {
          requiredPermission: 'grants.proposals.sign_paired',
          resourceScopeMatched: true,
        },
      ),
    ).toEqual({ allowed: false, reason: 'INVALID_CONTEXT' });
  });

  it('denies when the required permission is missing', () => {
    expect(
      service.authorize(
        {
          userId: 'usr_1',
          contextId: 'ctx_researcher_1',
          permissions: ['experts.profiles.update_own'],
        },
        {
          requiredPermission: 'grants.proposals.sign_paired',
          resourceScopeMatched: true,
        },
      ),
    ).toEqual({ allowed: false, reason: 'MISSING_PERMISSION' });
  });

  it('denies when the resource scope does not match', () => {
    expect(
      service.authorize(
        {
          userId: 'usr_1',
          contextId: 'ctx_reviewer_1',
          permissions: ['reviews.evaluations.view_assigned'],
        },
        {
          requiredPermission: 'reviews.evaluations.view_assigned',
          resourceScopeMatched: false,
        },
      ),
    ).toEqual({ allowed: false, reason: 'RESOURCE_SCOPE_MISMATCH' });
  });
});
