"use client";

import { useState } from "react";

type Connection = { id: string; provider: string; status: string; accountReference: string | null; lastSuccessfulSync: string | null; errorCode: string | null };

export function ConnectionsPanel({ initialConnections }: { initialConnections: Connection[] }) {
  const [connections, setConnections] = useState(initialConnections);
  const [busy, setBusy] = useState<string>();
  const [message, setMessage] = useState<string>();

  async function connect() {
    setBusy("connect");
    const response = await fetch("/api/private/connections", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ provider: "google-analytics" }) });
    const result = await response.json() as { authorizationUrl?: string; error?: string };
    if (response.ok && result.authorizationUrl) window.location.assign(result.authorizationUrl);
    else setMessage(result.error ?? "Unable to start connection.");
    setBusy(undefined);
  }

  async function act(id: string, action: "sync" | "disconnect") {
    setBusy(id);
    const response = await fetch(`/api/private/connections/${id}`, { method: action === "sync" ? "POST" : "DELETE" });
    if (response.ok) {
      if (action === "disconnect") setConnections((items) => items.filter((item) => item.id !== id));
      else setMessage("Synchronization completed or needs attention.");
    } else setMessage("The requested connection action could not be completed.");
    setBusy(undefined);
  }

  return <div className="connection-list">
    <section className="connection-panel"><div><span className="kicker">Available source</span><h2>Google Analytics</h2><p>Read-only access to property reports such as sessions and active users. BRANDOS does not read visitor identities or message content.</p><small>Permission: analytics.readonly · <a href="https://developers.google.com/analytics/devguides/reporting/data/v1" target="_blank" rel="noreferrer">Official API details</a></small></div><button className="button" onClick={connect} disabled={busy === "connect"}>{busy === "connect" ? "Preparing…" : "Connect source"}</button></section>
    {message ? <p className="form-error" role="status">{message}</p> : null}
    {connections.length === 0 ? <p className="connection-empty">No source is connected. Nothing is being imported.</p> : connections.map((connection) => <section className="connection-panel" key={connection.id}><div><span className="kicker">Connected source</span><h2>Google Analytics</h2><p>{connection.accountReference ?? "Property identity is not available."}</p><span className="status-badge status-neutral">{connection.status}</span>{connection.lastSuccessfulSync ? <small>Last synced: {new Date(connection.lastSuccessfulSync).toLocaleString()}</small> : null}{connection.errorCode ? <p>Needs attention. Reconnect or try again later.</p> : null}</div><div className="product-actions"><button className="button secondary" onClick={() => act(connection.id, "sync")} disabled={Boolean(busy)}>Sync now</button><button className="button secondary" onClick={() => act(connection.id, "disconnect")} disabled={Boolean(busy)}>Disconnect</button></div></section>)}
  </div>;
}
