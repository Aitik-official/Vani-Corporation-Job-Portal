"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  GraduationCap, 
  LayoutDashboard, 
  Briefcase, 
  Bookmark, 
  FileText, 
  User, 
  LogOut, 
  Bell,
  Menu,
  X
} from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/shared/ThemeToggle";

interface StudentSidebarProps {
  userName?: string;
  userEmail?: string;
}

export default function StudentSidebar({ userName, userEmail }: StudentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
  }, [pathname]);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (res.ok) {
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // Ignore background badge fetch errors
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/student-login");
      router.refresh();
    } catch {
      toast.error("Failed to log out");
    }
  };

  const navLinks = [
    { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/jobs", label: "Browse Jobs", icon: Briefcase },
    { href: "/student/saved", label: "Saved Jobs", icon: Bookmark },
    { href: "/student/applications", label: "My Applications", icon: FileText },
    { href: "/student/profile", label: "My Profile", icon: User },
    { href: "/student/notifications", label: "Notifications", icon: Bell, badge: unreadCount },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 h-16 flex items-center justify-between">
        <Link href="/student/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm">Vani Job Portal</span>
        </Link>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Sidebar (Always Visible on Desktop z-40 so modals with z-50 can sit inside main or overlay cleanly) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo / Brand Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800/80">
            <Link href="/student/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight truncate">
                  Vani Job Portal
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase">
                  Student Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 flex-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-600/15 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-900 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && link.badge > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Controls at Bottom */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3 bg-slate-50/70 dark:bg-slate-950/60">
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {userName || "Student"}
              </span>
              <span className="text-[11px] text-slate-500 truncate">{userEmail}</span>
            </div>
            <ThemeToggle />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
