import { Loader2 } from "lucide-react";

export function PageSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4 text-indigo-500">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm font-medium animate-pulse">Loading content...</p>
      </div>
    </div>
  );
}
