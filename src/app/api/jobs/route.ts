import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import { Company } from "@/models/Company";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const jobType = searchParams.get("jobType") || "";
    const workMode = searchParams.get("workMode") || "";
    const location = searchParams.get("location") || "";
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.max(1, Number(searchParams.get("limit") || 10));

    // Only jobs from verified companies that are published
    const verifiedCompanies = await Company.find({ verificationStatus: "verified" }).select("_id");
    const verifiedCompanyIds = verifiedCompanies.map((c) => c._id);

    const query: any = {
      status: "published",
      companyId: { $in: verifiedCompanyIds },
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { requiredSkills: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.category = category;
    if (jobType) query.jobType = jobType;
    if (workMode) query.workMode = workMode;
    if (location) query.location = { $regex: location, $options: "i" };

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate({
        path: "companyId",
        select: "companyName logoUrl location website officialEmail",
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
