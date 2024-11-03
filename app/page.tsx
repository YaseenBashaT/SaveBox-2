"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaYoutube, FaTwitter, FaReddit } from "react-icons/fa"; // Updated icons
import { AuthDialog } from "@/components/auth/auth-dialog";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleCardClick = (path: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this feature",
        variant: "destructive",
      });
      return;
    }
    router.push(`/dashboard/${path}`);
  };

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Welcome to SaveBox
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Your personal content companion. Save and organize your favorite content from
          YouTube, Reddit, and Twitter in one place.
        </p>
        <div className="flex justify-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <AuthDialog />
              <Button size="lg" variant="outline">Learn More</Button>
            </>
          )}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-3">
        <Card 
          className="p-6 space-y-4 cursor-pointer transition-colors hover:bg-accent"
          onClick={() => handleCardClick("youtube")}
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <FaYoutube className="h-6 w-6 text-red-500" /> {/* Updated icon */}
            </div>
            <div>
              <h3 className="text-lg font-medium">YouTube</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Save and organize your favorite YouTube videos and playlists.
              </p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-6 space-y-4 cursor-pointer transition-colors hover:bg-accent"
          onClick={() => handleCardClick("twitter")}
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FaTwitter className="h-6 w-6 text-blue-500" /> {/* Updated icon */}
            </div>
            <div>
              <h3 className="text-lg font-medium">Twitter</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Save and organize your favorite tweets and threads.
              </p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-6 space-y-4 cursor-pointer transition-colors hover:bg-accent"
          onClick={() => handleCardClick("reddit")}
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <FaReddit className="h-6 w-6 text-orange-500" /> {/* Updated icon */}
            </div>
            <div>
              <h3 className="text-lg font-medium">Reddit</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Save and organize your favorite Reddit posts and comments.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
