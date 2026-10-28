"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  GraduationCap, 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  User, 
  LogOut, 
  Bell,
  Bookmark 
} from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/shared/ThemeToggle";

interface StudentNavbarProps {
  userName?: string;
  userEmail?: string;
}

export default function StudentNavbar({ userName, userEmail }: StudentNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

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
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/student/dashboard" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-white tracking-tight">OpportunityHub</span>
              <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Student Portal</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/student/notifications"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 relative transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-2 ring-slate-950" />
            )}
          </Link>

          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-medium text-slate-200">{userName || "Student"}</span>
            <span className="text-[11px] text-slate-500 truncate max-w-[150px]">{userEmail}</span>
          </div>

          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
