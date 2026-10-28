"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Bookmark, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
  Loader2, 
  Briefcase 
} from "lucide-react";
import BookmarkButton from "@/components/student/BookmarkButton";

interface SavedJobItem {
  _id: string;
  title: string;
  category: string;
  jobType: string;
  workMode: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  compensationPeriod: string;
  description: string;
  requiredSkills: string[];
  applicationDeadline?: string;
  createdAt: string;
  companyId?: {
    _id: string;
    companyName: string;
    logoUrl?: string;
    location: string;
  };
}

export default function StudentSavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJobItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students/saved-jobs", {
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok) {
        setSavedJobs(data.savedJobs || []);
      }
    } catch {
      console.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromList = (jobId: string) => {
    setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Opportunities</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Bookmarked Jobs ({savedJobs.length})
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Review saved positions, track approaching deadlines, and submit your application when ready.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-base font-semibold text-white">No saved jobs yet</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click the bookmark icon on any job card while browsing opportunities to save roles here for later review.
          </p>
          <Link
            href="/student/jobs"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse Active Jobs</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {savedJobs.map((job) => (
            <div
              key={job._id}
              className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 transition flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center font-bold text-lg text-indigo-400 shrink-0">
                      {job.companyId?.companyName ? job.companyId.companyName[0] : "C"}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-semibold text-white text-base sm:text-lg group-hover:text-indigo-300 transition line-clamp-1">
                        {job.title}
                      </h2>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{job.companyId?.companyName || "Verified Employer"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {job.jobType}
                    </span>
                    <BookmarkButton
                      jobId={job._id}
                      initialIsSaved={true}
                      onToggle={(isSaved) => {
                        if (!isSaved) handleRemoveFromList(job._id);
                      }}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-4 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {job.requiredSkills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 4 && (
                      <span className="text-[11px] px-1.5 py-0.5 text-slate-500">
                        +{job.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{job.location} ({job.workMode})</span>
                  </span>

                  {job.salaryMin ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>
                        ${job.salaryMin.toLocaleString()} - ${job.salaryMax ? job.salaryMax.toLocaleString() : "DOE"} {job.compensationPeriod}
                      </span>
                    </span>
                  ) : null}

                  {job.applicationDeadline && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Closes {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <Link
                  href={`/student/jobs/${job._id}`}
                  className="px-4 py-2 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <span>Review & Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
