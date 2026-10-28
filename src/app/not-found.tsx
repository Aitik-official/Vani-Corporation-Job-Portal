"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FileQuestion, 
  ArrowLeft, 
  LayoutDashboard, 
  Briefcase, 
  Building2,
  Sparkles,
  User,
  ShieldCheck
} from "lucide-react";

interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: "student" | "company" | "admin";
  companyName?: string;
  college?: string;
}

export default function NotFound() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read session cookies and details from /api/auth/me
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
          }
        }
      } catch {
        // Fallback gracefully if not logged in
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  // Compute smart dashboard route based on user role
  const getDashboardHref = () => {
    if (!user) return "/";
    if (user.role === "company") return "/company/dashboard";
    if (user.role === "admin") return "/admin/dashboard";
    return "/student/dashboard";
  };

  const getDashboardLabel = () => {
    if (!user) return "Return to Homepage";
    if (user.role === "company") return "Go to Recruiter Dashboard";
    if (user.role === "admin") return "Go to Admin Dashboard";
    return "Go to Student Dashboard";
  };

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(getDashboardHref());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
        {/* Soft Background Accent */}
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-600/15 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-sm">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
            Error 404
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            The resource, document, or page you were looking for doesn't exist, has been removed, or is temporarily unavailable.
          </p>

          {/* User Status Pill if logged in */}
          {user && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                Logged in as <strong className="font-bold">{user.name}</strong> ({user.role})
              </span>
            </div>
          )}
        </div>

        <div className="pt-2 space-y-2.5">
          {/* Primary Action Button: Takes directly to user's personalized Dashboard */}
          <Link
            href={getDashboardHref()}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 transition"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{getDashboardLabel()}</span>
          </Link>

          {/* Secondary Quick Links based on role */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={user?.role === "company" ? "/company/jobs" : "/student/jobs"}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{user?.role === "company" ? "Manage Postings" : "Browse Jobs"}</span>
            </Link>

            <Link
              href={user?.role === "student" ? "/student/profile" : user?.role === "company" ? "/company/applicants" : "/admin/dashboard"}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
            >
              {user?.role === "student" ? (
                <>
                  <User className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  <span>My Profile</span>
                </>
              ) : user?.role === "company" ? (
                <>
                  <Building2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  <span>Applicants Hub</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Admin Panel</span>
                </>
              )}
            </Link>
          </div>

          {/* Reliable Go Back Action */}
          <button
            type="button"
            onClick={handleGoBack}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition pt-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go back to previous page</span>
          </button>
        </div>
      </div>
    </div>
  );
}
