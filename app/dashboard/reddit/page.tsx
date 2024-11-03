"use client";

import { RedditSection } from "@/components/dashboard/reddit-section";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";

export default function RedditPage() {
  const { user, loading } = useAuth();

  if (!loading && !user) {
    redirect("/");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Reddit Content</h1>
        <p className="text-muted-foreground">
          Manage and organize your saved Reddit posts
        </p>
      </div>
      <RedditSection />
    </div>
  );
}