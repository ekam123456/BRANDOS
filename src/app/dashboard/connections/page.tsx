import Link from "next/link";
import { EmptyState, ProductHeader, ProductShell } from "@/components/ProductShell";
import { ConnectionsPanel } from "@/components/ConnectionsPanel";
import { listConnections } from "@/lib/integrations";

export const dynamic = "force-dynamic";

export default async function ConnectionsPage() {
  const connections = await listConnections().catch(() => []);
  return <ProductShell><ProductHeader eyebrow="Connections" title="Connect your business, carefully." description="A connection is shown as active only after it is actually verified. Each source explains what BRANDOS can access, why it needs it, and what it can learn." /><ConnectionsPanel initialConnections={connections.map((connection) => ({ ...connection, lastSuccessfulSync: connection.lastSuccessfulSync?.toISOString() ?? null }))} /><EmptyState title="Need to review setup?" action={<Link className="button secondary" href="/onboarding">Review setup</Link>}>Connections add evidence to the Business Brain. They do not generate conclusions by themselves.</EmptyState></ProductShell>;
}
