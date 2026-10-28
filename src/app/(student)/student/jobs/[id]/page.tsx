import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import { Student } from "@/models/Student";
import { Application } from "@/models/Application";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Calendar, 
  Briefcase, 
  Globe, 
  CheckCircle2, 
  ShieldCheck,
  ArrowLeft,
  Users
} from "lucide-react";
import ApplyButtonModal from "@/components/student/ApplyButtonModal";
import BookmarkButton from "@/components/student/BookmarkButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  await connectToDatabase();

  const session = await getSession();

  const rawJob = await Job.findById(id).populate({
    path: "companyId",
    select: "companyName logoUrl location website description verificationStatus officialEmail",
  });

  if (!rawJob) {
    notFound();
  }

  const job = rawJob as any;

  // Check if current student has already applied and saved
  let hasApplied = false;
  let isSaved = false;
  let studentProfile = null;

  if (session && session.role === "student") {
    studentProfile = await Student.findOne({ userId: session.userId });
    if (studentProfile) {
      const existingApplication = await Application.findOne({
        studentId: studentProfile._id,
        jobId: job._id,
      });
      hasApplied = !!existingApplication;

      const savedList = (studentProfile.savedJobs || []).map((jId: any) => jId.toString());
      isSaved = savedList.includes(job._id.toString());
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href="/student/jobs"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all opportunities</span>
      </Link>

      {/* Main Job Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-start gap-4">
            {job.companyId?._id ? (
              <Link
                href={`/student/companies/${job.companyId._id}`}
                className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center font-bold text-2xl text-indigo-400 shrink-0 hover:bg-indigo-600/20 transition"
                title={`View ${job.companyId.companyName} Profile`}
              >
                {job.companyId?.companyName ? job.companyId.companyName[0] : "C"}
              </Link>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center font-bold text-2xl text-indigo-400 shrink-0">
                {job.companyId?.companyName ? job.companyId.companyName[0] : "C"}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">{job.title}</h1>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mt-1.5">
                {job.companyId?._id ? (
                  <Link
                    href={`/student/companies/${job.companyId._id}`}
                    className="flex items-center gap-1 text-slate-200 hover:text-indigo-400 font-medium transition"
                  >
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>{job.companyId?.companyName}</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 text-slate-200 font-medium">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    {job.companyId?.companyName}
                  </span>
                )}

                {job.companyId?.verificationStatus === "verified" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Partner
                  </span>
                )}

                {job.companyId?.website && (
                  <a
                    href={job.companyId.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Company Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Apply Modal trigger and Bookmark Button */}
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0">
            {session?.role === "student" && (
              <BookmarkButton
                jobId={job._id.toString()}
                initialIsSaved={isSaved}
                className="py-2.5 px-3 h-10"
              />
            )}
            <ApplyButtonModal
              jobId={job._id.toString()}
              jobTitle={job.title}
              companyName={job.companyId?.companyName || "Employer"}
              hasApplied={hasApplied}
              studentResumeUrl={studentProfile?.resumeUrl || ""}
              isStudent={session?.role === "student"}
            />
          </div>
        </div>

        {/* Quick specs grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block mb-1">Job Type</span>
            <span className="font-semibold text-white">{job.jobType}</span>
          </div>

          <div>
            <span className="text-slate-500 block mb-1">Work Mode</span>
            <span className="font-semibold text-white">{job.workMode}</span>
          </div>

          <div>
            <span className="text-slate-500 block mb-1">Location</span>
            <span className="font-semibold text-white">{job.location}</span>
          </div>

          <div>
            <span className="text-slate-500 block mb-1">Compensation</span>
            <span className="font-semibold text-emerald-400">
              {job.salaryMin
                ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax ? job.salaryMax.toLocaleString() : "DOE"}`
                : "Confidential"}
            </span>
          </div>
        </div>

        {/* Additional metadata */}
        <div className="flex flex-wrap items-center gap-4 pt-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Openings: {job.openings}</span>
          </span>

          {job.applicationDeadline && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
            </span>
          )}

          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
          </span>
        </div>
      </div>

      {/* Description & Requirements */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
        <div>
          <h2 className="text-base font-bold text-white mb-3">About the Role</h2>
          <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
            {job.description}
          </div>
        </div>

        {job.responsibilities && (
          <div>
            <h2 className="text-base font-bold text-white mb-3">Key Responsibilities</h2>
            <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
              {job.responsibilities}
            </div>
          </div>
        )}

        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-white mb-3">Required Technical Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {job.qualifications && (
          <div>
            <h2 className="text-base font-bold text-white mb-3">Qualifications & Criteria</h2>
            <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
              {job.qualifications}
            </div>
          </div>
        )}

        {job.companyId?.description && (
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">About {job.companyId.companyName}</h2>
              {job.companyId?._id && (
                <Link
                  href={`/student/companies/${job.companyId._id}`}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition"
                >
                  View Full Employer Profile & All Roles →
                </Link>
              )}
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{job.companyId.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
