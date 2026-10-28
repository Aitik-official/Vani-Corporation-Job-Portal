import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Company } from "@/models/Company";
import { Job } from "@/models/Job";
import { Student } from "@/models/Student";
import Link from "next/link";
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Briefcase, 
  GraduationCap, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await connectToDatabase();

  const totalCompanies = await Company.countDocuments();
  const pendingRequests = await Company.countDocuments({ verificationStatus: "pending" });
  const verifiedCompanies = await Company.countDocuments({ verificationStatus: "verified" });
  const rejectedCompanies = await Company.countDocuments({ verificationStatus: "rejected" });

  const totalJobs = await Job.countDocuments();
  const totalStudents = await Student.countDocuments();

  // Recent pending companies awaiting decision
  const pendingCompanies = await Company.find({ verificationStatus: "pending" })
    .populate({ path: "userId", select: "email createdAt" })
    .sort({ createdAt: -1 })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Platform Verification Dashboard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Admin Governance & Oversight
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review business credentials, approve or reject company verification requests, and maintain trusted hiring standards.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Companies</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-3">{totalCompanies}</div>
          <div className="text-xs text-slate-500 mt-1">Registered employers</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-500">Pending Verifications</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-500 mt-3">{pendingRequests}</div>
          <div className="text-xs text-amber-600/80 mt-1 font-medium">Requires review</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-500">Verified Companies</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-500 mt-3">{verifiedCompanies}</div>
          <div className="text-xs text-emerald-600/80 mt-1 font-medium">Authorized to publish</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-500">Rejected Requests</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-500 mt-3">{rejectedCompanies}</div>
          <div className="text-xs text-rose-600/80 mt-1 font-medium">Denied accreditation</div>
        </div>
      </div>

      {/* Quick Governance Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/students"
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-4 flex items-center justify-between transition group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition">
                Student Roster & Academic Records
              </div>
              <div className="text-xs text-slate-400">
                {totalStudents} registered candidates • View CGPA, resumes & placements
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
        </Link>

        <Link
          href="/admin/companies"
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-4 flex items-center justify-between transition group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-indigo-400 transition">
                Company Verifications & Audits
              </div>
              <div className="text-xs text-slate-400">
                {totalCompanies} employers registered • {pendingRequests} awaiting review
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
        </Link>
      </div>

      {/* Pending Requests Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Pending Verification Queue ({pendingRequests})</h2>
          </div>
          <Link
            href="/admin/companies"
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition"
          >
            Manage all companies →
          </Link>
        </div>

        {pendingCompanies.length === 0 ? (
          <div className="rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 p-10 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">Verification queue is completely clear</h3>
            <p className="text-xs text-slate-400 mt-1">
              All company applications have been reviewed.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Responsive Mobile Cards (Visible on screens < 768px) */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {pendingCompanies.map((c: any) => (
                <div
                  key={c._id.toString()}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug">{c.companyName}</h3>
                      <div className="text-slate-400 text-xs mt-0.5">{c.officialEmail}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      Pending
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Contact:</span>
                      <span>{c.contactPerson} ({c.contactNumber})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span>{c.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Documents:</span>
                      <span>{c.verificationDocuments?.length || 0} attached</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Registered {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/admin/companies?reviewId=${c._id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition inline-flex items-center gap-1 shadow-sm"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
                      <th className="px-6 py-4 font-semibold">Company Name</th>
                      <th className="px-6 py-4 font-semibold">Contact Person</th>
                      <th className="px-6 py-4 font-semibold">Location</th>
                      <th className="px-6 py-4 font-semibold">Documents</th>
                      <th className="px-6 py-4 font-semibold">Registered</th>
                      <th className="px-6 py-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {pendingCompanies.map((c: any) => (
                      <tr key={c._id.toString()} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white text-sm">{c.companyName}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">{c.officialEmail}</div>
                        </td>

                        <td className="px-6 py-4">
                          <div>{c.contactPerson}</div>
                          <div className="text-slate-500 text-[11px]">{c.contactNumber}</div>
                        </td>

                        <td className="px-6 py-4">{c.location}</td>

                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                            {c.verificationDocuments?.length || 0} files attached
                          </span>
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/companies?reviewId=${c._id}`}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition inline-flex items-center gap-1"
                          >
                            <span>Review</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
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
    </div>
  );
}
