import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import { Company } from "@/models/Company";
import { Application } from "@/models/Application";
import { Student } from "@/models/Student";
import Link from "next/link";
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Building2, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  FileCheck,
  UserCheck,
  Video,
  Calendar,
  Award,
  Sparkles,
  ExternalLink,
  FileText,
  ChevronRight,
  Users
} from "lucide-react";
import InterviewCalendarButtons from "@/components/student/InterviewCalendarButtons";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const session = await getSession();
  await connectToDatabase();

  const student = await Student.findOne({ userId: session?.userId });

  // 1. Fetch Verified Employers and Available Jobs
  const verifiedCompanies = await Company.find({ verificationStatus: "verified" }).select("_id companyName logoUrl");
  const verifiedCompanyIds = verifiedCompanies.map((c) => c._id);

  const totalAvailableJobs = await Job.countDocuments({
    status: "published",
    companyId: { $in: verifiedCompanyIds },
  });

  // 2. Query Student's Applications
  const applications = student
    ? await Application.find({ studentId: student._id })
        .populate({
          path: "jobId",
          select: "title location jobType workMode salaryMin salaryMax compensationPeriod requiredSkills",
        })
        .populate({
          path: "companyId",
          select: "companyName logoUrl location",
        })
        .sort({ appliedAt: -1 })
    : [];

  const totalApplications = applications.length;
  const appliedCount = applications.filter((a) => a.status === "applied").length;
  const underReviewCount = applications.filter((a) => a.status === "under_review").length;
  const shortlistedCount = applications.filter((a) => a.status === "shortlisted").length;
  const selectedCount = applications.filter((a) => a.status === "selected").length;
  const rejectedCount = applications.filter((a) => a.status === "rejected").length;

  // 3. Upcoming Scheduled Interviews
  const upcomingInterviews = applications
    .filter(
      (a: any) =>
        a.interview?.scheduledAt &&
        new Date(a.interview.scheduledAt).getTime() >= Date.now() - 3600 * 1000 * 2 &&
        a.interview.status !== "cancelled"
    )
    .sort(
      (a: any, b: any) =>
        new Date(a.interview.scheduledAt).getTime() -
        new Date(b.interview.scheduledAt).getTime()
    );

  const nextInterviewApp = upcomingInterviews[0];
  const nextInterview = nextInterviewApp?.interview;

  const formatNextInterviewLabel = () => {
    if (!nextInterview) return null;
    const date = new Date(nextInterview.scheduledAt);
    const isToday = new Date().toDateString() === date.toDateString();
    const isTomorrow =
      new Date(Date.now() + 86400000).toDateString() === date.toDateString();
    const timeStr = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    if (isToday) return `Next: Today at ${timeStr}`;
    if (isTomorrow) return `Next: Tomorrow at ${timeStr}`;
    return `Next: ${date.toLocaleDateString([], { month: "short", day: "numeric" })} at ${timeStr}`;
  };

  // 4. Calculate Profile Completeness Score & Next Missing Step
  let profileScore = 30; // base university enrollment verified
  if (student?.resumeUrl) profileScore += 25;
  if (student?.skills && student.skills.length >= 3) {
    profileScore += 20;
  } else if (student?.skills && student.skills.length > 0) {
    profileScore += 10;
  }
  if (student?.cgpa !== undefined) profileScore += 10;
  if (student?.projects) profileScore += 10;
  if (student?.linkedinUrl || student?.githubUrl || student?.portfolioUrl) profileScore += 5;
  profileScore = Math.min(100, profileScore);

  let nextMissingTip = "Profile 100% placement ready";
  if (!student?.resumeUrl) {
    nextMissingTip = "+25% Upload resume PDF";
  } else if (!student?.skills || student.skills.length < 3) {
    nextMissingTip = "+20% Add 3+ key skills";
  } else if (!student?.projects) {
    nextMissingTip = "+10% Add project showcase";
  } else if (!student?.linkedinUrl && !student?.githubUrl) {
    nextMissingTip = "+5% Add GitHub/LinkedIn";
  }

  // 5. Recent Jobs with Smart Skills Match Calculation
  const recentJobs = await Job.find({
    status: "published",
    companyId: { $in: verifiedCompanyIds },
  })
    .populate({ path: "companyId", select: "companyName logoUrl location" })
    .sort({ createdAt: -1 })
    .limit(4);

  const studentSkillsLower = new Set(
    (student?.skills || []).map((s: string) => s.toLowerCase().trim())
  );

  const recentJobsWithMatch = recentJobs.map((job: any) => {
    const reqSkills: string[] = job.requiredSkills || [];
    const matched = reqSkills.filter((s: string) =>
      studentSkillsLower.has(s.toLowerCase().trim())
    );
    return {
      job,
      matchCount: matched.length,
      totalSkills: reqSkills.length,
      matchedSkills: matched,
    };
  });

  return (
    <div className="space-y-8">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Welcome back, {session?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ready to find your next career breakthrough?
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Your university student credentials are linked. Explore verified openings from approved employers and track interview pipeline statuses in real time.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/student/jobs"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore All Jobs</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>
            <Link
              href="/student/profile"
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm transition"
            >
              Update Profile & Resume
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          TIER 1: THE 4 "JOB-SEEKER PULSE" KPI CARDS
          Distinct accent palettes: Emerald, Amber, Violet, Rose/Indigo
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Applications (Sky/Blue) */}
        <Link
          href="/student/applications"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Applications in Motion</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalApplications}
              <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 ml-2">Active</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
            <span className="font-medium text-slate-700 dark:text-slate-300">{underReviewCount} Under Review</span>
            <span>{appliedCount} Submitted</span>
          </div>
        </Link>

        {/* Card 2: Scheduled Interviews & Calls (Emerald) */}
        <Link
          href="/student/applications"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/50 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Interview Calls</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-600/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-center gap-2">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {upcomingInterviews.length}
              <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 ml-2">Scheduled</span>
            </div>
            {upcomingInterviews.length > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2.5 truncate">
            {formatNextInterviewLabel() || "No active interview rounds"}
          </div>
        </Link>

        {/* Card 3: Shortlists & Milestone Wins (Amber / Gold) */}
        <Link
          href="/student/applications"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Shortlists & Wins</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-600/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {shortlistedCount + selectedCount}
              <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 ml-2">Progressed</span>
            </div>
          </div>
          <div className="text-[11px] flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
            {selectedCount > 0 ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">🎉 {selectedCount} Offer Selected</span>
            ) : (
              <span className="text-amber-700 dark:text-amber-400 font-semibold">{shortlistedCount} Shortlisted Rounds</span>
            )}
            <span className="text-slate-400">{rejectedCount} Closed</span>
          </div>
        </Link>

        {/* Card 4: Profile & Resume Readiness (Violet / Purple) */}
        <Link
          href="/student/profile"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-500/50 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Profile Readiness</span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {profileScore}%
              <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 ml-2">Ready</span>
            </div>
          </div>
          <div className="text-[11px] text-violet-700 dark:text-violet-300 font-medium border-t border-slate-100 dark:border-slate-800/80 pt-2.5 truncate">
            {nextMissingTip}
          </div>
        </Link>
      </div>

      {/* ========================================================
          TIER 2: TWO ACTIONABLE INSIGHT PANELS (50/50 SPLIT)
          Left: Application Pipeline Journey
          Right: Interview Command Center & Preparation Hub
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel A: Live Application Journey Tracker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  My Application Pipeline
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time status breakdown across employer review stages
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                {totalApplications} Active
              </span>
            </div>

            {/* Segmented Timeline Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-xl h-3 p-0.5 flex gap-1 overflow-hidden border border-slate-200 dark:border-slate-800">
                <div
                  className="bg-blue-600 rounded-lg transition-all"
                  style={{
                    width: totalApplications > 0 ? `${(appliedCount / totalApplications) * 100}%` : "0%",
                  }}
                  title={`Applied: ${appliedCount}`}
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-center">
                <div className="bg-blue-50/60 dark:bg-slate-950/70 border border-blue-200/70 dark:border-slate-800/80 rounded-xl p-3 shadow-xs">
                  <div className="text-[10px] text-blue-700 dark:text-slate-400 font-semibold uppercase tracking-wider">Applied</div>
                  <div className="text-xl font-bold text-blue-700 dark:text-blue-400 mt-0.5">{appliedCount}</div>
                  <div className="text-[10px] text-slate-500">Submitted</div>
                </div>

                <div className="bg-amber-50/60 dark:bg-slate-950/70 border border-amber-200/70 dark:border-slate-800/80 rounded-xl p-3 shadow-xs">
                  <div className="text-[10px] text-amber-700 dark:text-slate-400 font-semibold uppercase tracking-wider">In Review</div>
                  <div className="text-xl font-bold text-amber-700 dark:text-amber-400 mt-0.5">{underReviewCount}</div>
                  <div className="text-[10px] text-slate-500">Screening</div>
                </div>

                <div className="bg-emerald-50/60 dark:bg-slate-950/70 border border-emerald-200/70 dark:border-slate-800/80 rounded-xl p-3 shadow-xs">
                  <div className="text-[10px] text-emerald-700 dark:text-slate-400 font-semibold uppercase tracking-wider">Shortlisted</div>
                  <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{shortlistedCount}</div>
                  <div className="text-[10px] text-slate-500">Interviews</div>
                </div>

                <div className="bg-violet-50/60 dark:bg-slate-950/70 border border-violet-200/70 dark:border-slate-800/80 rounded-xl p-3 shadow-xs">
                  <div className="text-[10px] text-violet-700 dark:text-slate-400 font-semibold uppercase tracking-wider">Selected</div>
                  <div className="text-xl font-bold text-violet-700 dark:text-violet-400 mt-0.5">{selectedCount}</div>
                  <div className="text-[10px] text-slate-500">Hired</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {rejectedCount > 0 ? `${rejectedCount} archived` : "All active in process"}
            </span>
            <Link
              href="/student/applications"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
            >
              <span>View Application Dossiers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Panel B: Interview Command Center & Joining Hub */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  Interview Hub & Schedule
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Confirmed technical rounds, meeting links & preparation
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                {upcomingInterviews.length} Action Items
              </span>
            </div>

            {upcomingInterviews.length === 0 ? (
              <div className="py-7 px-4 text-center rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                <Calendar className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">No active interviews scheduled</h4>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  When employers shortlist your resume, your interview time and video call links will appear here.
                </p>
                <div className="pt-1">
                  <Link
                    href="/student/jobs"
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    <span>Browse Verified Openings</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3 no-scrollbar max-h-[220px] overflow-y-auto pr-1">
                {upcomingInterviews.slice(0, 2).map((app: any) => {
                  const interview = app.interview;
                  const companyName = app.companyId?.companyName || "Employer";
                  const jobTitle = app.jobId?.title || "Role";

                  return (
                    <div
                      key={app._id.toString()}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-emerald-300 dark:border-emerald-500/30 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {interview.roundTitle}
                            </h4>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 uppercase">
                              Scheduled
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                            {companyName} • {jobTitle}
                          </p>
                        </div>

                        <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/80 shrink-0">
                          {new Date(interview.scheduledAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })} at {new Date(interview.scheduledAt).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>

                      {interview.notes && (
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 line-clamp-1">
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
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Synced with direct Google Meet & .ics calendar downloads
            </span>
            <Link
              href="/student/applications"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
            >
              <span>View All Applications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          TIER 3: SMART MATCHED JOBS (RECOMMENDED FOR YOU)
          Highlights skill match ratio & quick application flow
          ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Recommended Opportunities for You
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified employer listings matched to your academic credentials and listed skill set
            </p>
          </div>
          <Link
            href="/student/jobs"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
          >
            Explore All ({totalAvailableJobs}) →
          </Link>
        </div>

        {recentJobsWithMatch.length === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center">
            <Briefcase className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No active job listings yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Employers are preparing verified openings. Check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentJobsWithMatch.map(({ job, matchCount, totalSkills, matchedSkills }) => {
              const companyName = job.companyId?.companyName || "Verified Employer";

              return (
                <div
                  key={job._id.toString()}
                  className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-5 transition flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-700 dark:text-slate-300">{companyName}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                        </p>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                        {job.jobType}
                      </span>
                    </div>

                    {/* Skill Match Badge & Tech Stack */}
                    {totalSkills > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {matchCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{matchCount} of {totalSkills} Skills Match</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            {totalSkills} Skills Required
                          </span>
                        )}

                        {job.requiredSkills.slice(0, 3).map((skill: string, idx: number) => {
                          const isMatched = studentSkillsLower.has(skill.toLowerCase().trim());
                          return (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                                isMatched
                                  ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60"
                                  : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                              }`}
                            >
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between text-xs">
                    <div>
                      {job.salaryMin ? (
                        <span className="font-bold text-slate-900 dark:text-white">
                          ₹{job.salaryMin.toLocaleString()}
                          {job.salaryMax ? ` - ₹${job.salaryMax.toLocaleString()}` : ""}{" "}
                          <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                            {job.compensationPeriod || "Per Annum"}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-500">Competitive Compensation</span>
                      )}
                    </div>

                    <Link
                      href={`/student/jobs/${job._id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs flex items-center gap-1 transition shadow-xs"
                    >
                      <span>View Role</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
