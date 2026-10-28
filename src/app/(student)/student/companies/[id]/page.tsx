import { notFound } from "next/navigation";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Company } from "@/models/Company";
import { Job } from "@/models/Job";
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ArrowLeft, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  ArrowRight,
  Sparkles
} from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentCompanyDetailPage({ params }: PageProps) {
  const { id } = await params;
  await connectToDatabase();

  let company = null;
  try {
    company = await Company.findById(id);
  } catch {
    notFound();
  }

  if (!company) {
    notFound();
  }

  // Fetch all published jobs by this company
  const activeJobs = await Job.find({
    companyId: company._id,
    status: "published",
  }).sort({ createdAt: -1 });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb / Back button */}
      <div>
        <Link
          href="/student/jobs"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Opportunities</span>
        </Link>
      </div>

      {/* Company Header Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600 border border-indigo-500/30 flex items-center justify-center font-extrabold text-2xl sm:text-3xl text-white shrink-0 shadow-sm">
              {company.companyName ? company.companyName[0] : "C"}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {company.companyName}
                </h1>
                {company.verificationStatus === "verified" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Employer
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Pending Verification
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  {company.location}
                </span>

                {company.website && (
                  <a
                    href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 hover:underline transition"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Official Website</span>
                  </a>
                )}

                {company.officialEmail && (
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Mail className="w-4 h-4 text-slate-500" />
                    {company.officialEmail}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-start sm:items-end">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400">Active Openings: </span>
              <span className="text-white font-bold">{activeJobs.length}</span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="pt-6 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            About the Company
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {company.description || "This organization has not yet provided a detailed bio or background summary."}
          </p>
        </div>
      </div>

      {/* Open Positions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span>Current Opportunities at {company.companyName}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore open campus requisitions and direct roles offered by this organization.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {activeJobs.length} {activeJobs.length === 1 ? "Role Available" : "Roles Available"}
          </span>
        </div>

        {activeJobs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-white">No active job requisitions</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {company.companyName} does not have any active postings right now. Check back soon for upcoming campus drives!
            </p>
            <Link
              href="/student/jobs"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition mt-2"
            >
              Browse other companies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeJobs.map((job) => (
              <div
                key={job._id.toString()}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition group shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition leading-snug">
                        {job.title}
                      </h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {job.category}
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-950 border border-slate-800 text-slate-300 shrink-0">
                      {job.jobType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {job.location} ({job.workMode})
                    </span>

                    {(job.salaryMin || job.salaryMax) && (
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <DollarSign className="w-3.5 h-3.5" />
                        {job.salaryMin && job.salaryMax
                          ? `₹${job.salaryMin.toLocaleString()} - ₹${job.salaryMax.toLocaleString()}`
                          : job.salaryMin
                          ? `From ₹${job.salaryMin.toLocaleString()}`
                          : job.salaryMax
                          ? `Up to ₹${job.salaryMax.toLocaleString()}`
                          : ""}
                      </span>
                    )}

                    {job.applicationDeadline && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <Calendar className="w-3.5 h-3.5" />
                        Due {new Date(job.applicationDeadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.requiredSkills.slice(0, 4).map((skill: string) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded text-[11px] bg-slate-950 border border-slate-800 text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-500 font-medium">
                          +{job.requiredSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>

                  <Link
                    href={`/student/jobs/${job._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 hover:underline transition"
                  >
                    <span>View Role & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
