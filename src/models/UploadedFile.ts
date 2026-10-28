import mongoose, { Schema, Document } from "mongoose";

export interface IUploadedFile extends Document {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  data: Buffer;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const UploadedFileSchema = new Schema<IUploadedFile>(
  {
    fileName: { type: String, required: true, unique: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const UploadedFile =
  mongoose.models.UploadedFile ||
  mongoose.model<IUploadedFile>("UploadedFile", UploadedFileSchema);

