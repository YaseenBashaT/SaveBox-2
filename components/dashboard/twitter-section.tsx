"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Twitter, Plus, Loader2, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContent } from "@/hooks/use-content";
import { useToast } from "@/hooks/use-toast";
import { fetchTwitterPost } from "@/lib/api/twitter";
import { useAuth } from "@/hooks/use-auth";
import { saveTwitterPost } from "@/lib/firebase/db";
import { format } from "date-fns";

export function TwitterSection() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { twitter, loading: contentLoading } = useContent();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to save tweets",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const post = await fetchTwitterPost(url);
      await saveTwitterPost(user.uid, post);

      toast({
        title: "Success",
        description: "Tweet saved successfully",
      });
      setUrl("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save tweet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (contentLoading.twitter) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex gap-4">
          <Input
            placeholder="Paste Twitter post URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={handleSave} disabled={loading || !url}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Save Tweet
          </Button>
        </div>
      </Card>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        {twitter.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Twitter className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Tweets Saved</h3>
            <p className="text-sm text-muted-foreground">
              Start by pasting a tweet URL above
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {twitter.map((tweet) => (
              <Card key={tweet.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Twitter className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">@{tweet.authorUsername}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(tweet.created), "MMM d, yyyy")}
                        </p>
                      </div>
                      <a
                        href={`https://twitter.com/${tweet.authorUsername}/status/${tweet.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                    <p className="mt-2">{tweet.text}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {tweet.likes.toLocaleString()} likes
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}