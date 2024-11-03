"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Reddit, Plus, Loader2, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContent } from "@/hooks/use-content";
import { useToast } from "@/hooks/use-toast";
import { fetchRedditPost } from "@/lib/api/reddit";
import { useAuth } from "@/hooks/use-auth";
import { saveRedditPost } from "@/lib/firebase/db";
import { format } from "date-fns";

export function RedditSection() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { reddit, loading: contentLoading } = useContent();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to save posts",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const post = await fetchRedditPost(url);
      await saveRedditPost(user.uid, post);

      toast({
        title: "Success",
        description: "Post saved successfully",
      });
      setUrl("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (contentLoading.reddit) {
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
            placeholder="Paste Reddit post URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={handleSave} disabled={loading || !url}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Save Post
          </Button>
        </div>
      </Card>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        {reddit.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Reddit className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Posts Saved</h3>
            <p className="text-sm text-muted-foreground">
              Start by pasting a Reddit post URL above
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reddit.map((post) => (
              <Card key={post.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Reddit className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">r/{post.subreddit}</p>
                        <h3 className="text-lg font-medium">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(post.created * 1000, "MMM d, yyyy")} •{" "}
                          {post.score.toLocaleString()} points
                        </p>
                      </div>
                      <a
                        href={`https://reddit.com${post.permalink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
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