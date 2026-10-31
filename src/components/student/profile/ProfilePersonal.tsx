"use client";

import { Briefcase, User, Edit2, Trash2 } from "lucide-react";
import { CareerProfile, PersonalDetails } from "./types";

interface ProfilePersonalProps {
  careerProfile: CareerProfile;
  onEditCareer: () => void;
  personalDetails: PersonalDetails;
  onEditPersonal: () => void;
  onOpenAddLanguage: () => void;
  onDeleteLanguage: (index: number) => void;
}

export function ProfilePersonal({
  careerProfile,
  onEditCareer,
  personalDetails,
  onEditPersonal,
  onOpenAddLanguage,
  onDeleteLanguage,
}: ProfilePersonalProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Career Profile */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400 border border-violet-200 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Career profile</h3>
              <p className="text-[11px] text-slate-500">Your preferences for hiring roles, job types, and compensation</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onEditCareer}
            className="p-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-violet-600 dark:text-violet-400 transition"
            title="Edit Career Preferences"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-violet-50/40 dark:bg-slate-950 border border-violet-200/60 dark:border-slate-800">
            <div className="text-slate-500 font-medium">Industry</div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">{careerProfile.industry || "Not specified"}</div>
          </div>
          <div className="p-3 rounded-xl bg-violet-50/40 dark:bg-slate-950 border border-violet-200/60 dark:border-slate-800">
            <div className="text-slate-500 font-medium">Department</div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">{careerProfile.department || "Not specified"}</div>
          </div>
          <div className="p-3 rounded-xl bg-violet-50/40 dark:bg-slate-950 border border-violet-200/60 dark:border-slate-800">
            <div className="text-slate-500 font-medium">Desired Job Type</div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">{careerProfile.desiredJobType || "Not specified"}</div>
          </div>
          <div className="p-3 rounded-xl bg-violet-50/40 dark:bg-slate-950 border border-violet-200/60 dark:border-slate-800">
            <div className="text-slate-500 font-medium">Employment Type</div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">{careerProfile.desiredEmploymentType || "Not specified"}</div>
          </div>
          <div className="p-3 rounded-xl bg-violet-50/40 dark:bg-slate-950 border border-violet-200/60 dark:border-slate-800">
            <div className="text-slate-500 font-medium">Preferred Locations</div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">
              {careerProfile.preferredWorkLocation && careerProfile.preferredWorkLocation.length > 0
                ? careerProfile.preferredWorkLocation.join(", ")
                : "Not specified"}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-violet-50/40 dark:bg-slate-950 border border-violet-200/60 dark:border-slate-800">
            <div className="text-slate-500 font-medium">Expected Salary</div>
            <div className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{careerProfile.expectedSalary || "Not specified"}</div>
          </div>
        </div>
      </div>

      {/* Personal Details & Languages */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 border border-indigo-200 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Personal details & Languages</h3>
              <p className="text-[11px] text-slate-500">Demographic details, home address, and language proficiencies</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onEditPersonal}
            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 transition"
            title="Edit Personal Information"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-indigo-50/40 dark:bg-slate-950 border border-indigo-200/60 dark:border-slate-800">
            <div className="text-slate-500 font-medium">Gender & Status</div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">
              {personalDetails.gender || "Not set"}
              {personalDetails.maritalStatus ? `, ${personalDetails.maritalStatus}` : ""}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50/40 dark:bg-slate-950 border border-indigo-200/60 dark:border-slate-800">
            <div className="text-slate-500 font-medium">Date of Birth</div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">{personalDetails.dob || "Not set"}</div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50/40 dark:bg-slate-950 border border-indigo-200/60 dark:border-slate-800">
            <div className="text-slate-500 font-medium">Hometown</div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">{personalDetails.hometown || "Not set"}</div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50/40 dark:bg-slate-950 border border-indigo-200/60 dark:border-slate-800">
            <div className="text-slate-500 font-medium">Work Permit</div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">
              {personalDetails.workPermitCountries && personalDetails.workPermitCountries.length > 0
                ? personalDetails.workPermitCountries.join(", ")
                : "Not set"}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Languages Known</h4>
            <button
              type="button"
              onClick={onOpenAddLanguage}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Add Language
            </button>
          </div>
          {personalDetails.languages && personalDetails.languages.length > 0 ? (
            <div className="overflow-x-auto no-scrollbar rounded-xl border border-indigo-200/60 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-indigo-50/50 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
                  <tr className="border-b border-indigo-200/60 dark:border-slate-800">
                    <th className="px-3 py-2 font-bold">Languages</th>
                    <th className="px-3 py-2 font-bold">Proficiency</th>
                    <th className="px-3 py-2 text-center font-bold">Read</th>
                    <th className="px-3 py-2 text-center font-bold">Write</th>
                    <th className="px-3 py-2 text-center font-bold">Speak</th>
                    <th className="px-3 py-2 text-right font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {personalDetails.languages.map((lang, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 font-bold text-slate-900 dark:text-white">{lang.language}</td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-300 font-medium">{lang.proficiency}</td>
                      <td className="px-3 py-2 text-center text-emerald-600 font-bold">{lang.canRead ? "✓" : "-"}</td>
                      <td className="px-3 py-2 text-center text-emerald-600 font-bold">{lang.canWrite ? "✓" : "-"}</td>
                      <td className="px-3 py-2 text-center text-emerald-600 font-bold">{lang.canSpeak ? "✓" : "-"}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => onDeleteLanguage(i)}
                          className="text-slate-400 hover:text-rose-500 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">No languages added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
