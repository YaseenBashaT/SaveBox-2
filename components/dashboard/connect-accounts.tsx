"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Youtube, Twitter, Reddit, Loader2 } from "lucide-react";
import { useSocialAuth } from "@/hooks/use-social-auth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { AuthDialog } from "@/components/auth/auth-dialog";

export function ConnectAccounts() {
  const { loading, connectYouTube, connectReddit, connectTwitter } = useSocialAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      const platform = success.split("_")[0];
      toast({
        title: "Success",
        description: `Successfully connected your ${platform} account`,
      });
    } else if (error) {
      toast({
        title: "Error",
        description: "Failed to connect account. Please try again.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Your Accounts</h2>
        <p className="text-muted-foreground mb-6">
          Sign in to start connecting your social media accounts
        </p>
        <AuthDialog />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
            <Youtube className="h-6 w-6 text-red-600 dark:text-red-500" />
          </div>
          <h3 className="font-semibold">YouTube</h3>
          <Button
            variant="outline"
            className="w-full"
            onClick={connectYouTube}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Connect Account
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <Twitter className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="font-semibold">Twitter</h3>
          <Button
            variant="outline"
            className="w-full"
            onClick={connectTwitter}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Connect Account
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
            <Reddit className="h-6 w-6 text-orange-600 dark:text-orange-500" />
          </div>
          <h3 className="font-semibold">Reddit</h3>
          <Button
            variant="outline"
            className="w-full"
            onClick={connectReddit}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Connect Account
          </Button>
        </div>
      </Card>
    </div>
  );
}