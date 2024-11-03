"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Youtube, Twitter, Reddit } from "lucide-react";
import { YouTubeSection } from "./youtube-section";
import { TwitterSection } from "./twitter-section";
import { RedditSection } from "./reddit-section";

export function SocialTabs() {
  return (
    <Tabs defaultValue="youtube" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="youtube" className="flex items-center gap-2">
          <Youtube className="h-4 w-4" />
          YouTube
        </TabsTrigger>
        <TabsTrigger value="twitter" className="flex items-center gap-2">
          <Twitter className="h-4 w-4" />
          Twitter
        </TabsTrigger>
        <TabsTrigger value="reddit" className="flex items-center gap-2">
          <Reddit className="h-4 w-4" />
          Reddit
        </TabsTrigger>
      </TabsList>
      <TabsContent value="youtube">
        <YouTubeSection />
      </TabsContent>
      <TabsContent value="twitter">
        <TwitterSection />
      </TabsContent>
      <TabsContent value="reddit">
        <RedditSection />
      </TabsContent>
    </Tabs>
  );
}