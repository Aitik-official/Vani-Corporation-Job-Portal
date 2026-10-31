export interface EmploymentItem {
  designation: string;
  organization: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface EducationItem {
  degree: string;
  course?: string;
  collegeOrSchool: string;
  boardOrUniversity?: string;
  startYear?: number;
  endYear: number;
  gradingSystem?: string;
  score?: string;
}

export interface ITSkillItem {
  skill: string;
  version?: string;
  lastUsed?: string;
  experienceYears?: number;
  experienceMonths?: number;
}

export interface ProjectItem {
  title: string;
  clientOrOrg?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  isOngoing?: boolean;
  projectUrl?: string;
  description: string;
}

export interface Accomplishments {
  onlineProfiles?: { platform: string; url: string }[];
  workSamples?: { title: string; url: string; description?: string }[];
  publications?: { title: string; url?: string; description?: string }[];
  presentations?: { title: string; url?: string; description?: string }[];
  patents?: { title: string; issueNumber?: string; url?: string; description?: string }[];
  certifications?: { title: string; provider: string; url?: string; validFrom?: string; validTo?: string }[];
}

export interface CareerProfile {
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

export interface LanguageItem {
  language: string;
  proficiency: "Beginner" | "Proficient" | "Expert";
  canRead: boolean;
  canWrite: boolean;
  canSpeak: boolean;
}

export interface PersonalDetails {
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
