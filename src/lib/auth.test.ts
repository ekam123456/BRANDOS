import { describe, expect, it } from "vitest";
import { AuthorizationError, assertTenantAccess } from "@/lib/tenant";

describe("tenant authorization", () => {
  it("allows the active organization", () => {
    expect(() => assertTenantAccess("org_123", "org_123")).not.toThrow();
  });

  it("rejects a cross-tenant request", () => {
    expect(() => assertTenantAccess("org_123", "org_456")).toThrowError(AuthorizationError);
  });

  it("rejects a request without an active organization", () => {
    expect(() => assertTenantAccess(null, "org_123")).toThrowError(AuthorizationError);
  });
});
