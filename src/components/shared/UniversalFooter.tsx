import Link from "next/link";
import { Briefcase, Building2, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function UniversalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold shadow-sm shadow-indigo-600/20">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
                Vani Job Portal
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                Vani Corporation
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              The flagship campus recruitment and enterprise applicant tracking system powered by <strong>Vani Corporation</strong>. Connecting verified employers with vetted candidates.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Candidate Portal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/student/jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Browse Verified Jobs
                </Link>
              </li>
              <li>
                <Link href="/student/profile" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Candidate Profile & Resume
                </Link>
              </li>
              <li>
                <Link href="/student/applications" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Track Applications
                </Link>
              </li>
            </ul>
          </div>

          {/* Recruiter & Admin Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Employer & Admin</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/company/dashboard" className="hover:text-violet-600 dark:hover:text-violet-400 transition">
                  Recruiter Hub
                </Link>
              </li>
              <li>
                <Link href="/company/jobs/new" className="hover:text-violet-600 dark:hover:text-violet-400 transition">
                  Post New Opening
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Vani Admin Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {currentYear} <strong>Vani Job Portal</strong> — A Subsidiary of <strong>Vani Corporation</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ISO & SOC2 Verified Campus Engine</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>Privacy & Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

