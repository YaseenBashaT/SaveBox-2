"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Youtube, Plus, Loader2, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContent } from "@/hooks/use-content";
import { useToast } from "@/hooks/use-toast";
import { fetchYouTubePlaylist } from "@/lib/api/youtube";
import { useAuth } from "@/hooks/use-auth";
import { saveYouTubePlaylist } from "@/lib/firebase/db";

export function YouTubeSection() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { youtube, loading: contentLoading } = useContent();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to save playlists",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const playlistId = url.match(/list=([^&]+)/)?.[1];
      
      if (!playlistId) {
        throw new Error("Invalid YouTube playlist URL");
      }

      const playlist = await fetchYouTubePlaylist(playlistId);
      await saveYouTubePlaylist(user.uid, playlist);

      toast({
        title: "Success",
        description: "Playlist saved successfully",
      });
      setUrl("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save playlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (contentLoading.youtube) {
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
            placeholder="Paste YouTube playlist URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={handleSave} disabled={loading || !url}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Save Playlist
          </Button>
        </div>
      </Card>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        {youtube.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Youtube className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Playlists Saved</h3>
            <p className="text-sm text-muted-foreground">
              Start by pasting a YouTube playlist URL above
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {youtube.map((playlist) => (
              <Card key={playlist.id} className="p-4">
                <div className="flex gap-4">
                  <img
                    src={playlist.thumbnailUrl}
                    alt={playlist.title}
                    className="w-32 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold">{playlist.title}</h3>
                      <a
                        href={`https://youtube.com/playlist?list=${playlist.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {playlist.videoCount} videos
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
