import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Application } from "@/models/Application";
import { Student } from "@/models/Student";
import Link from "next/link";
import InterviewCalendarButtons from "@/components/student/InterviewCalendarButtons";

export const dynamic = "force-dynamic";
import { 
  FileText, 
  Building2, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Briefcase,
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Calendar,
  Video,
  Sparkles
} from "lucide-react";

export default async function StudentApplicationsPage() {
  const session = await getSession();
  await connectToDatabase();

  const student = await Student.findOne({ userId: session?.userId });

  const applications = student
    ? await Application.find({ studentId: student._id })
        .populate({
          path: "jobId",
          select: "title location jobType workMode salaryMin salaryMax compensationPeriod status",
        })
        .populate({
          path: "companyId",
          select: "companyName logoUrl location",
        })
        .sort({ appliedAt: -1 })
    : [];

  // Active upcoming interviews
  const upcomingInterviews = applications.filter(
    (app: any) =>
      app.interview?.scheduledAt &&
      new Date(app.interview.scheduledAt).getTime() >= Date.now() - 24 * 3600 * 1000
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
            Applied
          </span>
        );
      case "under_review":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
            Under Review
          </span>
        );
      case "shortlisted":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            Shortlisted
          </span>
        );
      case "selected":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20">
            Selected (Offer)
          </span>
        );
      case "rejected":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
            Archived
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Real-time Candidate Dossier</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Applications</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track the real-time review status of all roles you have applied for and access scheduled technical rounds.
        </p>
      </div>

      {/* Highlighted Upcoming Interview Banners */}
      {upcomingInterviews.length > 0 && (
        <div className="space-y-3">
          {upcomingInterviews.map((app: any) => {
            const interview = app.interview;
            const companyName = app.companyId?.companyName || "Employer";
            const jobTitle = app.jobId?.title || "Role";

            return (
              <div
                key={`interview-${app._id}`}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/40 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-emerald-600/30">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                          Upcoming Interview: {interview.roundTitle}
                        </h2>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 uppercase">
                          Action Required
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {companyName} • {jobTitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 w-fit">
                    {new Date(interview.scheduledAt).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </div>

                {interview.notes && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                    "{interview.notes}"
                  </p>
                )}

                <InterviewCalendarButtons
                  roundTitle={interview.roundTitle}
                  companyName={companyName}
                  jobTitle={jobTitle}
                  scheduledAt={interview.scheduledAt}
                  mode={interview.mode}
                  meetingLink={interview.meetingLink}
                  notes={interview.notes}
                />
              </div>
            );
          })}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
          <Briefcase className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">No applications submitted yet</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            You have not applied for any roles yet. Browse verified opportunities and submit your profile today.
          </p>
          <Link
            href="/student/jobs"
            className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse Available Jobs</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Responsive Mobile Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {applications.map((app: any) => {
              const hasInterview = Boolean(app.interview?.scheduledAt);
              return (
                <div
                  key={app._id.toString()}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                        {app.jobId?.title || "Position Unavailable"}
                      </h3>
                      <div className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{app.companyId?.companyName || "Employer"}</span>
                      </div>
                    </div>
                    <div className="shrink-0">{getStatusBadge(app.status)}</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <span>{app.jobId?.location || "N/A"} ({app.jobId?.workMode || "Remote"})</span>
                    <span>•</span>
                    <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>

                  {hasInterview && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          Interview:{" "}
                          {new Date(app.interview.scheduledAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <span className="text-slate-500 text-[11px]">{app.interview.mode}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {app.resumeUrl ? (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Submitted Resume</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[11px]">No Resume</span>
                    )}

                    {app.jobId?._id ? (
                      <Link
                        href={`/student/jobs/${app.jobId._id}`}
                        className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Closed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-bold">Job Title & Employer</th>
                    <th className="px-6 py-4 font-bold">Location / Mode</th>
                    <th className="px-6 py-4 font-bold">Applied Date</th>
                    <th className="px-6 py-4 font-bold">Application Status</th>
                    <th className="px-6 py-4 font-bold">Interview Schedule</th>
                    <th className="px-6 py-4 font-bold">Resume Submitted</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300">
                  {applications.map((app: any) => {
                    const hasInterview = Boolean(app.interview?.scheduledAt);

                    return (
                      <tr key={app._id.toString()} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">
                            {app.jobId?.title || "Position Unavailable"}
                          </div>
                          <div className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{app.companyId?.companyName || "Employer"}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{app.jobId?.location || "N/A"}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">
                            {app.jobId?.jobType} • {app.jobId?.workMode}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-500">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4">{getStatusBadge(app.status)}</td>

                        <td className="px-6 py-4">
                          {hasInterview ? (
                            <div className="space-y-1">
                              <div className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>
                                  {new Date(app.interview.scheduledAt).toLocaleDateString([], {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="text-slate-500 text-[11px]">
                                {app.interview.mode}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400">None</span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {app.resumeUrl ? (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View PDF</span>
                              <ExternalLink className="w-3 h-3 ml-0.5" />
                            </a>
                          ) : (
                            <span className="text-slate-400">None</span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          {app.jobId?._id ? (
                            <Link
                              href={`/student/jobs/${app.jobId._id}`}
                              className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-bold transition"
                            >
                              <span>Job Details</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          ) : (
                            <span className="text-slate-400">Closed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
