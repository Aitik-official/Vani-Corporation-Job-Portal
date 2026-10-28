import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Company } from "@/models/Company";
import { Job } from "@/models/Job";
import { Application } from "@/models/Application";
import Link from "next/link";
import { 
  Building2, 
  Briefcase, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  PlusCircle,
  Clock,
  Video,
  Award,
  Calendar,
  ExternalLink,
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CompanyDashboardPage() {
  const session = await getSession();
  await connectToDatabase();

  const company = await Company.findOne({ userId: session?.userId });
  if (!company) {
    return (
      <div className="p-8 text-center text-slate-400">
        Company profile record not found. Please log in again.
      </div>
    );
  }

  // 1. Query all jobs belonging to this employer
  const allJobs = await Job.find({ companyId: company._id }).sort({ createdAt: -1 });
  const totalJobs = allJobs.length;
  const activeJobs = allJobs.filter((j) => j.status === "published");
  const draftJobs = allJobs.filter((j) => j.status === "draft");
  const totalTargetHeadcount = activeJobs.reduce((acc, j) => acc + (j.openings || 1), 0);

  // 2. Query all applications across all jobs for this company
  const allApplications = await Application.find({ companyId: company._id })
    .populate({
      path: "studentId",
      populate: { path: "userId", select: "name email" },
    })
    .populate({ path: "jobId", select: "title" })
    .sort({ appliedAt: -1 });

  const totalApplications = allApplications.length;
  const unreviewedCount = allApplications.filter((a) => a.status === "applied").length;
  const underReviewCount = allApplications.filter((a) => a.status === "under_review").length;
  const shortlistedCount = allApplications.filter((a) => a.status === "shortlisted").length;
  const selectedCount = allApplications.filter((a) => a.status === "selected").length;
  const rejectedCount = allApplications.filter((a) => a.status === "rejected").length;

  // Conversion rate (Selected / Total Applied)
  const selectionRate =
    totalApplications > 0
      ? Math.round((selectedCount / totalApplications) * 100)
      : 0;

  // 3. Upcoming Scheduled Interviews
  const upcomingInterviews = allApplications
    .filter(
      (a) =>
        a.interview?.scheduledAt &&
        new Date(a.interview.scheduledAt).getTime() >= Date.now() - 3600 * 1000 * 2 &&
        a.interview.status !== "cancelled"
    )
    .sort(
      (a, b) =>
        new Date(a.interview!.scheduledAt).getTime() -
        new Date(b.interview!.scheduledAt).getTime()
    );

  const totalScheduledInterviews = upcomingInterviews.length;
  const nextInterview = upcomingInterviews[0]?.interview;

  // Format next interview time label
  const formatNextInterviewLabel = () => {
    if (!nextInterview) return null;
    const date = new Date(nextInterview.scheduledAt);
    const isToday = new Date().toDateString() === date.toDateString();
    const timeStr = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    if (isToday) return `Next: Today at ${timeStr}`;
    return `Next: ${date.toLocaleDateString([], { month: "short", day: "numeric" })} at ${timeStr}`;
  };

  const isVerified = company.verificationStatus === "verified";
  const isRejected = company.verificationStatus === "rejected";

  return (
    <div className="space-y-8">
      {/* Verification Status Alert Banner */}
      {!isVerified && (
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg ${
            isRejected
              ? "bg-rose-950/40 border-rose-500/30 text-rose-200"
              : "bg-amber-950/40 border-amber-500/30 text-amber-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {isRejected ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="font-semibold text-sm text-white">
                {isRejected
                  ? "Company Verification Was Rejected"
                  : "Company Verification Status: Pending Review"}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {isRejected
                  ? `Reason: "${company.rejectionReason || "Requirements not met"}". You can update your company profile or submit documents to re-request verification.`
                  : "Your employer profile is under administrative review. You can create draft job postings now. Once verified by an administrator, your roles can be published to university students."}
              </p>
            </div>
          </div>

          <Link
            href="/company/profile"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white hover:bg-slate-800 transition whitespace-nowrap"
          >
            Review Profile & Documents
          </Link>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Talent Acquisition Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {company.companyName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time hiring pulse, candidate progression metrics, and interview activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/company/applicants"
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition shadow-xs"
          >
            Candidate Pipeline →
          </Link>
          <Link
            href="/company/jobs/new"
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {/* ========================================================
          TIER 1: THE 4 ESSENTIAL HR "MORNING PULSE" KPI CARDS
          Clean, vibrant, high-signal SaaS cards (Light theme first)
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Requisitions (Indigo / Purple) */}
        <Link
          href="/company/jobs"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Requisitions</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeJobs.length}
              <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 ml-2">Open</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
            <span className="font-medium text-slate-700 dark:text-slate-300">{totalTargetHeadcount} Target Headcount</span>
            <span>{draftJobs.length} Drafts</span>
          </div>
        </Link>

        {/* Card 2: Candidate Inflow (Sky / Blue) */}
        <Link
          href="/company/applicants"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Candidate Inflow</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalApplications}
              <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 ml-2">Total</span>
            </div>
          </div>
          <div className="text-[11px] flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
            {unreviewedCount > 0 ? (
              <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                {unreviewedCount} Awaiting Review
              </span>
            ) : (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">All resumes screened</span>
            )}
            <span className="text-slate-500 dark:text-slate-400">{underReviewCount} In Review</span>
          </div>
        </Link>

        {/* Card 3: Interview Activity (Mint / Emerald) */}
        <Link
          href="/company/applicants?status=shortlisted"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/50 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Interview Activity</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-600/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-center gap-2">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalScheduledInterviews}
              <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 ml-2">Scheduled</span>
            </div>
            {totalScheduledInterviews > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2.5 truncate">
            {formatNextInterviewLabel() || `${shortlistedCount} Shortlisted Candidates`}
          </div>
        </Link>

        {/* Card 4: Placement & Offer Yield (Violet / Purple) */}
        <Link
          href="/company/applicants?status=selected"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-500/50 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Hires & Placements</span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {selectedCount}
              <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 ml-2">Selected</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
            <span className="font-medium text-slate-700 dark:text-slate-300">{selectionRate}% Overall Yield</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Offers Placed</span>
          </div>
        </Link>
      </div>

      {/* ========================================================
          TIER 2: TWO HIGH-VALUE ANALYTICAL INSIGHT PANELS
          Left: Pipeline Conversion Funnel
          Right: Recruiter Interview Agenda
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Widget A: Pipeline Conversion Funnel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  Recruitment Pipeline Funnel
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Candidate volume and drop-off across hiring milestones
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20">
                {totalApplications} In Pipeline
              </span>
            </div>

            {/* Segmented Funnel Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-xl h-3 p-0.5 flex gap-1 overflow-hidden border border-slate-200 dark:border-slate-800">
                <div
                  className="bg-blue-600 rounded-lg transition-all"
                  style={{
                    width: totalApplications > 0 ? `${(unreviewedCount / totalApplications) * 100}%` : "0%",
                  }}
                  title={`Applied: ${unreviewedCount}`}
                />
                <div
                  className="bg-amber-500 rounded-lg transition-all"
                  style={{
                    width: totalApplications > 0 ? `${(underReviewCount / totalApplications) * 100}%` : "0%",
                  }}
                  title={`Under Review: ${underReviewCount}`}
                />
                <div
                  className="bg-emerald-600 rounded-lg transition-all"
                  style={{
                    width: totalApplications > 0 ? `${(shortlistedCount / totalApplications) * 100}%` : "0%",
                  }}
                  title={`Shortlisted: ${shortlistedCount}`}
                />
                <div
                  className="bg-violet-600 rounded-lg transition-all"
                  style={{
                    width: totalApplications > 0 ? `${(selectedCount / totalApplications) * 100}%` : "0%",
                  }}
                  title={`Selected: ${selectedCount}`}
                />
              </div>

              {/* Stage Metrics Grid */}
              <div className="grid grid-cols-4 gap-2.5 pt-2 text-center">
                <div className="bg-blue-50/60 dark:bg-slate-950/70 border border-blue-200/70 dark:border-slate-800/80 rounded-xl p-3 shadow-xs">
                  <div className="text-[10px] text-blue-700 dark:text-slate-400 font-semibold uppercase tracking-wider">Applied</div>
                  <div className="text-xl font-bold text-blue-700 dark:text-blue-400 mt-0.5">{totalApplications}</div>
                  <div className="text-[10px] text-slate-500">100%</div>
                </div>

                <div className="bg-amber-50/60 dark:bg-slate-950/70 border border-amber-200/70 dark:border-slate-800/80 rounded-xl p-3 shadow-xs">
                  <div className="text-[10px] text-amber-700 dark:text-slate-400 font-semibold uppercase tracking-wider">Reviewing</div>
                  <div className="text-xl font-bold text-amber-700 dark:text-amber-400 mt-0.5">{underReviewCount}</div>
                  <div className="text-[10px] text-slate-500">
                    {totalApplications > 0 ? `${Math.round((underReviewCount / totalApplications) * 100)}%` : "0%"}
                  </div>
                </div>

                <div className="bg-emerald-50/60 dark:bg-slate-950/70 border border-emerald-200/70 dark:border-slate-800/80 rounded-xl p-3 shadow-xs">
                  <div className="text-[10px] text-emerald-700 dark:text-slate-400 font-semibold uppercase tracking-wider">Interviewing</div>
                  <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{shortlistedCount}</div>
                  <div className="text-[10px] text-slate-500">
                    {totalApplications > 0 ? `${Math.round((shortlistedCount / totalApplications) * 100)}%` : "0%"}
                  </div>
                </div>

                <div className="bg-violet-50/60 dark:bg-slate-950/70 border border-violet-200/70 dark:border-slate-800/80 rounded-xl p-3 shadow-xs">
                  <div className="text-[10px] text-violet-700 dark:text-slate-400 font-semibold uppercase tracking-wider">Selected</div>
                  <div className="text-xl font-bold text-violet-700 dark:text-violet-400 mt-0.5">{selectedCount}</div>
                  <div className="text-[10px] text-slate-500">{selectionRate}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {rejectedCount} candidate{rejectedCount === 1 ? "" : "s"} archived / rejected
            </span>
            <Link
              href="/company/applicants"
              className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-semibold flex items-center gap-1 transition"
            >
              <span>Manage Kanban Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Widget B: Recruiter Agenda & Interview Schedule */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  Upcoming Interview Agenda
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Confirmed technical and screening rounds with students
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                {totalScheduledInterviews} Upcoming
              </span>
            </div>

            {/* List of next upcoming interviews */}
            {upcomingInterviews.length === 0 ? (
              <div className="py-8 px-4 text-center rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-dashed border-slate-200 dark:border-slate-800">
                <Calendar className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">No interviews scheduled yet</h4>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                  Shortlist top applicants in your pipeline to coordinate interview rounds.
                </p>
                <Link
                  href="/company/applicants?status=under_review"
                  className="mt-3 inline-flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium"
                >
                  <span>Review Candidates Awaiting Interview</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5 no-scrollbar max-h-[220px] overflow-y-auto pr-1">
                {upcomingInterviews.slice(0, 3).map((app: any) => {
                  const candidateName = app.studentId?.userId?.name || "Student Candidate";
                  const jobTitle = app.jobId?.title || "Role";
                  const interview = app.interview;

                  return (
                    <div
                      key={app._id.toString()}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-700 dark:text-emerald-400 shrink-0">
                          {candidateName[0]}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {candidateName}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {jobTitle} • {interview?.roundTitle || "Interview"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                            {new Date(interview.scheduledAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {new Date(interview.scheduledAt).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>

                        {interview.meetingLink ? (
                          <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium flex items-center gap-1 shadow-xs transition"
                            title="Join Meeting Link"
                          >
                            <Video className="w-3 h-3" />
                            <span>Join</span>
                          </a>
                        ) : (
                          <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            {interview.mode}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Synced with applicant notifications & calendar invites
            </span>
            <Link
              href="/company/applicants"
              className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-semibold flex items-center gap-1 transition"
            >
              <span>View All Interviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          TIER 3: REQUISITION HEALTH & APPLICANT HEATMAP TABLE
          Provides job-by-job metrics preferred by HR leads.
          ======================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Active Job Requisitions & Performance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Track open seats, candidate applicant volume, and pipeline conversion per role
            </p>
          </div>
          <Link
            href="/company/jobs"
            className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition"
          >
            Manage All {totalJobs} Postings →
          </Link>
        </div>

        {activeJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center">
            <Briefcase className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No active job listings published</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Publish your draft postings to begin receiving qualified applications from university students.
            </p>
            <Link
              href="/company/jobs/new"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Publish a Job Opening</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Responsive Mobile Requisition Cards (Visible on screens < 768px) */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {activeJobs.map((job) => {
                const jobApps = allApplications.filter(
                  (a) => a.jobId?._id?.toString() === job._id.toString()
                );
                const appCount = jobApps.length;
                const pipelineCount = jobApps.filter(
                  (a) => a.status === "under_review" || a.status === "shortlisted"
                ).length;
                const hiredCount = jobApps.filter((a) => a.status === "selected").length;

                return (
                  <div
                    key={job._id.toString()}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{job.title}</h3>
                        <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                          {job.jobType} • {job.workMode} • {job.location}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20 shrink-0">
                        {job.openings || 1} Seat{(job.openings || 1) === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                      <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="text-slate-500 text-[10px]">Candidates</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{appCount}</div>
                      </div>
                      <div className="bg-blue-50/60 dark:bg-slate-950 p-2 rounded-lg border border-blue-200/60 dark:border-slate-800">
                        <div className="text-blue-700 dark:text-slate-500 text-[10px] font-medium">In Pipeline</div>
                        <div className="text-sm font-bold text-blue-700 dark:text-blue-400 mt-0.5">{pipelineCount}</div>
                      </div>
                      <div className="bg-emerald-50/60 dark:bg-slate-950 p-2 rounded-lg border border-emerald-200/60 dark:border-slate-800">
                        <div className="text-emerald-700 dark:text-slate-500 text-[10px] font-medium">Hired</div>
                        <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{hiredCount}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/company/applicants?jobId=${job._id}`}
                        className="inline-flex items-center gap-1 font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition"
                      >
                        <span>Review Applicants</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (Visible on screens >= 768px) */}
            <div className="hidden md:block bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm no-scrollbar">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 uppercase text-[11px] border-b border-slate-200 dark:border-slate-800 tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Position Title</th>
                      <th className="px-6 py-4 font-semibold text-center">Openings</th>
                      <th className="px-6 py-4 font-semibold text-center">Candidates</th>
                      <th className="px-6 py-4 font-semibold text-center">In Pipeline</th>
                      <th className="px-6 py-4 font-semibold text-center">Hired</th>
                      <th className="px-6 py-4 font-semibold">Days Live</th>
                      <th className="px-6 py-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                    {activeJobs.map((job) => {
                      const jobApps = allApplications.filter(
                        (a) => a.jobId?._id?.toString() === job._id.toString()
                      );
                      const appCount = jobApps.length;
                      const pipelineCount = jobApps.filter(
                        (a) => a.status === "under_review" || a.status === "shortlisted"
                      ).length;
                      const hiredCount = jobApps.filter((a) => a.status === "selected").length;
                      const daysLive = Math.max(
                        1,
                        Math.floor(
                          (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                        )
                      );

                      return (
                        <tr key={job._id.toString()} className="hover:bg-slate-800/40 transition">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-white text-sm">
                              {job.title}
                            </div>
                            <div className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-1.5">
                              <span>{job.jobType}</span>
                              <span>•</span>
                              <span>{job.workMode}</span>
                              <span>•</span>
                              <span>{job.location}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center font-semibold text-white">
                            {job.openings || 1} Seat{(job.openings || 1) === 1 ? "" : "s"}
                          </td>

                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              <span className="font-bold text-white text-sm">{appCount}</span>
                              {appCount === 0 && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  Sourcing
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {pipelineCount} Active
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <span className="font-semibold text-emerald-400">
                              {hiredCount}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-slate-400 text-xs">
                            {daysLive === 1 ? "Today" : `${daysLive} days`}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/company/applicants?jobId=${job._id}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition"
                            >
                              <span>Review</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
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
    </div>
  );
}
