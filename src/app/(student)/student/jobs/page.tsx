"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  DollarSign, 
  Clock, 
  Calendar, 
  ArrowRight,
  Loader2,
  Sparkles,
  X
} from "lucide-react";
import BookmarkButton from "@/components/student/BookmarkButton";

interface JobItem {
  _id: string;
  title: string;
  category: string;
  jobType: string;
  workMode: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  compensationPeriod: string;
  openings: number;
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

export default function StudentJobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [jobType, setJobType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (jobType) params.set("jobType", jobType);
      if (workMode) params.set("workMode", workMode);
      if (location) params.set("location", location);
      params.set("page", page.toString());
      params.set("limit", "8");

      const [resJobs, resSaved] = await Promise.all([
        fetch(`/api/jobs?${params.toString()}`),
        fetch("/api/students/saved-jobs", { cache: "no-store" }),
      ]);

      const data = await resJobs.json();
      if (resJobs.ok) {
        setJobs(data.jobs || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalJobs(data.pagination?.total || 0);
      }

      if (resSaved.ok) {
        const savedData = await resSaved.json();
        const ids = (savedData.savedJobs || []).map((j: any) => j._id || j);
        setSavedJobIds(ids);
      }
    } catch {
      console.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, category, jobType, workMode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setJobType("");
    setWorkMode("");
    setLocation("");
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Verified Company Postings</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Browse Opportunities ({totalJobs})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore full-time, internship, and contract roles posted exclusively by verified employers.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title, skill (e.g. React), or keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="relative sm:w-64">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City / Location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold mr-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters:</span>
          </div>

          <select
            value={jobType}
            onChange={(e) => {
              setJobType(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition font-medium"
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>

          <select
            value={workMode}
            onChange={(e) => {
              setWorkMode(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition font-medium"
          >
            <option value="">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition font-medium"
          >
            <option value="">All Categories</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Product & Design">Product & Design</option>
            <option value="Data & AI">Data & AI</option>
            <option value="Marketing & Sales">Marketing & Sales</option>
            <option value="Operations">Operations</option>
          </select>

          {(search || category || jobType || workMode || location) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold transition ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Job Grid / List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
          <Briefcase className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No matching opportunities found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria, removing filters, or checking back later as new positions are posted.
          </p>
          <button
            onClick={clearFilters}
            className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold transition"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/40 rounded-3xl p-6 transition flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700/80 flex items-center justify-center font-extrabold text-lg text-indigo-600 dark:text-indigo-400 shrink-0">
                      {job.companyId?.companyName ? job.companyId.companyName[0] : "C"}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition line-clamp-1">
                        {job.title}
                      </h2>
                      {job.companyId?._id ? (
                        <Link
                          href={`/student/companies/${job.companyId._id}`}
                          className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 mt-0.5 transition truncate font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="hover:underline truncate">{job.companyId?.companyName || "Verified Partner"}</span>
                        </Link>
                      ) : (
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 truncate font-medium">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{job.companyId?.companyName || "Verified Partner"}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-blue-200 dark:border-indigo-500/20">
                      {job.jobType}
                    </span>
                    <BookmarkButton
                      jobId={job._id}
                      initialIsSaved={savedJobIds.includes(job._id)}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills tags */}
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {job.requiredSkills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 4 && (
                      <span className="text-[11px] px-1.5 py-0.5 text-slate-400 font-medium self-center">
                        +{job.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location} ({job.workMode})</span>
                  </span>

                  {job.salaryMin ? (
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>
                        ${job.salaryMin.toLocaleString()} - ${job.salaryMax ? job.salaryMax.toLocaleString() : "DOE"} {job.compensationPeriod}
                      </span>
                    </span>
                  ) : null}

                  {job.applicationDeadline && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Closes {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </span>
                <Link
                  href={`/student/jobs/${job._id}`}
                  className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-200 dark:border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <span>View Details & Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition font-semibold"
          >
            Previous
          </button>
          <span className="text-xs text-slate-500 px-3 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition font-semibold"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
