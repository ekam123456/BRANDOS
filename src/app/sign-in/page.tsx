import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  if (!isClerkConfigured) {
    return <AuthSetupMessage action="sign in" />;
  }
  return <main className="auth-page"><SignIn /></main>;
}

function AuthSetupMessage({ action }: { action: string }) {
  return (
    <main className="auth-page">
      <div className="auth-panel">
        <p className="kicker">Stage 2 foundation</p>
        <h1>Authentication is not configured yet.</h1>
        <p>Set the Clerk environment variables in the deployment environment before attempting to {action}.</p>
      </div>
    </main>
  );
}
