import { TableRowSkeleton } from "@/components/shared/skeletons/CardSkeletons";

export default function StudentNotificationsLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <div className="h-8 w-44 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="h-4 w-80 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
      </div>

      <div className="space-y-3">
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
      </div>
    </div>
  );
}
