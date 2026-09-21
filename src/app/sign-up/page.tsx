import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/auth";

export const metadata: Metadata = { title: "Create an account" };

export default function SignUpPage() {
  if (!isClerkConfigured) {
    return (
      <main className="auth-page">
        <div className="auth-panel">
          <p className="kicker">Stage 2 foundation</p>
          <h1>Authentication is not configured yet.</h1>
          <p>Set the Clerk environment variables in the deployment environment before creating an account.</p>
        </div>
      </main>
    );
  }
  return <main className="auth-page"><SignUp /></main>;
}
