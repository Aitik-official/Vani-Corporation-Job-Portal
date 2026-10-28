import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import { Company } from "@/models/Company";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || session.role !== "company") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const company = await Company.findOne({ userId: session.userId });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const job = await Job.findOne({ _id: id, companyId: company._id });
    if (!job) {
      return NextResponse.json({ error: "Job not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ job, verificationStatus: company.verificationStatus });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch job" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || session.role !== "company") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const company = await Company.findOne({ userId: session.userId });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const job = await Job.findOne({ _id: id, companyId: company._id });
    if (!job) {
      return NextResponse.json({ error: "Job not found or access denied" }, { status: 404 });
    }

    const body = await req.json();

    // If attempting to publish, enforce verified check
    if (body.status === "published" && company.verificationStatus !== "verified") {
      return NextResponse.json(
        { error: "Cannot publish jobs without verified employer status" },
        { status: 403 }
      );
    }

    // Process skills if provided as string
    if (body.requiredSkills && typeof body.requiredSkills === "string") {
      body.requiredSkills = body.requiredSkills
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    // Normalize numeric fields
    if (body.salaryMin !== undefined) {
      body.salaryMin = body.salaryMin === "" ? undefined : Number(body.salaryMin);
    }
    if (body.salaryMax !== undefined) {
      body.salaryMax = body.salaryMax === "" ? undefined : Number(body.salaryMax);
    }
    if (body.openings !== undefined) {
      body.openings = Number(body.openings) || 1;
    }
    if (body.minimumExperience !== undefined) {
      body.minimumExperience = Number(body.minimumExperience) || 0;
    }

    const updatedJob = await Job.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || session.role !== "company") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const company = await Company.findOne({ userId: session.userId });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const deleted = await Job.findOneAndDelete({ _id: id, companyId: company._id });
    if (!deleted) {
      return NextResponse.json({ error: "Job not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete job" },
      { status: 500 }
    );
  }
}
