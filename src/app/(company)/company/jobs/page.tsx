"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  PlusCircle, 
  Users, 
  MapPin, 
  Clock, 
  Calendar, 
  MoreVertical, 
  Loader2, 
  CheckCircle2, 
  FileClock,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Pencil
} from "lucide-react";
import { toast } from "sonner";
import { TableRowSkeleton } from "@/components/shared/skeletons/CardSkeletons";

interface JobItem {
  _id: string;
  title: string;
  category: string;
  jobType: string;
  workMode: string;
  location: string;
  status: "draft" | "published" | "closed" | "inactive";
  applicationsCount: number;
  openings: number;
  applicationDeadline?: string;
  createdAt: string;
}

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState("pending");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/companies/jobs");
      const data = await res.json();
      if (res.ok) {
        setJobs(data.jobs || []);
        setVerificationStatus(data.verificationStatus || "pending");
      }
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    if (newStatus === "published" && verificationStatus !== "verified") {
      toast.error("Your company must be verified by an administrator to publish jobs.");
      return;
    }

    try {
      const res = await fetch(`/api/companies/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.success(`Job marked as ${newStatus}`);
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: newStatus as any } : j))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;

    try {
      const res = await fetch(`/api/companies/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Job posting removed");
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Published</span>
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <FileClock className="w-3 h-3" />
            <span>Draft</span>
          </span>
        );
      case "closed":
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-400">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Job Postings</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage your listings, publish drafts, and inspect received student applications.
          </p>
        </div>

        <Link
          href="/company/jobs/new"
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      {verificationStatus !== "verified" && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-3">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>
            Employer account is awaiting verification. You can prepare and save job drafts. Once verified, you can activate them instantly.
          </span>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-base font-semibold text-white">No jobs created yet</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Create your first campus hiring opening to start accepting applications from students.
          </p>
          <Link
            href="/company/jobs/new"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Job Opening</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Responsive Mobile Cards for Jobs (Visible on screens < 768px) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-base truncate">{job.title}</h3>
                    <div className="text-slate-400 text-xs mt-0.5">
                      {job.category} • {job.jobType}
                    </div>
                  </div>
                  <div className="shrink-0">{getStatusBadge(job.status)}</div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                  <span>{job.location} ({job.workMode})</span>
                  <span>•</span>
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <Link
                    href={`/company/applicants?jobId=${job._id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 text-xs font-medium transition"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{job.applicationsCount} Candidates</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    {job.status === "draft" && (
                      <button
                        onClick={() => handleStatusChange(job._id, "published")}
                        className="px-2.5 py-1.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-medium transition"
                      >
                        Publish
                      </button>
                    )}

                    {job.status === "published" && (
                      <button
                        onClick={() => handleStatusChange(job._id, "closed")}
                        className="px-2.5 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium transition"
                      >
                        Close
                      </button>
                    )}

                    {job.status === "closed" && (
                      <button
                        onClick={() => handleStatusChange(job._id, "published")}
                        className="px-2.5 py-1.5 rounded bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 text-xs font-medium transition"
                      >
                        Reopen
                      </button>
                    )}

                    <Link
                      href={`/company/jobs/${job._id}/edit`}
                      className="p-2 rounded text-slate-400 hover:text-violet-400 hover:bg-slate-800 transition"
                      title="Edit Job Posting"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="p-2 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (Visible on screens >= 768px) */}
          <div className="hidden md:block bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Job Title & Category</th>
                    <th className="px-6 py-4 font-semibold">Location / Mode</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Applicants</th>
                    <th className="px-6 py-4 font-semibold">Posted Date</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white text-sm">{job.title}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          {job.category} • {job.jobType}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div>{job.location}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">{job.workMode}</div>
                      </td>

                      <td className="px-6 py-4">{getStatusBadge(job.status)}</td>

                      <td className="px-6 py-4">
                        <Link
                          href={`/company/applicants?jobId=${job._id}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 font-medium transition"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{job.applicationsCount} Candidates</span>
                        </Link>
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {job.status === "draft" && (
                            <button
                              onClick={() => handleStatusChange(job._id, "published")}
                              className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-medium transition"
                            >
                              Publish
                            </button>
                          )}

                          {job.status === "published" && (
                            <button
                              onClick={() => handleStatusChange(job._id, "closed")}
                              className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-[11px] font-medium transition"
                            >
                              Close
                            </button>
                          )}

                          {job.status === "closed" && (
                            <button
                              onClick={() => handleStatusChange(job._id, "published")}
                              className="px-2.5 py-1 rounded bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 text-[11px] font-medium transition"
                            >
                              Reopen
                            </button>
                          )}

                          <Link
                            href={`/company/jobs/${job._id}/edit`}
                            className="p-1.5 rounded text-slate-400 hover:text-violet-400 hover:bg-slate-800 transition"
                            title="Edit Job Posting"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                            title="Delete Job"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
