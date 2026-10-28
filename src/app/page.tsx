import Link from "next/link";
import { 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Search,
  FileText
} from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Vani Job Portal
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/student-login"
              className="hidden md:inline-block text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Student Sign In
            </Link>
            <Link
              href="/company-login"
              className="hidden md:inline-block text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Company Sign In
            </Link>
            <Link
              href="/student-login"
              className="md:hidden text-xs font-medium text-slate-300 hover:text-white px-2 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/student-signup"
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/25 transition-all duration-150"
            >
              Get Started
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 border-b border-slate-900">
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dual-Sided Unified Recruitment Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Connect Top University Talent with{" "}
            <span className="text-indigo-400">
              Verified High-Growth Companies
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed">
            One platform powering specialized dashboards for students and employers. Verified company job postings, seamless 1-click applications, and direct candidate tracking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/student-signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Explore as a Student</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/company-signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Building2 className="w-5 h-5 text-indigo-400" />
              <span>Register as a Company</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Dual Portals Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Student Card */}
          <div className="relative rounded-2xl bg-slate-900 p-8 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Student Portal</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Build your technical profile, upload your resume, discover verified openings, and track your interview pipeline with real-time status updates.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified openings with salary/stipend clarity</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>One-click apply with duplicate prevention</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Live status tracking: Shortlisted, Under Review, Selected</span>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/student-signup"
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition text-center"
              >
                Create Student Account
              </Link>
              <Link
                href="/student-login"
                className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition text-center"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Company Card */}
          <div className="relative rounded-2xl bg-slate-900 p-8 border border-slate-800 hover:border-violet-500/40 transition-all duration-300 group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Company Portal</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Post roles, review applicant resumes and profiles, shortlist top candidates, and coordinate campus hiring with a verified badge.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                <span>Admin verification workflow for trusted hiring</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-400" />
                <span>Comprehensive applicant profile & resume viewer</span>
              </li>
              <li className="flex items-center gap-2">
                <Search className="w-4 h-4 text-violet-400" />
                <span>Search, filter by skills, and manage pipelines</span>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/company-signup"
                className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition text-center"
              >
                Register Company
              </Link>
              <Link
                href="/company-login"
                className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Vani Job Portal. A Subsidiary of Vani Corporation.</p>
          <div className="flex items-center space-x-4">
            <Link href="/admin-login" className="hover:text-slate-300 transition">
              Admin Portal
            </Link>
            <span>•</span>
            <span>Secure Role-Based Access Control</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
