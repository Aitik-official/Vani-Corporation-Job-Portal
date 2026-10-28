import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmployment {
  designation: string;
  organization: string;
  employmentType?: string; // Full-time, Internship, Contract
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface IEducationItem {
  degree: string; // e.g. B.Tech / B.E., Class XII, Class X, Masters
  course?: string;
  collegeOrSchool: string;
  boardOrUniversity?: string;
  startYear?: number;
  endYear: number;
  gradingSystem?: string; // CGPA, Percentage
  score?: string; // e.g. 8.9 / 10 or 88%
}

export interface IITSkill {
  skill: string;
  version?: string;
  lastUsed?: string; // e.g. 2026
  experienceYears?: number;
  experienceMonths?: number;
}

export interface IProjectItem {
  title: string;
  clientOrOrg?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  isOngoing?: boolean;
  projectUrl?: string;
  description: string;
}

export interface IAccomplishments {
  onlineProfiles?: { platform: string; url: string }[];
  workSamples?: { title: string; url: string; description?: string }[];
  publications?: { title: string; url?: string; description?: string }[];
  presentations?: { title: string; url?: string; description?: string }[];
  patents?: { title: string; issueNumber?: string; url?: string; description?: string }[];
  certifications?: { title: string; provider: string; url?: string; validFrom?: string; validTo?: string }[];
}

export interface ICareerProfile {
  industry?: string;
  department?: string;
  roleCategory?: string;
  desiredJobType?: string; // Permanent, Contract
  desiredEmploymentType?: string; // Full Time, Part Time
  preferredRole?: string;
  preferredWorkLocation?: string[];
  expectedSalary?: string;
  preferredShift?: string;
}

export interface IPersonalDetails {
  gender?: string;
  maritalStatus?: string;
  dob?: string;
  category?: string;
  address?: string;
  pincode?: string;
  hometown?: string;
  workPermitCountries?: string[];
  languages?: { language: string; proficiency: "Beginner" | "Proficient" | "Expert"; canRead: boolean; canWrite: boolean; canSpeak: boolean }[];
  differentlyAbled?: string;
  careerBreak?: string;
}

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  headline?: string;
  profileSummary?: string;
  noticePeriod?: string; // e.g. Available to join immediately, 15 Days
  phone?: string;
  college: string;
  degree: string;
  specialization?: string;
  graduationYear: number;
  cgpa?: number;
  skills: string[];
  itSkills?: IITSkill[];
  employmentHistory?: IEmployment[];
  educationList?: IEducationItem[];
  projectList?: IProjectItem[];
  accomplishments?: IAccomplishments;
  careerProfile?: ICareerProfile;
  personalDetails?: IPersonalDetails;
  experience?: string;
  projects?: string;
  certifications?: string;
  resumeUrl?: string;
  resumeName?: string;
  resumeUpdatedAt?: Date;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  location?: string;
  savedJobs: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    headline: { type: String, default: "" },
    profileSummary: { type: String, default: "" },
    noticePeriod: { type: String, default: "Immediate" },
    phone: { type: String, default: "" },
    college: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    specialization: { type: String, default: "" },
    graduationYear: { type: Number, required: true },
    cgpa: { type: Number },
    skills: { type: [String], default: [] },
    itSkills: [
      {
        skill: { type: String, required: true },
        version: { type: String, default: "" },
        lastUsed: { type: String, default: "" },
        experienceYears: { type: Number, default: 0 },
        experienceMonths: { type: Number, default: 0 },
      },
    ],
    employmentHistory: [
      {
        designation: { type: String, required: true },
        organization: { type: String, required: true },
        employmentType: { type: String, default: "Internship" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        isCurrent: { type: Boolean, default: false },
        description: { type: String, default: "" },
      },
    ],
    educationList: [
      {
        degree: { type: String, required: true },
        course: { type: String, default: "" },
        collegeOrSchool: { type: String, required: true },
        boardOrUniversity: { type: String, default: "" },
        startYear: { type: Number },
        endYear: { type: Number, required: true },
        gradingSystem: { type: String, default: "CGPA" },
        score: { type: String, default: "" },
      },
    ],
    projectList: [
      {
        title: { type: String, required: true },
        clientOrOrg: { type: String, default: "" },
        role: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        isOngoing: { type: Boolean, default: false },
        projectUrl: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    accomplishments: {
      onlineProfiles: [{ platform: String, url: String }],
      workSamples: [{ title: String, url: String, description: String }],
      publications: [{ title: String, url: String, description: String }],
      presentations: [{ title: String, url: String, description: String }],
      patents: [{ title: String, issueNumber: String, url: String, description: String }],
      certifications: [
        {
          title: String,
          provider: String,
          url: String,
          validFrom: String,
          validTo: String,
        },
      ],
    },
    careerProfile: {
      industry: { type: String, default: "IT Services & Consulting" },
      department: { type: String, default: "Engineering & Technology" },
      roleCategory: { type: String, default: "Software Development" },
      desiredJobType: { type: String, default: "Permanent" },
      desiredEmploymentType: { type: String, default: "Full Time" },
      preferredRole: { type: String, default: "Software Engineer, Full Stack Developer" },
      preferredWorkLocation: { type: [String], default: [] },
      expectedSalary: { type: String, default: "" },
      preferredShift: { type: String, default: "Day" },
    },
    personalDetails: {
      gender: { type: String, default: "" },
      maritalStatus: { type: String, default: "Single / Unmarried" },
      dob: { type: String, default: "" },
      category: { type: String, default: "General" },
      address: { type: String, default: "" },
      pincode: { type: String, default: "" },
      hometown: { type: String, default: "" },
      workPermitCountries: { type: [String], default: [] },
      languages: [
        {
          language: String,
          proficiency: { type: String, default: "Proficient" },
          canRead: { type: Boolean, default: true },
          canWrite: { type: Boolean, default: true },
          canSpeak: { type: Boolean, default: true },
        },
      ],
      differentlyAbled: { type: String, default: "No" },
      careerBreak: { type: String, default: "No" },
    },
    experience: { type: String, default: "" },
    projects: { type: String, default: "" },
    certifications: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    resumeName: { type: String, default: "Student_Resume.pdf" },
    resumeUpdatedAt: { type: Date, default: Date.now },
    linkedinUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    portfolioUrl: { type: String, default: "" },
    location: { type: String, default: "" },
    savedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
  },
  { timestamps: true }
);

export const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);
