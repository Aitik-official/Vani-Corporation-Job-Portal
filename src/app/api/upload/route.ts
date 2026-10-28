import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { UploadedFile } from "@/models/UploadedFile";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Limit size to 5MB (plenty for PDF resumes / certificates)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename identifier
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}-${session.userId}-${sanitizedOriginalName}`;

    await connectToDatabase();

    await UploadedFile.create({
      fileName: uniqueFileName,
      originalName: file.name,
      mimeType: file.type || "application/pdf",
      size: file.size,
      data: buffer,
      uploadedBy: new mongoose.Types.ObjectId(session.userId),
    });

    // Universal URL that works anywhere (Vercel serverless, container, local)
    const fileUrl = `/api/files/${uniqueFileName}`;

    return NextResponse.json({
      message: "File uploaded successfully",
      url: fileUrl,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
