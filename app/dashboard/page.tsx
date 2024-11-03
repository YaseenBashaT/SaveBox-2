"use client";

import { useAuth } from "@/hooks/use-auth";
import { SocialTabs } from "@/components/dashboard/social-tabs";
import { ConnectAccounts } from "@/components/dashboard/connect-accounts";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (!loading && !user) {
    redirect("/");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Your Saved Content</h1>
        <p className="text-muted-foreground">
          Manage and organize your saved content from various platforms
        </p>
      </div>

      <ConnectAccounts />
      <SocialTabs />
    </div>
  );
}