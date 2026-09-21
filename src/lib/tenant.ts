export class AuthorizationError extends Error {
  readonly status: 401 | 403;

  constructor(message: string, status: 401 | 403) {
    super(message);
    this.name = "AuthorizationError";
    this.status = status;
  }
}

export function assertTenantAccess(sessionOrganizationId: string | null | undefined, requestedOrganizationId: string) {
  if (!sessionOrganizationId) {
    throw new AuthorizationError("An active organization is required.", 403);
  }
  if (sessionOrganizationId !== requestedOrganizationId) {
    throw new AuthorizationError("The requested organization is not available in this session.", 403);
  }
}
