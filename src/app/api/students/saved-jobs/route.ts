import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Student } from "@/models/Student";
import { Job } from "@/models/Job";
import { Company } from "@/models/Company";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Ensure models are registered
    void Company;
    void Job;

    const student = await Student.findOne({ userId: session.userId });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const savedJobObjectIds = (student.savedJobs || []).filter(Boolean);

    // Explicitly query jobs by IDs and populate company details
    const jobs = await Job.find({ _id: { $in: savedJobObjectIds } })
      .populate({
        path: "companyId",
        select: "companyName logoUrl location",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      savedJobs: jobs,
      savedJobIds: savedJobObjectIds.map((id: any) => id.toString()),
    });
  } catch (error: any) {
    console.error("GET saved-jobs error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch saved jobs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const student = await Student.findOne({ userId: session.userId });
    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const currentSavedStrings = (student.savedJobs || []).map((id: any) => id.toString());
    const targetJobIdStr = jobId.toString();
    const isAlreadySaved = currentSavedStrings.includes(targetJobIdStr);

    let updatedSavedJobIds: mongoose.Types.ObjectId[];
    let isSavedNow = false;

    if (isAlreadySaved) {
      // Remove
      updatedSavedJobIds = (student.savedJobs || []).filter(
        (id: any) => id.toString() !== targetJobIdStr
      );
      isSavedNow = false;
    } else {
      // Add
      const newObjectId = new mongoose.Types.ObjectId(targetJobIdStr);
      updatedSavedJobIds = [...(student.savedJobs || []), newObjectId];
      isSavedNow = true;
    }

    await Student.updateOne(
      { _id: student._id },
      { $set: { savedJobs: updatedSavedJobIds } }
    );

    return NextResponse.json({
      message: isSavedNow ? "Job bookmarked successfully!" : "Job removed from bookmarks",
      isSaved: isSavedNow,
      jobId: targetJobIdStr,
    });
  } catch (error: any) {
    console.error("POST saved-jobs error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update bookmark" },
      { status: 500 }
    );
  }
}
