import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { UploadedFile } from "@/models/UploadedFile";
import { getSession } from "@/lib/auth";
import { Application } from "@/models/Application";
import { Company } from "@/models/Company";
import { Student } from "@/models/Student";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    if (!filename) {
      return NextResponse.json({ error: "Filename required" }, { status: 400 });
    }

    await connectToDatabase();
    const fileDoc = await UploadedFile.findOne({ fileName: filename });

    if (!fileDoc) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // 1. Check if the file is a public asset (e.g. company logo, avatar, branding images)
    const isPublicImage =
      fileDoc.mimeType?.startsWith("image/") &&
      !fileDoc.originalName?.toLowerCase().includes("resume");

    // 2. If it is a confidential document (e.g. PDF resume, verification doc), enforce authorization
    if (!isPublicImage) {
      const session = await getSession();
      if (!session) {
        return NextResponse.json(
          { error: "Unauthorized. Please log in to view this document." },
          { status: 401 }
        );
      }

      // Admin has unrestricted access to verify candidates & employers
      const isAdmin = session.role === "admin";

      // File owner (the student or company user who uploaded it) has direct access
      const isOwner = fileDoc.uploadedBy?.toString() === session.userId;

      if (!isAdmin && !isOwner) {
        // If the viewer is a company recruiter, verify if the candidate applied to one of their jobs with this resume
        if (session.role === "company") {
          const company = await Company.findOne({ userId: session.userId });
          if (!company) {
            return NextResponse.json({ error: "Forbidden: Company not found" }, { status: 403 });
          }

          // Check if there is an application for this company referencing this file URL
          const fileUrl = `/api/files/${filename}`;
          const hasApplication = await Application.exists({
            companyId: company._id,
            resumeUrl: fileUrl,
          });

          if (!hasApplication) {
            // Also check if the candidate has applied to this company with any other matching student ID
            const studentOwner = await Student.findOne({ userId: fileDoc.uploadedBy });
            const hasStudentApplication = studentOwner
              ? await Application.exists({
                  companyId: company._id,
                  studentId: studentOwner._id,
                })
              : false;

            if (!hasStudentApplication) {
              return NextResponse.json(
                { error: "Forbidden: You do not have permission to view this candidate's resume." },
                { status: 403 }
              );
            }
          }
        } else {
          // If another student attempts to view someone else's resume
          return NextResponse.json(
            { error: "Forbidden: You cannot access documents belonging to other candidates." },
            { status: 403 }
          );
        }
      }
    }

    const headers = new Headers();
    headers.set("Content-Type", fileDoc.mimeType || "application/octet-stream");
    headers.set("Content-Length", fileDoc.size.toString());
    headers.set(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(fileDoc.originalName)}"`
    );
    // Cache private files with private/no-transform so CDNs don't cross-serve
    if (isPublicImage) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else {
      headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
    }

    return new NextResponse(fileDoc.data, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("Error serving uploaded file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

