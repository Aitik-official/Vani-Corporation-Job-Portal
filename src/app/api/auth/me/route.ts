import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Company } from "@/models/Company";
import { Student } from "@/models/Student";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    await connectToDatabase();

    let extraData: Record<string, any> = {};

    if (session.role === "company") {
      const company = await Company.findOne({ userId: session.userId });
      if (company) {
        extraData = {
          companyId: company._id,
          companyName: company.companyName,
          verificationStatus: company.verificationStatus,
          logoUrl: company.logoUrl,
        };
      }
    } else if (session.role === "student") {
      const student = await Student.findOne({ userId: session.userId });
      if (student) {
        extraData = {
          studentId: student._id,
          college: student.college,
          degree: student.degree,
          skills: student.skills,
          resumeUrl: student.resumeUrl,
        };
      }
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        ...session,
        ...extraData,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, error: error.message || "Failed to retrieve session" },
      { status: 500 }
    );
  }
}
