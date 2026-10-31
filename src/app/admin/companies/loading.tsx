import { TableRowSkeleton, StatCardSkeleton } from "@/components/shared/skeletons/CardSkeletons";

export default function AdminCompaniesLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <div className="h-8 w-60 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="h-4 w-96 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <div className="space-y-3">
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
      </div>
    </div>
  );
}
