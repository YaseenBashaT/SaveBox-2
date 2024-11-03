"use client";

import { YouTubeSection } from "@/components/dashboard/youtube-section";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";

export default function YouTubePage() {
  const { user, loading } = useAuth();

  if (!loading && !user) {
    redirect("/");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">YouTube Content</h1>
        <p className="text-muted-foreground">
          Manage and organize your saved YouTube playlists
        </p>
      </div>
      <YouTubeSection />
    </div>
  );
}