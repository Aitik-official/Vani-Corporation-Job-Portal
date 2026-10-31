"use client";

import { Code2, Plus, Edit2, Trash2, BookOpen, Award, Globe } from "lucide-react";
import { ProjectItem, Accomplishments } from "./types";

interface ProfileProjectsProps {
  projectList: ProjectItem[];
  onOpenAddProject: () => void;
  onEditProject: (index: number) => void;
  onDeleteProject: (index: number) => void;
  profileSummary: string;
  setProfileSummary: (val: string) => void;
  accomplishments: Accomplishments;
  onOpenAddOnlineProfile: () => void;
  onDeleteOnlineProfile: (index: number) => void;
  onOpenAddCert: () => void;
  onDeleteCert: (index: number) => void;
}

export function ProfileProjects({
  projectList,
  onOpenAddProject,
  onEditProject,
  onDeleteProject,
  profileSummary,
  setProfileSummary,
  accomplishments,
  onOpenAddOnlineProfile,
  onDeleteOnlineProfile,
  onOpenAddCert,
  onDeleteCert,
}: ProfileProjectsProps) {
  return (
    <>
      {/* 8. PROJECTS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-600/10 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Projects</h3>
              <p className="text-[11px] text-slate-500">Software systems, capstone prototypes, and production code repositories</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenAddProject}
            className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-bold flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add project</span>
          </button>
        </div>

        {projectList.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-500 font-medium">No projects added yet.</p>
            <button
              type="button"
              onClick={onOpenAddProject}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              + Add your capstone, coursework, or open source project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectList.map((proj, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-sky-50/30 dark:bg-slate-950 border border-sky-200/60 dark:border-slate-800 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {proj.title}
                    </h4>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditProject(idx)}
                        className="text-slate-400 hover:text-sky-600 transition p-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteProject(idx)}
                        className="text-slate-400 hover:text-rose-500 transition p-1"
                        title="Remove project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {proj.clientOrOrg && (
                    <p className="text-xs font-semibold text-sky-700 dark:text-sky-300 mt-0.5">
                      {proj.clientOrOrg} {proj.role ? `• ${proj.role}` : ""}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {proj.startDate} to {proj.endDate || "Present"}
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-2 border-t border-sky-100 dark:border-slate-800 mt-2">
                    {proj.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 9. PROFILE SUMMARY */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-600/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Profile summary</h3>
              <p className="text-[11px] text-slate-500">Comprehensive overview of career goals, strengths, and professional direction</p>
            </div>
          </div>
        </div>

        <textarea
          rows={3}
          value={profileSummary}
          onChange={(e) => setProfileSummary(e.target.value)}
          placeholder="Eager to launch a career as an entry-level Software Engineer..."
          className="w-full px-4 py-3 rounded-2xl bg-rose-50/30 dark:bg-slate-950 border border-rose-200/80 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-rose-500 transition leading-relaxed"
        />
      </div>

      {/* 10. ACCOMPLISHMENTS & CERTIFICATIONS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-600/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Accomplishments & Certifications</h3>
              <p className="text-[11px] text-slate-500">Online handles, portfolio links, and accredited technical certifications</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Online profiles */}
          <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-slate-950 border border-amber-200/70 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Online Profiles & Links</h4>
                <button
                  type="button"
                  onClick={onOpenAddOnlineProfile}
                  className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
                >
                  + Add Link
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">LinkedIn, GitHub, Behance and portfolios</p>
              {accomplishments.onlineProfiles && accomplishments.onlineProfiles.length > 0 ? (
                <div className="space-y-2 mt-3">
                  {accomplishments.onlineProfiles.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 p-2 rounded-xl border border-amber-200/60 dark:border-slate-800">
                      <a href={p.url} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono flex items-center gap-1 truncate mr-2">
                        <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{p.platform}: {p.url}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => onDeleteOnlineProfile(i)}
                        className="text-slate-400 hover:text-rose-500 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic mt-3">No profile links added yet.</p>
              )}
            </div>
          </div>

          {/* Certifications */}
          <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-slate-950 border border-amber-200/70 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Verified Certifications</h4>
                <button
                  type="button"
                  onClick={onOpenAddCert}
                  className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
                >
                  + Add Cert
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Formal examinations and accredited technical certifications</p>
              {accomplishments.certifications && accomplishments.certifications.length > 0 ? (
                <div className="space-y-2 mt-3">
                  {accomplishments.certifications.map((c, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">{c.title}</div>
                        <div className="text-[11px] text-slate-500">{c.provider} • Validity: {c.validFrom} to {c.validTo}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteCert(i)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic mt-3">No certifications added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
