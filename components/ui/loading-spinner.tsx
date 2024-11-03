import { Loader2 } from "lucide-react";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className="flex justify-center items-center">
      <Loader2 className={`animate-spin ${className}`} />
    </div>
  );
}