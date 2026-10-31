"use client";

import { Code2, Sparkles, Layers, Plus, Edit2, Trash2 } from "lucide-react";
import { ITSkillItem } from "./types";

interface ProfileSkillsProps {
  skillsList: string[];
  newSkillInput: string;
  setNewSkillInput: (val: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (skill: string) => void;
  onQuickAddSkill: (skill: string) => void;
  itSkillsList: ITSkillItem[];
  onOpenAddItSkill: () => void;
  onEditItSkill: (index: number) => void;
  onDeleteItSkill: (index: number) => void;
}

export function ProfileSkills({
  skillsList,
  newSkillInput,
  setNewSkillInput,
  onAddSkill,
  onRemoveSkill,
  onQuickAddSkill,
  itSkillsList,
  onOpenAddItSkill,
  onEditItSkill,
  onDeleteItSkill,
}: ProfileSkillsProps) {
  return (
    <>
      {/* 4. KEY SKILLS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Key skills</h3>
              <p className="text-[11px] text-slate-500">Verified core competencies matched against employer job requirements</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {skillsList.length} skills listed
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {skillsList.map((skill) => (
            <span
              key={skill}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2 group shadow-xs"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => onRemoveSkill(skill)}
                className="text-emerald-500 hover:text-rose-500 transition font-bold"
                title="Remove skill"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddSkill();
              }
            }}
            placeholder="Add new skill (e.g. Next.js, Docker, MongoDB) and press Enter"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition"
          />
          <button
            type="button"
            onClick={onAddSkill}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs"
          >
            + Add Skill
          </button>
        </div>

        {/* In-Demand Skill Suggestions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>Suggested:</span>
          </span>
          {["Docker", "Tailwind CSS", "TypeScript", "PostgreSQL", "Next.js", "Redis", "Git", "REST APIs", "AWS"].map((sugg) => {
            if (skillsList.includes(sugg)) return null;
            return (
              <button
                key={sugg}
                type="button"
                onClick={() => onQuickAddSkill(sugg)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 hover:border-emerald-300 dark:border-slate-700 text-[11px] font-semibold transition"
              >
                + {sugg}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. IT SKILLS MATRIX */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-600/10 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">IT skills</h3>
              <p className="text-[11px] text-slate-500">Technical versions, recency of usage, and total active experience</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenAddItSkill}
            className="px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add skill row</span>
          </button>
        </div>

        {itSkillsList.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-500 font-medium">No technical IT skills matrix added yet.</p>
            <button
              type="button"
              onClick={onOpenAddItSkill}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              + Add your primary programming languages & tools
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar rounded-2xl border border-teal-200/60 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-teal-50/50 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
                <tr className="border-b border-teal-200/60 dark:border-slate-800">
                  <th className="px-4 py-3 font-bold">Skills</th>
                  <th className="px-4 py-3 font-bold">Version</th>
                  <th className="px-4 py-3 font-bold">Last used</th>
                  <th className="px-4 py-3 font-bold">Experience</th>
                  <th className="px-4 py-3 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                {itSkillsList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-teal-50/30 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{item.skill}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.version || "-"}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.lastUsed || "2026"}</td>
                    <td className="px-4 py-3 text-teal-800 dark:text-teal-300 font-semibold">
                      {item.experienceYears || 0} Year {item.experienceMonths || 0} Month
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditItSkill(idx)}
                          className="text-slate-400 hover:text-teal-600 transition p-1"
                        >
                          <Edit2 className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteItSkill(idx)}
                          className="text-slate-400 hover:text-rose-500 transition p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
