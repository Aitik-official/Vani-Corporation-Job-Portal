"use client";

import { useEffect, useState } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BookmarkButtonProps {
  jobId: string;
  initialIsSaved?: boolean;
  className?: string;
  onToggle?: (isSaved: boolean) => void;
}

export default function BookmarkButton({
  jobId,
  initialIsSaved = false,
  className = "",
  onToggle,
}: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsSaved(initialIsSaved);
  }, [initialIsSaved]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/students/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update bookmark");
      }

      setIsSaved(data.isSaved);
      if (onToggle) {
        onToggle(data.isSaved);
      }
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err.message || "An error occurred while saving the job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      type="button"
      className={`p-2 rounded-xl transition border flex items-center justify-center shrink-0 ${
        isSaved
          ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-500 hover:bg-indigo-500/25 shadow-sm"
          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
      } ${className}`}
      title={isSaved ? "Remove from Bookmarked Jobs" : "Bookmark this Job"}
      aria-label="Bookmark Job"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
      ) : (
        <Bookmark className={`w-4 h-4 transition-transform ${isSaved ? "fill-indigo-500 text-indigo-500 scale-105" : ""}`} />
      )}
    </button>
  );
}
