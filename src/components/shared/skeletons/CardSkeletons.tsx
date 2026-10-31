import React from "react";

// Base animated pulse element
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`}
    />
  );
}

// 1. Job Card Skeleton (For Student Jobs, Saved Jobs, Company Jobs)
export function JobCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 flex-1">
            <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3.5 w-1/2" />
            </div>
          </div>
          <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        <div className="space-y-2 pt-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
    </div>
  );
}

// 2. Metric / Stat Card Skeleton (For Dashboards)
export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="w-10 h-10 rounded-2xl" />
        <Skeleton className="w-12 h-5 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3.5 w-36" />
    </div>
  );
}

// 3. Table Row / List Item Skeleton (For Applicants, Notifications, Companies)
export function TableRowSkeleton() {
  return (
    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3.5 flex-1">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-3">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-xl" />
      </div>
    </div>
  );
}

// 4. Candidate Profile Skeleton (For /student/profile)
export function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Hero Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-5 flex-1">
            <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-3.5 w-32" />
              <div className="flex gap-4 pt-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-3">
            <Skeleton className="h-8 w-40 rounded-2xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Resume Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>

      {/* Skills Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <Skeleton className="h-5 w-28" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Grid Cards (Employment & Education) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-7 w-24 rounded-xl" />
          </div>
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-7 w-24 rounded-xl" />
          </div>
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

// 5. Grid of Job Card Skeletons
export function JobGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}

