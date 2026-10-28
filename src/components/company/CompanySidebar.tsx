"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Building2, 
  LayoutDashboard, 
  Briefcase, 
  FilePlus, 
  Users, 
  Settings, 
  LogOut, 
  Bell,
  ShieldCheck,
  Menu,
  X
} from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/shared/ThemeToggle";

interface CompanySidebarProps {
  companyName?: string;
  verificationStatus?: string;
}

export default function CompanySidebar({ companyName, verificationStatus }: CompanySidebarProps) {
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
      router.push("/company-login");
      router.refresh();
    } catch {
      toast.error("Failed to log out");
    }
  };

  const navLinks = [
    { href: "/company/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/company/jobs", label: "Manage Jobs", icon: Briefcase },
    { href: "/company/jobs/new", label: "Post New Job", icon: FilePlus },
    { href: "/company/applicants", label: "All Applicants", icon: Users },
    { href: "/company/profile", label: "Company Profile", icon: Settings },
    { href: "/company/notifications", label: "Notifications", icon: Bell, badge: unreadCount },
  ];

  const getStatusBadge = () => {
    if (verificationStatus === "verified") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified Employer
        </span>
      );
    }
    if (verificationStatus === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Verification Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        Verification Pending
      </span>
    );
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 h-16 flex items-center justify-between">
        <Link href="/company/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-sm">Vani Job Portal</span>
        </Link>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo / Brand Header */}
          <div className="p-6 border-b border-slate-800/80">
            <Link href="/company/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base text-white tracking-tight truncate">
                  Vani Job Portal
                </span>
                <span className="text-[10px] text-violet-400 font-semibold tracking-wider uppercase">
                  Company Portal
                </span>
              </div>
            </Link>

            {/* Verification Status Pill */}
            <div className="mt-4">
              {getStatusBadge()}
            </div>
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-violet-600/15 text-violet-400 border border-violet-500/30 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && link.badge > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-violet-600 text-white">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Company Card & Controls at Bottom */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/60">
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-xs font-semibold text-white truncate">
                {companyName || "Company"}
              </span>
              <span className="text-[11px] text-slate-500 truncate">Employer Account</span>
            </div>
            <ThemeToggle />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
