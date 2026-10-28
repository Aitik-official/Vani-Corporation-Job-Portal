"use client";

import { useEffect, useState } from "react";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Upload, 
  FileText, 
  MapPin, 
  Save, 
  Loader2, 
  CheckCircle2,
  ExternalLink,
  Edit2,
  Plus,
  Trash2,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Award,
  BookOpen,
  Code2,
  Globe,
  Layers,
  HeartHandshake,
  Download,
  Building2,
  FileCheck,
  Languages,
  BadgeCheck,
  X,
  Check
} from "lucide-react";
import { toast } from "sonner";

interface EmploymentItem {
  designation: string;
  organization: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

interface EducationItem {
  degree: string;
  course?: string;
  collegeOrSchool: string;
  boardOrUniversity?: string;
  startYear?: number;
  endYear: number;
  gradingSystem?: string;
  score?: string;
}

interface ITSkillItem {
  skill: string;
  version?: string;
  lastUsed?: string;
  experienceYears?: number;
  experienceMonths?: number;
}

interface ProjectItem {
  title: string;
  clientOrOrg?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  isOngoing?: boolean;
  projectUrl?: string;
  description: string;
}

interface Accomplishments {
  onlineProfiles?: { platform: string; url: string }[];
  workSamples?: { title: string; url: string; description?: string }[];
  publications?: { title: string; url?: string; description?: string }[];
  presentations?: { title: string; url?: string; description?: string }[];
  patents?: { title: string; issueNumber?: string; url?: string; description?: string }[];
  certifications?: { title: string; provider: string; url?: string; validFrom?: string; validTo?: string }[];
}

interface CareerProfile {
  industry?: string;
  department?: string;
  roleCategory?: string;
  desiredJobType?: string;
  desiredEmploymentType?: string;
  preferredRole?: string;
  preferredWorkLocation?: string[];
  expectedSalary?: string;
  preferredShift?: string;
}

interface LanguageItem {
  language: string;
  proficiency: "Beginner" | "Proficient" | "Expert";
  canRead: boolean;
  canWrite: boolean;
  canSpeak: boolean;
}

interface PersonalDetails {
  gender?: string;
  maritalStatus?: string;
  dob?: string;
  category?: string;
  address?: string;
  pincode?: string;
  hometown?: string;
  workPermitCountries?: string[];
  languages?: LanguageItem[];
  differentlyAbled?: string;
  careerBreak?: string;
}

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Profile data states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("Available to join in 15 Days");
  const [headline, setHeadline] = useState("");
  const [profileSummary, setProfileSummary] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeName, setResumeName] = useState("Candidate_Resume.pdf");
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
    industry: "IT Services & Consulting",
    department: "Engineering - Software & QA",
    roleCategory: "Software Development",
    desiredJobType: "Permanent",
    desiredEmploymentType: "Full Time",
    preferredRole: "Software Engineer / Full Stack Developer",
    preferredWorkLocation: ["Mumbai", "Navi Mumbai", "Thane", "Pune"],
    expectedSalary: "₹3,00,000",
    preferredShift: "Day",
  });

  // Personal details
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    gender: "Male",
    maritalStatus: "Single / Unmarried",
    dob: "18 Oct 2003",
    category: "General",
    address: "Navi Mumbai, Maharashtra, India",
    pincode: "410206",
    hometown: "Mumbai",
    workPermitCountries: ["India"],
    languages: [
      { language: "English", proficiency: "Expert", canRead: true, canWrite: true, canSpeak: true },
      { language: "Hindi", proficiency: "Expert", canRead: true, canWrite: true, canSpeak: true },
      { language: "Marathi", proficiency: "Proficient", canRead: true, canWrite: true, canSpeak: true },
    ],
    differentlyAbled: "Do not have disability",
    careerBreak: "No",
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
        setLocation(s.location || "Mumbai, INDIA");
        setNoticePeriod(s.noticePeriod || "Available to join in 15 Days");
        setHeadline(s.headline || "B.Tech ECS 2025 | Aspiring IT Professional | JavaScript, React JS, Node JS, SQL");
        setProfileSummary(s.profileSummary || "Eager to launch a career as an entry-level Software Engineer in a technology-driven environment. Result-oriented Bachelor of Engineering graduate with a strong foundation in computer science fundamentals and object-oriented programming.");
        setResumeUrl(s.resumeUrl || "");
        setResumeName(s.resumeName || "Candidate_Resume.pdf");
        setResumeUpdatedAt(s.resumeUpdatedAt ? new Date(s.resumeUpdatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Aug 26, 2026");

        // Skills
        setSkillsList(s.skills && s.skills.length > 0 ? s.skills : ["Web Development", "Fullstack Web Developer", "Python", "HTML/CSS", "Tailwind CSS", "React.js", "Node.js", "TypeScript", "JavaScript", "AWS", "SQL"]);

        // Employment History
        if (s.employmentHistory && s.employmentHistory.length > 0) {
          setEmploymentList(s.employmentHistory);
        } else {
          setEmploymentList([
            {
              designation: "IT Support - Other",
              organization: "Noventiq Services India Pvt Ltd",
              employmentType: "Internship",
              startDate: "Jan 2025",
              endDate: "Apr 2025 (4 months)",
              isCurrent: false,
              description: "Technical Intern working on infrastructure troubleshooting and system maintenance.",
            },
          ]);
        }

        // Education List
        if (s.educationList && s.educationList.length > 0) {
          setEducationList(s.educationList);
        } else {
          setEducationList([
            {
              degree: "B.Tech / B.E. Electronics And Computer Engineering",
              course: "Full Time",
              collegeOrSchool: s.college || "Pillai College of Engineering, Navi Mumbai",
              endYear: 2025,
              score: "8.4 CGPA",
            },
            {
              degree: "Class XII (HSC)",
              course: "Science",
              collegeOrSchool: "Maharashtra State Board",
              endYear: 2021,
              score: "78.5%",
            },
            {
              degree: "Class X (SSC)",
              course: "General",
              collegeOrSchool: "Maharashtra State Board",
              endYear: 2019,
              score: "82.4%",
            },
          ]);
        }

        // IT Skills
        if (s.itSkills && s.itSkills.length > 0) {
          setItSkillsList(s.itSkills);
        } else {
          setItSkillsList([
            { skill: "JavaScript", version: "ES6+", lastUsed: "2026", experienceYears: 1, experienceMonths: 6 },
            { skill: "React.js", version: "v18", lastUsed: "2026", experienceYears: 1, experienceMonths: 2 },
            { skill: "Next.js", version: "v15", lastUsed: "2026", experienceYears: 1, experienceMonths: 0 },
            { skill: "Node.js", version: "v20", lastUsed: "2026", experienceYears: 1, experienceMonths: 4 },
            { skill: "Python", version: "v3.12", lastUsed: "2025", experienceYears: 0, experienceMonths: 8 },
            { skill: "SQL / PostgreSQL", version: "v16", lastUsed: "2026", experienceYears: 1, experienceMonths: 0 },
          ]);
        }

        // Projects
        if (s.projectList && s.projectList.length > 0) {
          setProjectList(s.projectList);
        } else {
          setProjectList([
            {
              title: "Modern Enterprise Job Portal & Applicant Tracking System",
              clientOrOrg: "Capstone Project",
              role: "Fullstack Architect",
              startDate: "Jan 2026",
              endDate: "Present",
              description: "Architected a dual-sided candidate and recruiter placement ecosystem with Next.js 15, MongoDB Mongoose models, role-based JWT auth, real-time interview scheduling, and instant .ics calendar exports.",
            },
            {
              title: "Distributed File Management & Cloud Archival Engine",
              clientOrOrg: "Independent Project",
              role: "Backend Engineer",
              startDate: "Aug 2025",
              endDate: "Dec 2025",
              description: "Engineered secure multipart chunk upload handling, automatic thumbnail and PDF preview generators, and role-based ACL permissions.",
            },
          ]);
        }

        // Accomplishments
        if (s.accomplishments) {
          setAccomplishments(s.accomplishments);
        } else {
          setAccomplishments({
            onlineProfiles: [
              { platform: "LinkedIn", url: "https://linkedin.com/in/student-profile" },
              { platform: "GitHub", url: "https://github.com/developer-candidate" },
            ],
            workSamples: [],
            publications: [],
            presentations: [],
            patents: [],
            certifications: [
              {
                title: "Blockchain Basics & Smart Contracts",
                provider: "Cyfrin Updraft",
                url: "https://updraft.cyfrin.io",
                validFrom: "Jul 2025",
                validTo: "Jul 2027",
              },
              {
                title: "AWS Cloud Foundations",
                provider: "Amazon Web Services",
                url: "https://aws.training",
                validFrom: "Jan 2025",
                validTo: "Jan 2028",
              },
            ],
          });
        }

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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* 1. TOP IDENTITY & HERO CARD */}
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
                  onClick={() => {
                    setEditHeroData({ name, phone, location, noticePeriod });
                    setActiveModal("hero");
                  }}
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
              onClick={handleSaveAll}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? "Saving Changes..." : "Save All Details"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. RESUME SECTION (Vibrant Blue Card) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Resume</h3>
              <p className="text-[11px] text-slate-500">Recruiters review this document when screening your job applications</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">Supported: PDF format up to 5 MB</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-slate-950 border border-blue-200/70 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
              PDF
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                {resumeName || "Candidate_Resume.pdf"}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Uploaded on {resumeUpdatedAt || "Recently"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {resumeUrl && (
              <a
                href={resumeUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            )}

            <label className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs">
              {uploadingResume ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>{uploadingResume ? "Uploading..." : "Upload New Resume"}</span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* 3. RESUME HEADLINE (Amber Card) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-600/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Resume headline</h3>
              <p className="text-[11px] text-slate-500">Concise 1-line professional tagline that appears right beneath your name</p>
            </div>
          </div>
        </div>

        <textarea
          rows={2}
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="e.g. B.Tech ECS 2025 | Completed 4-Month Intern | Aspiring IT Professional | JavaScript, React JS, Node JS, SQL"
          className="w-full px-4 py-3 rounded-2xl bg-amber-50/30 dark:bg-slate-950 border border-amber-200/80 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition leading-relaxed"
        />
      </div>

      {/* 4. KEY SKILLS (Emerald Card) */}
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
                onClick={() => handleRemoveSkill(skill)}
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
                handleAddSkill();
              }
            }}
            placeholder="Add new skill (e.g. Next.js, Docker, MongoDB) and press Enter"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition"
          />
          <button
            type="button"
            onClick={handleAddSkill}
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
            const alreadyHas = skillsList.includes(sugg);
            if (alreadyHas) return null;
            return (
              <button
                key={sugg}
                type="button"
                onClick={() => setSkillsList([...skillsList, sugg])}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 hover:border-emerald-300 dark:border-slate-700 text-[11px] font-semibold transition"
              >
                + {sugg}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. EMPLOYMENT & INTERNSHIPS (Violet Card) */}
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
            onClick={() => {
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
            className="px-3.5 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 dark:bg-violet-950 dark:hover:bg-violet-900 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 text-xs font-bold flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add employment</span>
          </button>
        </div>

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
                    onClick={() => {
                      setEditEmpData({ ...emp });
                      setEditingItemIndex(index);
                      setActiveModal("employment");
                    }}
                    className="text-slate-400 hover:text-indigo-600 transition p-1"
                    title="Edit employment"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmploymentList(employmentList.filter((_, i) => i !== index))}
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
      </div>

      {/* 6. EDUCATION (Indigo Card) */}
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
            onClick={() => {
              setEditEduData({ degree: "", course: "Full Time", collegeOrSchool: "", endYear: 2026, score: "" });
              setEditingItemIndex(null);
              setActiveModal("education");
            }}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add education</span>
          </button>
        </div>

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
                      onClick={() => {
                        setEditEduData({ ...edu });
                        setEditingItemIndex(idx);
                        setActiveModal("education");
                      }}
                      className="text-slate-400 hover:text-indigo-600 transition p-0.5"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEducationList(educationList.filter((_, i) => i !== idx))}
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
      </div>

      {/* 7. IT SKILLS MATRIX (Cyan/Teal Card) */}
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
            onClick={() => {
              setEditItSkillData({ skill: "", version: "", lastUsed: "2026", experienceYears: 1, experienceMonths: 0 });
              setEditingItemIndex(null);
              setActiveModal("itSkill");
            }}
            className="px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add skill row</span>
          </button>
        </div>

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
                        onClick={() => {
                          setEditItSkillData({ ...item });
                          setEditingItemIndex(idx);
                          setActiveModal("itSkill");
                        }}
                        className="text-slate-400 hover:text-teal-600 transition p-1"
                      >
                        <Edit2 className="w-3.5 h-3.5 inline" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setItSkillsList(itSkillsList.filter((_, i) => i !== idx))}
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
      </div>

      {/* 8. PROJECTS (Blue/Sky Card) */}
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
            onClick={() => {
              setEditProjectData({ title: "", clientOrOrg: "", role: "", startDate: "", endDate: "", description: "" });
              setEditingItemIndex(null);
              setActiveModal("project");
            }}
            className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-bold flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add project</span>
          </button>
        </div>

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
                      onClick={() => {
                        setEditProjectData({ ...proj });
                        setEditingItemIndex(idx);
                        setActiveModal("project");
                      }}
                      className="text-slate-400 hover:text-sky-600 transition p-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setProjectList(projectList.filter((_, i) => i !== idx))}
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
      </div>

      {/* 9. PROFILE SUMMARY (Rose Card) */}
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

      {/* 10. ACCOMPLISHMENTS & CERTIFICATIONS (Amber / Gold Card) */}
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
                  onClick={() => {
                    setEditOnlineProfile({ platform: "LinkedIn", url: "" });
                    setActiveModal("onlineProfile");
                  }}
                  className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
                >
                  + Add Link
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">LinkedIn, GitHub, Behance and portfolios</p>
              <div className="space-y-2 mt-3">
                {accomplishments.onlineProfiles?.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 p-2 rounded-xl border border-amber-200/60 dark:border-slate-800">
                    <a href={p.url} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono flex items-center gap-1 truncate mr-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{p.platform}: {p.url}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setAccomplishments({
                          ...accomplishments,
                          onlineProfiles: accomplishments.onlineProfiles?.filter((_, index) => index !== i),
                        });
                      }}
                      className="text-slate-400 hover:text-rose-500 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-slate-950 border border-amber-200/70 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Verified Certifications</h4>
                <button
                  type="button"
                  onClick={() => {
                    setEditCertData({ title: "", provider: "", url: "", validFrom: "", validTo: "" });
                    setActiveModal("certification");
                  }}
                  className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
                >
                  + Add Cert
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Formal examinations and accredited technical certifications</p>
              <div className="space-y-2 mt-3">
                {accomplishments.certifications?.map((c, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{c.title}</div>
                      <div className="text-[11px] text-slate-500">{c.provider} • Validity: {c.validFrom} to {c.validTo}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAccomplishments({
                          ...accomplishments,
                          certifications: accomplishments.certifications?.filter((_, index) => index !== i),
                        });
                      }}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {/* 11. CAREER PROFILE & PERSONAL DETAILS (Split 50/50 Card) */}
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
              onClick={() => {
                setEditCareerData({ ...careerProfile });
                setActiveModal("career");
              }}
              className="p-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-violet-600 dark:text-violet-400 transition"
              title="Edit Career Preferences"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-violet-50/40 dark:bg-slate-950 border border-violet-200/60 dark:border-slate-800">
              <div className="text-slate-500 font-medium">Industry</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{careerProfile.industry || "IT Services"}</div>
            </div>
            <div className="p-3 rounded-xl bg-violet-50/40 dark:bg-slate-950 border border-violet-200/60 dark:border-slate-800">
              <div className="text-slate-500 font-medium">Department</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{careerProfile.department || "Engineering"}</div>
            </div>
            <div className="p-3 rounded-xl bg-violet-50/40 dark:bg-slate-950 border border-violet-200/60 dark:border-slate-800">
              <div className="text-slate-500 font-medium">Desired Job Type</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{careerProfile.desiredJobType || "Permanent"}</div>
            </div>
            <div className="p-3 rounded-xl bg-violet-50/40 dark:bg-slate-950 border border-violet-200/60 dark:border-slate-800">
              <div className="text-slate-500 font-medium">Employment Type</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{careerProfile.desiredEmploymentType || "Full Time"}</div>
            </div>
            <div className="p-3 rounded-xl bg-violet-50/40 dark:bg-slate-950 border border-violet-200/60 dark:border-slate-800">
              <div className="text-slate-500 font-medium">Preferred Locations</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{careerProfile.preferredWorkLocation?.join(", ") || "Mumbai, Navi Mumbai"}</div>
            </div>
            <div className="p-3 rounded-xl bg-violet-50/40 dark:bg-slate-950 border border-violet-200/60 dark:border-slate-800">
              <div className="text-slate-500 font-medium">Expected Salary</div>
              <div className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{careerProfile.expectedSalary || "₹3,00,000"}</div>
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
              onClick={() => {
                setEditPersonalData({ ...personalDetails });
                setActiveModal("personal");
              }}
              className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 transition"
              title="Edit Personal Information"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-indigo-50/40 dark:bg-slate-950 border border-indigo-200/60 dark:border-slate-800">
              <div className="text-slate-500 font-medium">Gender & Status</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{personalDetails.gender}, {personalDetails.maritalStatus}</div>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50/40 dark:bg-slate-950 border border-indigo-200/60 dark:border-slate-800">
              <div className="text-slate-500 font-medium">Date of Birth</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{personalDetails.dob || "18 Oct 2003"}</div>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50/40 dark:bg-slate-950 border border-indigo-200/60 dark:border-slate-800">
              <div className="text-slate-500 font-medium">Hometown</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{personalDetails.hometown || "Mumbai"}</div>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50/40 dark:bg-slate-950 border border-indigo-200/60 dark:border-slate-800">
              <div className="text-slate-500 font-medium">Work Permit</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{personalDetails.workPermitCountries?.join(", ") || "India"}</div>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Languages Known</h4>
              <button
                type="button"
                onClick={() => {
                  setNewLangData({ language: "", proficiency: "Proficient", canRead: true, canWrite: true, canSpeak: true });
                  setActiveModal("language");
                }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                + Add Language
              </button>
            </div>
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
                  {personalDetails.languages?.map((lang, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 font-bold text-slate-900 dark:text-white">{lang.language}</td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-300 font-medium">{lang.proficiency}</td>
                      <td className="px-3 py-2 text-center text-emerald-600 font-bold">{lang.canRead ? "✓" : "-"}</td>
                      <td className="px-3 py-2 text-center text-emerald-600 font-bold">{lang.canWrite ? "✓" : "-"}</td>
                      <td className="px-3 py-2 text-center text-emerald-600 font-bold">{lang.canSpeak ? "✓" : "-"}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setPersonalDetails({
                              ...personalDetails,
                              languages: personalDetails.languages?.filter((_, index) => index !== i),
                            });
                          }}
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
          </div>
        </div>
      </div>

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
