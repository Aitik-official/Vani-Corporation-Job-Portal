import mongoose, { Schema, Document, Model } from "mongoose";

export type Role = "student" | "company" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: Role;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "company", "admin"],
      required: true,
      default: "student",
    },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
