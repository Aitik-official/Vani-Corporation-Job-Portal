import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Notification } from "@/models/Notification";
import { Bell, CheckCircle2, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CompanyNotificationsPage() {
  const session = await getSession();
  await connectToDatabase();

  const notifications = session
    ? await Notification.find({ userId: session.userId }).sort({ createdAt: -1 })
    : [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Employer Notifications</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review updates regarding student applications and administrative account verifications.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h2 className="text-base font-semibold text-white">No notifications yet</h2>
          <p className="text-xs text-slate-400 mt-1">
            When students submit applications or your account verification status changes, updates appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n: any) => (
            <div
              key={n._id.toString()}
              className={`p-4 rounded-xl border transition flex items-start gap-3.5 ${
                n.isRead
                  ? "bg-slate-900/40 border-slate-800/80 text-slate-400"
                  : "bg-slate-900/90 border-violet-500/30 text-slate-200 shadow-md shadow-violet-500/5"
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">{n.title}</h3>
                  <span className="text-[11px] text-slate-500 shrink-0">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
