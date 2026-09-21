# BRANDOS integrations

## Status

- **IMPLEMENTED:** Provider-neutral connection, OAuth state, encrypted credential, sync-run, normalized ingested-record, audit, disconnect, and tenant/RLS boundaries.
- **IMPLEMENTED:** Google Analytics Data API read-only OAuth connection and a bounded 28-day daily report sync. It is available only when the deployment configures Google OAuth credentials and the encryption key.
- **VERIFIED:** Schema validation, client generation, static checks, mocked/provider-independent tests, and CI PostgreSQL RLS coverage.
- **DEPLOYMENT-GATED:** Google Cloud project configuration, consent-screen verification, redirect URI registration, encryption-key provisioning, and real Google account/property behavior. No production provider credentials are present in this repository.
- **DEFERRED:** Google Search Console, Meta, Shopify, webhooks, background scheduling, token rotation, and additional provider adapters.

## Google Analytics

The implementation uses Google's OAuth 2.0 web-server authorization-code flow with PKCE, `state`, a fixed configured redirect URI, and the least-read scope currently needed: `https://www.googleapis.com/auth/analytics.readonly`. After token exchange, BRANDOS verifies access by calling the Google Analytics Admin `accountSummaries` endpoint and stores the first available property reference. It does not mark a connection `CONNECTED` before that verification succeeds.

The Data API sync requests a 28-day report with the `date`, `activeUsers`, and `sessions` fields. Provider rows are stored as normalized `IngestedRecord` evidence keyed by `(connection, recordType, provider ID)`. Repeated syncs upsert the same stable date identity and do not create duplicate records. Imported rows are not automatically converted into Business Brain conclusions or recommendations.

## Credential and privacy controls

Access and refresh tokens are never sent to the browser, logged, placed in URLs, or stored in plaintext. They are encrypted server-side with AES-256-GCM using `INTEGRATION_CREDENTIAL_ENCRYPTION_KEY`, a deployment secret that must be provisioned through a managed secret/key-management system. If it is absent or invalid, credential storage fails closed. Disconnect removes the stored ciphertext and preserves non-secret sync/audit history.

Stored provider data is limited to the property reference, selected safe metadata, requested scopes, report rows, provider references, collection time, and freshness. Raw provider payloads are not exposed as the primary UX. Provider failures produce a generic reconnect/sync error and set the connection to `ERROR`.

## Official sources

- [Google OAuth 2.0 for web-server applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Google Analytics Data API `runReport`](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport)
- [Google Analytics Admin API account summaries](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1alpha/accountSummaries/list)

These sources define the authorization-code flow, redirect/scopes, report endpoint, and account/property verification used here. Real provider behavior remains deployment-gated until a configured Google project and test property are used.
