"use client";

import { useEffect, useState } from "react";
import { 
  Save, 
  Loader2, 
  Sparkles,
  X,
  Check
} from "lucide-react";
import { toast } from "sonner";
import {
  EmploymentItem,
  EducationItem,
  ITSkillItem,
  ProjectItem,
  Accomplishments,
  CareerProfile,
  LanguageItem,
  PersonalDetails,
} from "@/components/student/profile/types";
import { ProfileHero } from "@/components/student/profile/ProfileHero";
import { ProfileResume } from "@/components/student/profile/ProfileResume";
import { ProfileSkills } from "@/components/student/profile/ProfileSkills";
import { ProfileExperience } from "@/components/student/profile/ProfileExperience";
import { ProfileProjects } from "@/components/student/profile/ProfileProjects";
import { ProfilePersonal } from "@/components/student/profile/ProfilePersonal";
import { ProfileSkeleton } from "@/components/shared/skeletons/CardSkeletons";

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Profile data states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("Available to join immediately");
  const [headline, setHeadline] = useState("");
  const [profileSummary, setProfileSummary] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [resumeUpdatedAt, setResumeUpdatedAt] = useState<string>("");

  // Key skills
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");

  // Employment
  const [employmentList, setEmploymentList] = useState<EmploymentItem[]>([]);

  // Education
  const [educationList, setEducationList] = useState<EducationItem[]>([]);

  // IT Skills
  const [itSkillsList, setItSkillsList] = useState<ITSkillItem[]>([]);

  // Projects
  const [projectList, setProjectList] = useState<ProjectItem[]>([]);

  // Accomplishments
  const [accomplishments, setAccomplishments] = useState<Accomplishments>({
    onlineProfiles: [],
    workSamples: [],
    publications: [],
    presentations: [],
    patents: [],
    certifications: [],
  });

  // Career profile
  const [careerProfile, setCareerProfile] = useState<CareerProfile>({
    industry: "",
    department: "",
    roleCategory: "",
    desiredJobType: "",
    desiredEmploymentType: "",
    preferredRole: "",
    preferredWorkLocation: [],
    expectedSalary: "",
    preferredShift: "",
  });

  // Personal details
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    gender: "",
    maritalStatus: "",
    dob: "",
    category: "",
    address: "",
    pincode: "",
    hometown: "",
    workPermitCountries: [],
    languages: [],
    differentlyAbled: "",
    careerBreak: "",
  });

  // Modals for editing sections cleanly
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  // Form states for modals
  const [editHeroData, setEditHeroData] = useState({ name: "", phone: "", location: "", noticePeriod: "" });
  const [editEmpData, setEditEmpData] = useState<EmploymentItem>({ designation: "", organization: "", employmentType: "Full-time", startDate: "", endDate: "", description: "" });
  const [editEduData, setEditEduData] = useState<EducationItem>({ degree: "", course: "Full Time", collegeOrSchool: "", endYear: 2026, score: "" });
  const [editItSkillData, setEditItSkillData] = useState<ITSkillItem>({ skill: "", version: "", lastUsed: "2026", experienceYears: 1, experienceMonths: 0 });
  const [editProjectData, setEditProjectData] = useState<ProjectItem>({ title: "", clientOrOrg: "", role: "", startDate: "", endDate: "", description: "" });
  const [editOnlineProfile, setEditOnlineProfile] = useState({ platform: "LinkedIn", url: "" });
  const [editCertData, setEditCertData] = useState({ title: "", provider: "", url: "", validFrom: "", validTo: "" });
  const [editCareerData, setEditCareerData] = useState<CareerProfile>({});
  const [editPersonalData, setEditPersonalData] = useState<PersonalDetails>({});
  const [newLangData, setNewLangData] = useState<LanguageItem>({ language: "", proficiency: "Proficient", canRead: true, canWrite: true, canSpeak: true });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/students/profile");
      const data = await res.json();
      if (res.ok && data.student) {
        const s = data.student;
        setName(s.userId?.name || "");
        setEmail(s.userId?.email || "");
        setPhone(s.phone || "");
        setLocation(s.location || "");
        setNoticePeriod(s.noticePeriod || "Available to join immediately");
        setHeadline(s.headline || "");
        setProfileSummary(s.profileSummary || "");
        setResumeUrl(s.resumeUrl || "");
        setResumeName(s.resumeName || "");
        setResumeUpdatedAt(s.resumeUpdatedAt ? new Date(s.resumeUpdatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "");

        // Skills
        setSkillsList(Array.isArray(s.skills) ? s.skills : []);

        // Employment History
        setEmploymentList(Array.isArray(s.employmentHistory) ? s.employmentHistory : []);

        // Education List - populate from educationList or fallback to basic registration degree/college
        if (s.educationList && s.educationList.length > 0) {
          setEducationList(s.educationList);
        } else if (s.college || s.degree) {
          setEducationList([
            {
              degree: s.degree || "Degree",
              course: "Full Time",
              collegeOrSchool: s.college || "",
              endYear: s.graduationYear || 2026,
              score: s.cgpa ? `${s.cgpa} CGPA` : "",
            },
          ]);
        } else {
          setEducationList([]);
        }

        // IT Skills
        setItSkillsList(Array.isArray(s.itSkills) ? s.itSkills : []);

        // Projects
        setProjectList(Array.isArray(s.projectList) ? s.projectList : []);

        // Accomplishments
        if (s.accomplishments) {
          setAccomplishments({
            onlineProfiles: Array.isArray(s.accomplishments.onlineProfiles) ? s.accomplishments.onlineProfiles : [],
            workSamples: Array.isArray(s.accomplishments.workSamples) ? s.accomplishments.workSamples : [],
            publications: Array.isArray(s.accomplishments.publications) ? s.accomplishments.publications : [],
            presentations: Array.isArray(s.accomplishments.presentations) ? s.accomplishments.presentations : [],
            patents: Array.isArray(s.accomplishments.patents) ? s.accomplishments.patents : [],
            certifications: Array.isArray(s.accomplishments.certifications) ? s.accomplishments.certifications : [],
          });
        } else {
          setAccomplishments({
            onlineProfiles: [],
            workSamples: [],
            publications: [],
            presentations: [],
            patents: [],
            certifications: [],
          });
        }

        // Career Profile & Personal Details
        // Career Profile & Personal Details
        if (s.careerProfile) setCareerProfile(s.careerProfile);
        if (s.personalDetails) setPersonalDetails(s.personalDetails);
      }
    } catch {
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed for resumes");
      return;
    }

    setUploadingResume(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setResumeUrl(data.url);
      setResumeName(file.name);
      const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      setResumeUpdatedAt(dateStr);
      toast.success("Resume uploaded successfully! Click 'Save All Details' to persist.");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const payload = {
        name,
        phone,
        location,
        noticePeriod,
        headline,
        profileSummary,
        resumeUrl,
        resumeName,
        skills: skillsList,
        employmentHistory: employmentList,
        educationList,
        itSkills: itSkillsList,
        projectList,
        accomplishments,
        careerProfile,
        personalDetails,
        college: educationList[0]?.collegeOrSchool || "",
        degree: educationList[0]?.degree || "",
        specialization: "",
        graduationYear: educationList[0]?.endYear || 2026,
      };

      const res = await fetch("/api/students/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.success("Complete Candidate Profile saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (skillsList.includes(newSkillInput.trim())) {
      toast.error("Skill already in your list");
      return;
    }
    setSkillsList([...skillsList, newSkillInput.trim()]);
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const calculateCompleteness = () => {
    let score = 20;
    if (resumeUrl) score += 15;
    if (headline) score += 10;
    if (skillsList.length >= 3) score += 15;
    if (employmentList.length > 0) score += 10;
    if (educationList.length > 0) score += 10;
    if (projectList.length > 0) score += 10;
    if (profileSummary) score += 10;
    return Math.min(100, score);
  };

  const completeness = calculateCompleteness();

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* 1. HERO IDENTITY CARD */}
      <ProfileHero
        name={name}
        phone={phone}
        email={email}
        location={location}
        noticePeriod={noticePeriod}
        resumeUpdatedAt={resumeUpdatedAt}
        completeness={completeness}
        saving={saving}
        onEditHero={() => {
          setEditHeroData({ name, phone, location, noticePeriod });
          setActiveModal("hero");
        }}
        onSaveAll={handleSaveAll}
      />

      {/* 2 & 3. RESUME & HEADLINE */}
      <ProfileResume
        resumeUrl={resumeUrl}
        resumeName={resumeName}
        resumeUpdatedAt={resumeUpdatedAt}
        uploadingResume={uploadingResume}
        headline={headline}
        setHeadline={setHeadline}
        onUploadResume={handleResumeUpload}
      />

      {/* 4 & 7. KEY SKILLS & IT SKILLS MATRIX */}
      <ProfileSkills
        skillsList={skillsList}
        newSkillInput={newSkillInput}
        setNewSkillInput={setNewSkillInput}
        onAddSkill={handleAddSkill}
        onRemoveSkill={handleRemoveSkill}
        onQuickAddSkill={(skill) => setSkillsList([...skillsList, skill])}
        itSkillsList={itSkillsList}
        onOpenAddItSkill={() => {
          setEditItSkillData({ skill: "", version: "", lastUsed: "2026", experienceYears: 1, experienceMonths: 0 });
          setEditingItemIndex(null);
          setActiveModal("itSkill");
        }}
        onEditItSkill={(idx) => {
          setEditItSkillData({ ...itSkillsList[idx] });
          setEditingItemIndex(idx);
          setActiveModal("itSkill");
        }}
        onDeleteItSkill={(idx) => {
          setItSkillsList(itSkillsList.filter((_, i) => i !== idx));
        }}
      />

      {/* 5 & 6. EMPLOYMENT HISTORY & EDUCATION TIMELINE */}
      <ProfileExperience
        employmentList={employmentList}
        onOpenAddEmployment={() => {
          setEditEmpData({
            designation: "",
            organization: "",
            employmentType: "Internship",
            startDate: "",
            endDate: "",
            description: "",
          });
          setEditingItemIndex(null);
          setActiveModal("employment");
        }}
        onEditEmployment={(idx) => {
          setEditEmpData({ ...employmentList[idx] });
          setEditingItemIndex(idx);
          setActiveModal("employment");
        }}
        onDeleteEmployment={(idx) => {
          setEmploymentList(employmentList.filter((_, i) => i !== idx));
        }}
        educationList={educationList}
        onOpenAddEducation={() => {
          setEditEduData({ degree: "", course: "Full Time", collegeOrSchool: "", endYear: 2026, score: "" });
          setEditingItemIndex(null);
          setActiveModal("education");
        }}
        onEditEducation={(idx) => {
          setEditEduData({ ...educationList[idx] });
          setEditingItemIndex(idx);
          setActiveModal("education");
        }}
        onDeleteEducation={(idx) => {
          setEducationList(educationList.filter((_, i) => i !== idx));
        }}
      />

      {/* 8, 9 & 10. PROJECTS, SUMMARY & ACCOMPLISHMENTS */}
      <ProfileProjects
        projectList={projectList}
        onOpenAddProject={() => {
          setEditProjectData({ title: "", clientOrOrg: "", role: "", startDate: "", endDate: "", description: "" });
          setEditingItemIndex(null);
          setActiveModal("project");
        }}
        onEditProject={(idx) => {
          setEditProjectData({ ...projectList[idx] });
          setEditingItemIndex(idx);
          setActiveModal("project");
        }}
        onDeleteProject={(idx) => {
          setProjectList(projectList.filter((_, i) => i !== idx));
        }}
        profileSummary={profileSummary}
        setProfileSummary={setProfileSummary}
        accomplishments={accomplishments}
        onOpenAddOnlineProfile={() => {
          setEditOnlineProfile({ platform: "LinkedIn", url: "" });
          setActiveModal("onlineProfile");
        }}
        onDeleteOnlineProfile={(idx) => {
          setAccomplishments({
            ...accomplishments,
            onlineProfiles: accomplishments.onlineProfiles?.filter((_, index) => index !== idx),
          });
        }}
        onOpenAddCert={() => {
          setEditCertData({ title: "", provider: "", url: "", validFrom: "", validTo: "" });
          setActiveModal("certification");
        }}
        onDeleteCert={(idx) => {
          setAccomplishments({
            ...accomplishments,
            certifications: accomplishments.certifications?.filter((_, index) => index !== idx),
          });
        }}
      />

      {/* FLOATING ACTION BAR: Always reachable Save & Completeness Pill */}
      <div className="fixed bottom-6 right-6 lg:left-72 lg:right-12 z-20 flex items-center justify-between p-3.5 sm:px-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl transition-all">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center font-extrabold text-xs shrink-0">
            {completeness}%
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-slate-900 dark:text-white">Profile Readiness Score</div>
            <div className="text-[11px] text-slate-500">Keep profile updated to match recruiter algorithms</div>
          </div>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-violet-600/20 transition disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving Changes..." : "Save All Details"}</span>
        </button>
      </div>

      {/* 11. CAREER PROFILE & PERSONAL DETAILS */}
      <ProfilePersonal
        careerProfile={careerProfile}
        onEditCareer={() => {
          setEditCareerData({ ...careerProfile });
          setActiveModal("career");
        }}
        personalDetails={personalDetails}
        onEditPersonal={() => {
          setEditPersonalData({ ...personalDetails });
          setActiveModal("personal");
        }}
        onOpenAddLanguage={() => {
          setNewLangData({ language: "", proficiency: "Proficient", canRead: true, canWrite: true, canSpeak: true });
          setActiveModal("language");
        }}
        onDeleteLanguage={(idx) => {
          setPersonalDetails({
            ...personalDetails,
            languages: personalDetails.languages?.filter((_, index) => index !== idx),
          });
        }}
      />

      {/* ========================================================
          MODALS / EDIT DRAWERS FOR SECTIONS
          ======================================================== */}

      {/* 1. Modal: Edit Hero & Identity */}
      {activeModal === "hero" && (
        <div className="fixed top-0 bottom-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-center p-4 bg-slate-950/25 dark:bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Edit Identity & Contact</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={editHeroData.name}
                  onChange={(e) => setEditHeroData({ ...editHeroData, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                <input
                  type="text"
                  value={editHeroData.phone}
                  onChange={(e) => setEditHeroData({ ...editHeroData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Location (City, Country)</label>
                <input
                  type="text"
                  value={editHeroData.location}
                  onChange={(e) => setEditHeroData({ ...editHeroData, location: e.target.value })}
                  placeholder="Mumbai, INDIA"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Notice Period / Availability</label>
                <select
                  value={editHeroData.noticePeriod}
                  onChange={(e) => setEditHeroData({ ...editHeroData, noticePeriod: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                >
                  <option value="Available to join immediately">Available to join immediately</option>
                  <option value="Available to join in 15 Days">Available to join in 15 Days</option>
                  <option value="1 Month Notice">1 Month Notice</option>
                  <option value="2 Months Notice">2 Months Notice</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setName(editHeroData.name);
                  setPhone(editHeroData.phone);
                  setLocation(editHeroData.location);
                  setNoticePeriod(editHeroData.noticePeriod);
                  setActiveModal(null);
                  toast.success("Identity updated! Remember to click 'Save All Details'.");
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Employment Edit/Add */}
      {activeModal === "employment" && (
        <div className="fixed top-0 bottom-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-center p-4 bg-slate-950/25 dark:bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editingItemIndex !== null ? "Edit Employment" : "Add Employment"}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Designation / Role *</label>
                  <input
                    type="text"
                    value={editEmpData.designation}
                    onChange={(e) => setEditEmpData({ ...editEmpData, designation: e.target.value })}
                    placeholder="e.g. Software Intern"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Organization / Company *</label>
                  <input
                    type="text"
                    value={editEmpData.organization}
                    onChange={(e) => setEditEmpData({ ...editEmpData, organization: e.target.value })}
                    placeholder="e.g. TechCorp Solutions"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Type</label>
                  <select
                    value={editEmpData.employmentType}
                    onChange={(e) => setEditEmpData({ ...editEmpData, employmentType: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Start Date</label>
                  <input
                    type="text"
                    value={editEmpData.startDate}
                    onChange={(e) => setEditEmpData({ ...editEmpData, startDate: e.target.value })}
                    placeholder="e.g. Jan 2025"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">End Date</label>
                  <input
                    type="text"
                    value={editEmpData.endDate}
                    onChange={(e) => setEditEmpData({ ...editEmpData, endDate: e.target.value })}
                    placeholder="e.g. Apr 2025"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Description of Responsibilities</label>
                <textarea
                  rows={3}
                  value={editEmpData.description}
                  onChange={(e) => setEditEmpData({ ...editEmpData, description: e.target.value })}
                  placeholder="Key deliverables and technologies utilized..."
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!editEmpData.designation || !editEmpData.organization) {
                    toast.error("Role and Organization are required");
                    return;
                  }
                  if (editingItemIndex !== null) {
                    const updated = [...employmentList];
                    updated[editingItemIndex] = editEmpData;
                    setEmploymentList(updated);
                  } else {
                    setEmploymentList([...employmentList, editEmpData]);
                  }
                  setActiveModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Education Edit/Add */}
      {activeModal === "education" && (
        <div className="fixed top-0 bottom-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-center p-4 bg-slate-950/25 dark:bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editingItemIndex !== null ? "Edit Academic Qualification" : "Add Academic Qualification"}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Degree / Qualification *</label>
                <input
                  type="text"
                  value={editEduData.degree}
                  onChange={(e) => setEditEduData({ ...editEduData, degree: e.target.value })}
                  placeholder="e.g. B.Tech / B.E. Computer Engineering"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">School / College / Institute *</label>
                <input
                  type="text"
                  value={editEduData.collegeOrSchool}
                  onChange={(e) => setEditEduData({ ...editEduData, collegeOrSchool: e.target.value })}
                  placeholder="e.g. Pillai College of Engineering, Navi Mumbai"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Passing / Batch Year</label>
                  <input
                    type="number"
                    value={editEduData.endYear}
                    onChange={(e) => setEditEduData({ ...editEduData, endYear: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Grade / Score</label>
                  <input
                    type="text"
                    value={editEduData.score || ""}
                    onChange={(e) => setEditEduData({ ...editEduData, score: e.target.value })}
                    placeholder="e.g. 8.4 CGPA or 82%"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!editEduData.degree || !editEduData.collegeOrSchool) {
                    toast.error("Degree and College/School are required");
                    return;
                  }
                  if (editingItemIndex !== null) {
                    const updated = [...educationList];
                    updated[editingItemIndex] = editEduData;
                    setEducationList(updated);
                  } else {
                    setEducationList([...educationList, editEduData]);
                  }
                  setActiveModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal: IT Skill Row Edit/Add */}
      {activeModal === "itSkill" && (
        <div className="fixed top-0 bottom-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-center p-4 bg-slate-950/25 dark:bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editingItemIndex !== null ? "Edit IT Skill" : "Add IT Skill"}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Skill / Tech Name *</label>
                <input
                  type="text"
                  value={editItSkillData.skill}
                  onChange={(e) => setEditItSkillData({ ...editItSkillData, skill: e.target.value })}
                  placeholder="e.g. Next.js / TypeScript"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Version</label>
                  <input
                    type="text"
                    value={editItSkillData.version || ""}
                    onChange={(e) => setEditItSkillData({ ...editItSkillData, version: e.target.value })}
                    placeholder="e.g. v15.1"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Last Used Year</label>
                  <input
                    type="text"
                    value={editItSkillData.lastUsed || ""}
                    onChange={(e) => setEditItSkillData({ ...editItSkillData, lastUsed: e.target.value })}
                    placeholder="e.g. 2026"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    value={editItSkillData.experienceYears || 0}
                    onChange={(e) => setEditItSkillData({ ...editItSkillData, experienceYears: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Experience (Months)</label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={editItSkillData.experienceMonths || 0}
                    onChange={(e) => setEditItSkillData({ ...editItSkillData, experienceMonths: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!editItSkillData.skill.trim()) {
                    toast.error("Skill name is required");
                    return;
                  }
                  if (editingItemIndex !== null) {
                    const updated = [...itSkillsList];
                    updated[editingItemIndex] = editItSkillData;
                    setItSkillsList(updated);
                  } else {
                    setItSkillsList([...itSkillsList, editItSkillData]);
                  }
                  setActiveModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal: Project Edit/Add */}
      {activeModal === "project" && (
        <div className="fixed top-0 bottom-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-center p-4 bg-slate-950/25 dark:bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editingItemIndex !== null ? "Edit Project" : "Add Project"}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Project Title *</label>
                <input
                  type="text"
                  value={editProjectData.title}
                  onChange={(e) => setEditProjectData({ ...editProjectData, title: e.target.value })}
                  placeholder="e.g. Next.js Enterprise Portal"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Client / Institution</label>
                  <input
                    type="text"
                    value={editProjectData.clientOrOrg || ""}
                    onChange={(e) => setEditProjectData({ ...editProjectData, clientOrOrg: e.target.value })}
                    placeholder="e.g. Capstone / Showcase"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Your Role</label>
                  <input
                    type="text"
                    value={editProjectData.role || ""}
                    onChange={(e) => setEditProjectData({ ...editProjectData, role: e.target.value })}
                    placeholder="e.g. Lead Frontend Engineer"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Start Date</label>
                  <input
                    type="text"
                    value={editProjectData.startDate || ""}
                    onChange={(e) => setEditProjectData({ ...editProjectData, startDate: e.target.value })}
                    placeholder="e.g. Jan 2026"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">End Date</label>
                  <input
                    type="text"
                    value={editProjectData.endDate || ""}
                    onChange={(e) => setEditProjectData({ ...editProjectData, endDate: e.target.value })}
                    placeholder="e.g. Present"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Project Description *</label>
                <textarea
                  rows={3}
                  value={editProjectData.description}
                  onChange={(e) => setEditProjectData({ ...editProjectData, description: e.target.value })}
                  placeholder="Architecture, frameworks used, features implemented..."
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!editProjectData.title || !editProjectData.description) {
                    toast.error("Project title and description are required");
                    return;
                  }
                  if (editingItemIndex !== null) {
                    const updated = [...projectList];
                    updated[editingItemIndex] = editProjectData;
                    setProjectList(updated);
                  } else {
                    setProjectList([...projectList, editProjectData]);
                  }
                  setActiveModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal: Add Online Profile */}
      {activeModal === "onlineProfile" && (
        <div className="fixed top-0 bottom-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-center p-4 bg-slate-950/25 dark:bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Add Online Profile</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Platform Name</label>
                <input
                  type="text"
                  value={editOnlineProfile.platform}
                  onChange={(e) => setEditOnlineProfile({ ...editOnlineProfile, platform: e.target.value })}
                  placeholder="e.g. LinkedIn, GitHub, LeetCode"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Profile URL</label>
                <input
                  type="url"
                  value={editOnlineProfile.url}
                  onChange={(e) => setEditOnlineProfile({ ...editOnlineProfile, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!editOnlineProfile.url) {
                    toast.error("URL is required");
                    return;
                  }
                  setAccomplishments({
                    ...accomplishments,
                    onlineProfiles: [...(accomplishments.onlineProfiles || []), editOnlineProfile],
                  });
                  setActiveModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal: Add Certification */}
      {activeModal === "certification" && (
        <div className="fixed top-0 bottom-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-center p-4 bg-slate-950/25 dark:bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Add Certification</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Certification Name *</label>
                <input
                  type="text"
                  value={editCertData.title}
                  onChange={(e) => setEditCertData({ ...editCertData, title: e.target.value })}
                  placeholder="e.g. AWS Certified Developer"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Issuing Body / Provider *</label>
                <input
                  type="text"
                  value={editCertData.provider}
                  onChange={(e) => setEditCertData({ ...editCertData, provider: e.target.value })}
                  placeholder="e.g. Amazon Web Services"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Valid From</label>
                  <input
                    type="text"
                    value={editCertData.validFrom}
                    onChange={(e) => setEditCertData({ ...editCertData, validFrom: e.target.value })}
                    placeholder="e.g. Jul 2025"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Valid Till</label>
                  <input
                    type="text"
                    value={editCertData.validTo}
                    onChange={(e) => setEditCertData({ ...editCertData, validTo: e.target.value })}
                    placeholder="e.g. Jul 2028"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!editCertData.title || !editCertData.provider) {
                    toast.error("Certificate name and provider are required");
                    return;
                  }
                  setAccomplishments({
                    ...accomplishments,
                    certifications: [...(accomplishments.certifications || []), editCertData],
                  });
                  setActiveModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
              >
                Add Cert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Modal: Edit Career Profile */}
      {activeModal === "career" && (
        <div className="fixed top-0 bottom-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-center p-4 bg-slate-950/25 dark:bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Edit Career Preferences</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Industry</label>
                  <input
                    type="text"
                    value={editCareerData.industry || ""}
                    onChange={(e) => setEditCareerData({ ...editCareerData, industry: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Department</label>
                  <input
                    type="text"
                    value={editCareerData.department || ""}
                    onChange={(e) => setEditCareerData({ ...editCareerData, department: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Desired Job Type</label>
                  <select
                    value={editCareerData.desiredJobType || "Permanent"}
                    onChange={(e) => setEditCareerData({ ...editCareerData, desiredJobType: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Contractual">Contractual</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Employment Type</label>
                  <select
                    value={editCareerData.desiredEmploymentType || "Full Time"}
                    onChange={(e) => setEditCareerData({ ...editCareerData, desiredEmploymentType: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Expected Salary (Annual)</label>
                <input
                  type="text"
                  value={editCareerData.expectedSalary || ""}
                  onChange={(e) => setEditCareerData({ ...editCareerData, expectedSalary: e.target.value })}
                  placeholder="e.g. ₹3,50,000"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Preferred Work Locations (Comma separated)</label>
                <input
                  type="text"
                  value={editCareerData.preferredWorkLocation?.join(", ") || ""}
                  onChange={(e) =>
                    setEditCareerData({
                      ...editCareerData,
                      preferredWorkLocation: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Mumbai, Pune, Bengaluru"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={() => {
                  setCareerProfile({ ...careerProfile, ...editCareerData });
                  setActiveModal(null);
                  toast.success("Career preferences updated!");
                }}
                className="px-5 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Modal: Edit Personal Details */}
      {activeModal === "personal" && (
        <div className="fixed top-0 bottom-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-center p-4 bg-slate-950/25 dark:bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Edit Personal Details</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Gender</label>
                  <select
                    value={editPersonalData.gender || "Male"}
                    onChange={(e) => setEditPersonalData({ ...editPersonalData, gender: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Marital Status</label>
                  <select
                    value={editPersonalData.maritalStatus || "Single / Unmarried"}
                    onChange={(e) => setEditPersonalData({ ...editPersonalData, maritalStatus: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  >
                    <option value="Single / Unmarried">Single / Unmarried</option>
                    <option value="Married">Married</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Date of Birth</label>
                  <input
                    type="text"
                    value={editPersonalData.dob || ""}
                    onChange={(e) => setEditPersonalData({ ...editPersonalData, dob: e.target.value })}
                    placeholder="18 Oct 2003"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Hometown</label>
                  <input
                    type="text"
                    value={editPersonalData.hometown || ""}
                    onChange={(e) => setEditPersonalData({ ...editPersonalData, hometown: e.target.value })}
                    placeholder="Mumbai"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={() => {
                  setPersonalDetails({ ...personalDetails, ...editPersonalData });
                  setActiveModal(null);
                  toast.success("Personal details updated!");
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Modal: Add Language */}
      {activeModal === "language" && (
        <div className="fixed top-0 bottom-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-center p-4 bg-slate-950/25 dark:bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Add Language</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Language *</label>
                <input
                  type="text"
                  value={newLangData.language}
                  onChange={(e) => setNewLangData({ ...newLangData, language: e.target.value })}
                  placeholder="e.g. German, French, Spanish"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Proficiency</label>
                <select
                  value={newLangData.proficiency}
                  onChange={(e) => setNewLangData({ ...newLangData, proficiency: e.target.value as any })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Proficient">Proficient</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLangData.canRead}
                    onChange={(e) => setNewLangData({ ...newLangData, canRead: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Read</span>
                </label>
                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLangData.canWrite}
                    onChange={(e) => setNewLangData({ ...newLangData, canWrite: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Write</span>
                </label>
                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLangData.canSpeak}
                    onChange={(e) => setNewLangData({ ...newLangData, canSpeak: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Speak</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newLangData.language.trim()) {
                    toast.error("Language name is required");
                    return;
                  }
                  setPersonalDetails({
                    ...personalDetails,
                    languages: [...(personalDetails.languages || []), newLangData],
                  });
                  setActiveModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Add Language
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
