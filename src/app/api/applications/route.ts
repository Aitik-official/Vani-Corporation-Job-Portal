import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Application } from "@/models/Application";
import { Student } from "@/models/Student";
import { Job } from "@/models/Job";
import { Notification } from "@/models/Notification";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { jobId, resumeUrl, additionalInformation } = body;

    if (!jobId || !resumeUrl) {
      return NextResponse.json(
        { error: "Job ID and resume are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const student = await Student.findOne({ userId: session.userId });
    if (!student) {
      return NextResponse.json(
        { error: "Student profile not found. Please complete registration." },
        { status: 404 }
      );
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.status !== "published") {
      return NextResponse.json(
        { error: "This job is not currently accepting applications" },
        { status: 400 }
      );
    }

    // Check duplicate application
    const existing = await Application.findOne({
      studentId: student._id,
      jobId: job._id,
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already applied for this job" },
        { status: 409 }
      );
    }

    // Create Application
    const application = await Application.create({
      studentId: student._id,
      companyId: job.companyId,
      jobId: job._id,
      resumeUrl,
      additionalInformation: additionalInformation || "",
      status: "applied",
    });

    // Notify Student
    await Notification.create({
      userId: session.userId,
      title: "Application Submitted",
      message: `You successfully applied for "${job.title}".`,
      type: "application",
      relatedJobId: job._id,
      relatedApplicationId: application._id,
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        application,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "You have already submitted an application for this role" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to submit application" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const student = await Student.findOne({ userId: session.userId });
    if (!student) {
      return NextResponse.json({ applications: [] });
    }

    const applications = await Application.find({ studentId: student._id })
      .populate({
        path: "jobId",
        select: "title location jobType workMode salaryMin salaryMax compensationPeriod",
      })
      .populate({
        path: "companyId",
        select: "companyName logoUrl location",
      })
      .sort({ appliedAt: -1 });

    return NextResponse.json({ applications });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve applications" },
      { status: 500 }
    );
  }
}
