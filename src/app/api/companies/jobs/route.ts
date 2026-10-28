import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import { Company } from "@/models/Company";
import { Application } from "@/models/Application";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "company") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const company = await Company.findOne({ userId: session.userId });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const jobs = await Job.find({ companyId: company._id }).sort({ createdAt: -1 });

    // Compute application counts for each job
    const jobIds = jobs.map((j) => j._id);
    const applicationCounts = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: "$jobId", count: { $sum: 1 } } },
    ]);

    const countMap: Record<string, number> = {};
    applicationCounts.forEach((ac) => {
      countMap[ac._id.toString()] = ac.count;
    });

    const jobsWithCounts = jobs.map((job) => ({
      ...job.toObject(),
      applicationsCount: countMap[job._id.toString()] || 0,
    }));

    return NextResponse.json({ jobs: jobsWithCounts, verificationStatus: company.verificationStatus });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch company jobs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "company") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const company = await Company.findOne({ userId: session.userId });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      title,
      category,
      jobType,
      workMode,
      location,
      salaryMin,
      salaryMax,
      compensationPeriod,
      openings,
      description,
      responsibilities,
      requiredSkills,
      qualifications,
      eligibleDegrees,
      eligibleGraduationYears,
      minimumExperience,
      applicationDeadline,
      action, // 'save_draft' or 'publish'
    } = body;

    if (!title || !category || !location || !description) {
      return NextResponse.json(
        { error: "Title, Category, Location, and Description are required" },
        { status: 400 }
      );
    }

    // Verify publishing restriction: only verified companies can publish
    let targetStatus: "draft" | "published" = "draft";
    if (action === "publish") {
      if (company.verificationStatus !== "verified") {
        return NextResponse.json(
          {
            error:
              "Publishing requires verified employer status. Your job has been saved as a draft.",
          },
          { status: 403 }
        );
      }
      targetStatus = "published";
    }

    const skillsArray = Array.isArray(requiredSkills)
      ? requiredSkills
      : typeof requiredSkills === "string"
      ? requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const job = await Job.create({
      companyId: company._id,
      title,
      category,
      jobType: jobType || "Full-time",
      workMode: workMode || "Remote",
      location,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      compensationPeriod: compensationPeriod || "Per Annum",
      openings: openings ? Number(openings) : 1,
      description,
      responsibilities: responsibilities || "",
      requiredSkills: skillsArray,
      qualifications: qualifications || "",
      eligibleDegrees: eligibleDegrees || [],
      eligibleGraduationYears: eligibleGraduationYears || [],
      minimumExperience: minimumExperience ? Number(minimumExperience) : 0,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
      status: targetStatus,
    });

    return NextResponse.json(
      {
        message: targetStatus === "published" ? "Job published successfully" : "Job saved as draft",
        job,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create job" },
      { status: 500 }
    );
  }
}
