import mongoose, { Schema, Document, Model } from "mongoose";

export type CompanyVerificationStatus = "pending" | "verified" | "rejected";

export interface ICompany extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  officialEmail: string;
  contactPerson: string;
  contactNumber: string;
  website?: string;
  location: string;
  description?: string;
  logoUrl?: string;
  verificationStatus: CompanyVerificationStatus;
  verificationDocuments: string[];
  rejectionReason?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    companyName: { type: String, required: true, trim: true },
    officialEmail: { type: String, required: true, lowercase: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    website: { type: String, default: "" },
    location: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true,
    },
    verificationDocuments: { type: [String], default: [] },
    rejectionReason: { type: String, default: "" },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

export const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);
