"use client";

import { Briefcase, Plus, Edit2, Trash2, GraduationCap } from "lucide-react";
import { EmploymentItem, EducationItem } from "./types";

interface ProfileExperienceProps {
  employmentList: EmploymentItem[];
  onOpenAddEmployment: () => void;
  onEditEmployment: (index: number) => void;
  onDeleteEmployment: (index: number) => void;
  educationList: EducationItem[];
  onOpenAddEducation: () => void;
  onEditEducation: (index: number) => void;
  onDeleteEducation: (index: number) => void;
}

export function ProfileExperience({
  employmentList,
  onOpenAddEmployment,
  onEditEmployment,
  onDeleteEmployment,
  educationList,
  onOpenAddEducation,
  onEditEducation,
  onDeleteEducation,
}: ProfileExperienceProps) {
  return (
    <>
      {/* 5. EMPLOYMENT & INTERNSHIPS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-600/10 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Employment & Internships</h3>
              <p className="text-[11px] text-slate-500">Corporate work engagements, traineeships, and apprenticeship tenures</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenAddEmployment}
            className="px-3.5 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 dark:bg-violet-950 dark:hover:bg-violet-900 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 text-xs font-bold flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add employment</span>
          </button>
        </div>

        {employmentList.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-500 font-medium">No employment or internship experience added yet.</p>
            <button
              type="button"
              onClick={onOpenAddEmployment}
              className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
            >
              + Add your first internship / job
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {employmentList.map((emp, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-violet-50/30 dark:bg-slate-950 border border-violet-200/60 dark:border-slate-800 space-y-2 relative"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <span>{emp.designation}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300">
                        {emp.employmentType || "Internship"}
                      </span>
                    </h4>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                      {emp.organization}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {emp.startDate} to {emp.endDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditEmployment(index)}
                      className="text-slate-400 hover:text-indigo-600 transition p-1"
                      title="Edit employment"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteEmployment(index)}
                      className="text-slate-400 hover:text-rose-500 transition p-1"
                      title="Delete employment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {emp.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-violet-100 dark:border-slate-800">
                    {emp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. EDUCATION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Education</h3>
              <p className="text-[11px] text-slate-500">Degree, college/university, Class XII and Class X academic credentials</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenAddEducation}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add education</span>
          </button>
        </div>

        {educationList.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-500 font-medium">No education details added yet.</p>
            <button
              type="button"
              onClick={onOpenAddEducation}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Add degree or schooling
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {educationList.map((edu, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-indigo-50/30 dark:bg-slate-950 border border-indigo-200/60 dark:border-slate-800 flex flex-col justify-between gap-3 relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {edu.degree}
                    </h4>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditEducation(idx)}
                        className="text-slate-400 hover:text-indigo-600 transition p-0.5"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteEducation(idx)}
                        className="text-slate-400 hover:text-rose-500 transition p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {edu.collegeOrSchool}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-indigo-100 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-500 font-medium">Batch {edu.endYear}</span>
                  {edu.score && (
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                      {edu.score}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
