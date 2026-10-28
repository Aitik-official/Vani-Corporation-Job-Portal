import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Company } from "@/models/Company";
import { Notification } from "@/models/Notification";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin privileges required" }, { status: 403 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query: any = {};
    if (status && ["pending", "verified", "rejected"].includes(status)) {
      query.verificationStatus = status;
    }

    const companies = await Company.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ companies });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve companies" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin privileges required" }, { status: 403 });
    }

    const body = await req.json();
    const { companyId, status, rejectionReason } = body;

    if (!companyId || !["verified", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status or companyId" }, { status: 400 });
    }

    if (status === "rejected" && !rejectionReason) {
      return NextResponse.json({ error: "Rejection reason is required when rejecting a company" }, { status: 400 });
    }

    await connectToDatabase();

    const updatePayload: any = {
      verificationStatus: status,
      verifiedAt: status === "verified" ? new Date() : undefined,
      rejectionReason: status === "rejected" ? rejectionReason : "",
    };

    const company = await Company.findByIdAndUpdate(companyId, updatePayload, { new: true });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Send in-app notification to the company account user
    await Notification.create({
      userId: company.userId,
      title: status === "verified" ? "Company Verification Approved!" : "Company Verification Rejected",
      message:
        status === "verified"
          ? "Congratulations! Your employer account has been officially verified by administrators. You are now authorized to publish job openings to students."
          : `Your company verification request was rejected. Reason: ${rejectionReason}. You may update your profile and documents to request reconsideration.`,
      type: "verification",
    });

    return NextResponse.json({
      message: `Company marked as ${status}`,
      company,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update verification status" },
      { status: 500 }
    );
  }
}
