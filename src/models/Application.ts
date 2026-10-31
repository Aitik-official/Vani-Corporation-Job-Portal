import mongoose, { Schema, Document, Model } from "mongoose";

export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "shortlisted"
  | "rejected"
  | "selected";

export interface IInterview {
  scheduledAt: Date;
  roundTitle: string;
  mode: "Google Meet" | "Zoom" | "Microsoft Teams" | "On-site" | "Phone";
  meetingLink?: string;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled";
}

export interface IApplication extends Document {
  studentId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  resumeUrl: string;
  additionalInformation?: string;
  status: ApplicationStatus;
  interview?: IInterview;
  appliedAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    resumeUrl: { type: String, required: true },
    additionalInformation: { type: String, default: "" },
    status: {
      type: String,
      enum: ["applied", "under_review", "shortlisted", "rejected", "selected"],
      default: "applied",
      index: true,
    },
    interview: {
      scheduledAt: { type: Date },
      roundTitle: { type: String, default: "Technical Round" },
      mode: {
        type: String,
        enum: ["Google Meet", "Zoom", "Microsoft Teams", "On-site", "Phone"],
        default: "Google Meet",
      },
      meetingLink: { type: String, default: "" },
      notes: { type: String, default: "" },
      status: {
        type: String,
        enum: ["scheduled", "completed", "cancelled"],
        default: "scheduled",
      },
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound unique index to strictly prevent duplicate job applications by a student
ApplicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

// Recruiter applicant pipeline filter & sort
ApplicationSchema.index({ companyId: 1, status: 1, appliedAt: -1 });

// Job-specific applicant list query
ApplicationSchema.index({ jobId: 1, status: 1, appliedAt: -1 });

// Student dashboard application tracker query
ApplicationSchema.index({ studentId: 1, appliedAt: -1 });

export const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);
