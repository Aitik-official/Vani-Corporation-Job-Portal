"use client";

import { MapPin, Phone, Mail, CheckCircle2, Sparkles, Edit2, Save, Loader2 } from "lucide-react";

interface ProfileHeroProps {
  name: string;
  phone: string;
  email: string;
  location: string;
  noticePeriod: string;
  resumeUpdatedAt: string;
  completeness: number;
  saving: boolean;
  onEditHero: () => void;
  onSaveAll: () => void;
}

export function ProfileHero({
  name,
  phone,
  email,
  location,
  noticePeriod,
  resumeUpdatedAt,
  completeness,
  saving,
  onEditHero,
  onSaveAll,
}: ProfileHeroProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            {name ? name[0] : "C"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {name || "Student Name"}
              </h1>
              <button
                type="button"
                onClick={onEditHero}
                className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 transition"
                title="Edit Identity & Contact"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Profile last updated — {resumeUpdatedAt || "Recently"}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>{location || "Location not set"}</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>{phone || "Add Phone"}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>{email}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 mt-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                Fresher
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                {noticePeriod}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-2xl border border-indigo-200 dark:border-indigo-500/20">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-400">
              {completeness}% Placement Ready
            </span>
          </div>

          <button
            type="button"
            onClick={onSaveAll}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Saving Changes..." : "Save All Details"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

