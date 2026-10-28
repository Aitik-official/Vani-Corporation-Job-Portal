import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Company } from "@/models/Company";
import { User } from "@/models/User";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "company") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const company = await Company.findOne({ userId: session.userId }).populate({
      path: "userId",
      select: "name email",
    });

    if (!company) {
      return NextResponse.json({ error: "Company profile not found" }, { status: 404 });
    }

    return NextResponse.json({ company });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch company profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "company") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      companyName,
      contactPerson,
      contactNumber,
      website,
      location,
      description,
      logoUrl,
      verificationDocuments,
    } = body;

    await connectToDatabase();

    if (companyName) {
      await User.findByIdAndUpdate(session.userId, { name: companyName });
    }

    const updated = await Company.findOneAndUpdate(
      { userId: session.userId },
      {
        companyName,
        contactPerson,
        contactNumber,
        website,
        location,
        description,
        logoUrl,
        ...(verificationDocuments ? { verificationDocuments } : {}),
      },
      { new: true }
    );

    return NextResponse.json({
      message: "Company profile updated successfully",
      company: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update company profile" },
      { status: 500 }
    );
  }
}
