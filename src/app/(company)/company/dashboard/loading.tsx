import { StatCardSkeleton, JobCardSkeleton, TableRowSkeleton } from "@/components/shared/skeletons/CardSkeletons";

export default function CompanyDashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Skeleton */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
        <div className="h-8 w-80 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="h-4 w-96 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* 2 Column Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="space-y-3">
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
