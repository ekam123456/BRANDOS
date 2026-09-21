import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { requirePermission } from "@/lib/authorization";
import { recordAuditEventInTransaction } from "@/lib/audit";
import { withTenantTransaction } from "@/lib/prisma";

export const providerCatalog = {
  googleAnalytics: {
    id: "google-analytics",
    label: "Google Analytics",
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    whatAccesses: "Read-only property reports such as sessions and active users.",
    why: "To ground the Business Brain in observed website or app usage.",
    whatLearns: "Provider-reported traffic metrics only; no visitor identities or message content.",
    docs: "https://developers.google.com/analytics/devguides/reporting/data/v1",
  },
} as const;

const connectionProviderSchema = z.enum(["google-analytics"]);
const encryptionKeyName = "INTEGRATION_CREDENTIAL_ENCRYPTION_KEY";

function key() {
  const value = process.env[encryptionKeyName];
  if (!value) throw new Error(`${encryptionKeyName} is required before OAuth credentials can be stored.`);
  const buffer = Buffer.from(value, "base64");
  if (buffer.length !== 32) throw new Error(`${encryptionKeyName} must be a base64-encoded 256-bit key.`);
  return buffer;
}

function encryptCredentials(credentials: Record<string, unknown>) {
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), nonce);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(credentials), "utf8"), cipher.final()]);
  return { ciphertext: ciphertext.toString("base64"), nonce: nonce.toString("base64"), tag: cipher.getAuthTag().toString("base64") };
}

function decryptCredentials(ciphertext: string, nonce: string, tag: string): Record<string, string> {
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(nonce, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(ciphertext, "base64")), decipher.final()]).toString("utf8")) as Record<string, string>;
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function base64Url(value: Buffer) {
  return value.toString("base64url");
}

function googleConfig() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_ANALYTICS_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) throw new Error("Google Analytics OAuth is not configured.");
  return { clientId, clientSecret, redirectUri };
}

export async function beginConnection(rawProvider: unknown) {
  const provider = connectionProviderSchema.parse(rawProvider);
  const { organizationId } = await requirePermission("business.write");
  const business = await withTenantTransaction(organizationId, (tx) => tx.business.findUnique({ where: { organizationId } }));
  if (!business) throw new Error("Complete business setup before connecting a source.");

  const config = googleConfig();
  const state = base64Url(randomBytes(32));
  const verifier = base64Url(randomBytes(32));
  const challenge = base64Url(createHash("sha256").update(verifier).digest());
  await withTenantTransaction(organizationId, (tx) => tx.oAuthState.create({
    data: { organizationId, businessId: business.id, provider, stateHash: sha256(state), codeVerifier: verifier, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
  }));

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: providerCatalog.googleAnalytics.scopes.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  return { url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`, state };
}

async function providerFetch(url: string, init: RequestInit = {}) {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`provider_request_failed_${response.status}`);
  return response.json() as Promise<Record<string, unknown>>;
}

export async function completeGoogleConnection(rawState: unknown, rawCode: unknown) {
  const state = z.string().min(32).max(200).parse(rawState);
  const code = z.string().min(1).max(4096).parse(rawCode);
  const { organizationId, userId } = await requirePermission("business.write");
  const config = googleConfig();
  const stored = await withTenantTransaction(organizationId, (tx) => tx.oAuthState.findUnique({ where: { stateHash: sha256(state) } }));
  if (!stored || stored.organizationId !== organizationId || stored.provider !== "google-analytics" || stored.usedAt || stored.expiresAt < new Date()) {
    throw new Error("OAuth state is invalid or expired.");
  }
  const token = await providerFetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: config.clientId, client_secret: config.clientSecret, redirect_uri: config.redirectUri, grant_type: "authorization_code", code_verifier: stored.codeVerifier ?? "" }),
  });
  const accessToken = z.string().parse(token.access_token);
  const accountSummary = await providerFetch("https://analyticsadmin.googleapis.com/v1alpha/accountSummaries", { headers: { authorization: `Bearer ${accessToken}` } });
  const firstProperty = ((accountSummary.accountSummaries as Array<{ propertySummaries?: Array<{ property?: string; displayName?: string }> }> | undefined)?.[0]?.propertySummaries?.[0]);
  if (!firstProperty?.property) throw new Error("No Google Analytics property is available for this account.");
  const credentials = encryptCredentials({ accessToken, refreshToken: token.refresh_token, expiresIn: token.expires_in });
  const connection = await withTenantTransaction(organizationId, async (tx) => {
    await tx.oAuthState.update({ where: { id: stored.id }, data: { usedAt: new Date() } });
    const result = await tx.connection.upsert({
      where: { organizationId_businessId_provider: { organizationId, businessId: stored.businessId, provider: "google-analytics" } },
      update: { status: "CONNECTED", accountReference: firstProperty.property, scopes: providerCatalog.googleAnalytics.scopes, metadata: { propertyName: firstProperty.displayName }, ...credentials, errorCode: null },
      create: { organizationId, businessId: stored.businessId, provider: "google-analytics", status: "CONNECTED", accountReference: firstProperty.property, scopes: providerCatalog.googleAnalytics.scopes, metadata: { propertyName: firstProperty.displayName }, ...credentials },
    });
    await recordAuditEventInTransaction(tx, { organizationId, actorUserId: userId, action: "connection.verified", resourceType: "Connection", resourceId: result.id, metadata: { provider: "google-analytics" } });
    return result;
  });
  return { id: connection.id, provider: connection.provider, status: connection.status };
}

export async function listConnections() {
  const { organizationId } = await requirePermission("business.read");
  return withTenantTransaction(organizationId, (tx) => tx.connection.findMany({
    select: { id: true, provider: true, status: true, accountReference: true, scopes: true, metadata: true, lastSuccessfulSync: true, lastAttemptedSync: true, errorCode: true },
    orderBy: { createdAt: "desc" },
  }));
}

export async function disconnectConnection(connectionId: string) {
  const { organizationId, userId } = await requirePermission("business.write");
  const id = z.string().min(1).max(100).parse(connectionId);
  return withTenantTransaction(organizationId, async (tx) => {
    const connection = await tx.connection.findFirst({ where: { id, organizationId } });
    if (!connection) throw new Error("Connection not found.");
    const result = await tx.connection.update({ where: { id: connection.id }, data: { status: "DISCONNECTED", credentialCiphertext: null, credentialNonce: null, credentialTag: null } });
    await recordAuditEventInTransaction(tx, { organizationId, actorUserId: userId, action: "connection.disconnected", resourceType: "Connection", resourceId: id, metadata: { provider: connection.provider } });
    return { id: result.id, status: result.status };
  });
}

export async function syncGoogleAnalytics(connectionId: string) {
  const { organizationId, userId } = await requirePermission("business.write");
  const id = z.string().min(1).max(100).parse(connectionId);
  const connection = await withTenantTransaction(organizationId, (tx) => tx.connection.findFirst({ where: { id, organizationId, provider: "google-analytics", status: "CONNECTED" } }));
  if (!connection || !connection.credentialCiphertext || !connection.credentialNonce || !connection.credentialTag || !connection.accountReference) throw new Error("Connection is not ready to sync.");
  const run = await withTenantTransaction(organizationId, async (tx) => {
    const created = await tx.syncRun.create({ data: { organizationId, connectionId: id } });
    await tx.connection.update({ where: { id }, data: { status: "SYNCING", lastAttemptedSync: new Date() } });
    return created;
  });
  try {
    const credentials = decryptCredentials(connection.credentialCiphertext, connection.credentialNonce, connection.credentialTag);
    const report = await providerFetch(`https://analyticsdata.googleapis.com/v1beta/${connection.accountReference}:runReport`, {
      method: "POST", headers: { authorization: `Bearer ${credentials.accessToken}`, "content-type": "application/json" },
      body: JSON.stringify({ dateRanges: [{ startDate: "28daysAgo", endDate: "today" }], dimensions: [{ name: "date" }], metrics: [{ name: "activeUsers" }, { name: "sessions" }] }),
    });
    const rows = Array.isArray(report.rows) ? report.rows : [];
    const result = await withTenantTransaction(organizationId, async (tx) => {
      let created = 0;
      for (const [index, row] of rows.entries()) {
        const values = row as { dimensionValues?: Array<{ value?: string }> };
        await tx.ingestedRecord.upsert({
          where: { connectionId_recordType_externalId: { connectionId: id, recordType: "google-analytics.daily", externalId: values.dimensionValues?.[0]?.value ?? `row-${index}` } },
          update: { payload: row as object, collectedAt: new Date(), observedAt: new Date() },
          create: { organizationId, businessId: connection.businessId, connectionId: id, recordType: "google-analytics.daily", externalId: values.dimensionValues?.[0]?.value ?? `row-${index}`, payload: row as object, sourceType: "GOOGLE_ANALYTICS", sourceReference: connection.accountReference, observedAt: new Date(), freshness: "recent" },
        });
        created += 1;
      }
      await tx.syncRun.update({ where: { id: run.id }, data: { status: "SUCCEEDED", completedAt: new Date(), recordsProcessed: rows.length, recordsCreated: created } });
      await tx.connection.update({ where: { id }, data: { status: "CONNECTED", lastSuccessfulSync: new Date(), errorCode: null } });
      await recordAuditEventInTransaction(tx, { organizationId, actorUserId: userId, action: "connection.sync_completed", resourceType: "Connection", resourceId: id, metadata: { provider: "google-analytics", recordsProcessed: rows.length } });
      return created;
    });
    return { status: "SUCCEEDED", recordsProcessed: rows.length, recordsCreated: result };
  } catch {
    await withTenantTransaction(organizationId, async (tx) => {
      await tx.syncRun.update({ where: { id: run.id }, data: { status: "FAILED", completedAt: new Date(), errorCode: "provider_sync_failed" } });
      await tx.connection.update({ where: { id }, data: { status: "ERROR", errorCode: "provider_sync_failed" } });
      await recordAuditEventInTransaction(tx, { organizationId, actorUserId: userId, action: "connection.sync_failed", resourceType: "Connection", resourceId: id, result: "failure", metadata: { provider: "google-analytics" } });
    });
    throw new Error("The source could not be synchronized. Reconnect or try again later.");
  }
}
