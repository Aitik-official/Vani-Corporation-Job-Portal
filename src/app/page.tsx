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
  FileText,
  Users,
  Calendar,
  Award,
  Check,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import UniversalFooter from "@/components/shared/UniversalFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Vani Job Portal
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                Vani Corporation
              </span>
            </div>
          </Link>

          {/* Nav Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/student-login"
              className="hidden md:inline-flex text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Candidate Login
            </Link>
            <Link
              href="/company-login"
              className="hidden md:inline-flex text-xs sm:text-sm font-bold text-slate-600 hover:text-violet-600 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Recruiter Hub
            </Link>

            <Link
              href="/student-signup"
              className="px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all duration-150"
            >
              Get Started
            </Link>

            <div className="pl-1">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-28 overflow-hidden border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Dual-Sided Unified Campus Recruitment Ecosystem</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Connect Top University Talent with{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Verified High-Growth Companies
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            A next-generation talent platform powered by <strong>Vani Corporation</strong>. Verified employer job postings, seamless 1-click candidate applications, and real-time interview pipelines.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              href="/student-signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Explore as a Candidate</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/company-signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <Building2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              <span>Register as an Employer</span>
            </Link>
          </div>

          {/* Metric Highlights Pill Row */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Verified Employers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Placement Spam</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Direct Google Meet Interviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DUAL PORTALS SHOWCASE (Elevated Crisp White Cards) */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tailored Experiences for Candidates & Recruiters
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Dedicated portals engineered specifically to accelerate candidate discoverability and recruiter throughput.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Student Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/90 p-8 sm:p-10 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-300 group shadow-sm hover:shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 transition-transform">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
                Candidate & Student Portal
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                Build your verified academic portfolio, upload your resume PDF, discover transparent openings with clear CTC/stipends, and track interview calls.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Transparent salary, compensation & role expectations
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    1-Click application with comprehensive candidate dossier
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Real-time status tracking: Applied ➔ Shortlisted ➔ Selected
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/student-signup"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition text-center shadow-md shadow-indigo-600/20"
              >
                Create Candidate Account
              </Link>
              <Link
                href="/student-login"
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition text-center"
              >
                Candidate Sign In
              </Link>
            </div>
          </div>

          {/* Company Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/90 p-8 sm:p-10 border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-500/40 transition-all duration-300 group shadow-sm hover:shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-600/10 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 transition-transform">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
                Employer & Recruiter Portal
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                Post technical openings, screen verified student resumes, schedule video interviews, and coordinate hiring pipelines with university endorsement.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-950/60 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-violet-700 dark:text-violet-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Admin verification workflow with trusted employer badge
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-950/60 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-violet-700 dark:text-violet-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Candidate Dossier viewer with PDF preview & instant scheduling
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-950/60 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-violet-700 dark:text-violet-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    One-click applicant export to CSV and calendar sync
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/company-signup"
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-bold transition text-center shadow-md shadow-violet-600/20"
              >
                Register as Employer
              </Link>
              <Link
                href="/company-login"
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition text-center"
              >
                Employer Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UNIVERSAL FOOTER */}
      <UniversalFooter />
    </div>
  );
}
