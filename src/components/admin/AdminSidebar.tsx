"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Building2, 
  LogOut,
  Menu,
  X,
  Shield,
  GraduationCap
} from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Admin session terminated");
      router.push("/admin-login");
      router.refresh();
    } catch {
      toast.error("Failed to log out");
    }
  };

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/companies", label: "Company Verifications", icon: Building2 },
    { href: "/admin/students", label: "Student Roster", icon: GraduationCap },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 h-16 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
            <ShieldCheck className="w-4 h-4" />
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
            <Link href="/admin/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base text-white tracking-tight truncate">
                  Vani Job Portal
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                  Admin Governance
                </span>
              </div>
            </Link>

            {/* Role Badge */}
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Shield className="w-3.5 h-3.5" />
                Super Administrator
              </span>
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
                      ? "bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Controls at Bottom */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/60">
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-xs font-semibold text-white truncate">
                Admin Control
              </span>
              <span className="text-[11px] text-slate-500 truncate">System Governance</span>
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
