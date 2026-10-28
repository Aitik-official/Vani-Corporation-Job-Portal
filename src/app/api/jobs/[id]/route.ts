import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Job } from "@/models/Job";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const job = await Job.findById(id).populate({
      path: "companyId",
      select: "companyName logoUrl location website description verificationStatus",
    });

    if (!job) {
      return NextResponse.json({ error: "Job opening not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch job details" },
      { status: 500 }
    );
  }
}
