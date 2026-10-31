import mongoose, { Schema, Document, Model } from "mongoose";

export type JobStatus = "draft" | "published" | "closed" | "inactive";
export type JobType = "Full-time" | "Part-time" | "Internship" | "Contract";
export type WorkMode = "On-site" | "Remote" | "Hybrid";

export interface IJob extends Document {
  companyId: mongoose.Types.ObjectId;
  title: string;
  category: string;
  jobType: JobType;
  workMode: WorkMode;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  compensationPeriod: "Per Month" | "Per Annum" | "LPA";
  openings: number;
  description: string;
  responsibilities?: string;
  requiredSkills: string[];
  qualifications?: string;
  eligibleDegrees: string[];
  eligibleGraduationYears: number[];
  minimumExperience?: number;
  applicationDeadline?: Date;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },
    workMode: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      default: "Remote",
    },
    location: { type: String, required: true, trim: true },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    compensationPeriod: {
      type: String,
      enum: ["Per Month", "Per Annum", "LPA"],
      default: "Per Annum",
    },
    openings: { type: Number, default: 1 },
    description: { type: String, required: true },
    responsibilities: { type: String, default: "" },
    requiredSkills: { type: [String], default: [] },
    qualifications: { type: String, default: "" },
    eligibleDegrees: { type: [String], default: [] },
    eligibleGraduationYears: { type: [Number], default: [] },
    minimumExperience: { type: Number, default: 0 },
    applicationDeadline: { type: Date },
    status: {
      type: String,
      enum: ["draft", "published", "closed", "inactive"],
      default: "draft",
      index: true,
    },
  },
  { timestamps: true }
);

// High-performance compound indexes for search, listing and recruiter management
JobSchema.index({ status: 1, createdAt: -1 });
JobSchema.index({ companyId: 1, status: 1, createdAt: -1 });
JobSchema.index({ category: 1, status: 1 });

export const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
