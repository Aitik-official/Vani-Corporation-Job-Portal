import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Student } from "@/models/Student";
import { Application } from "@/models/Application";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const degree = searchParams.get("degree") || "";
    const graduationYear = searchParams.get("graduationYear") || "";

    const filter: Record<string, any> = {};

    if (degree) {
      filter.degree = { $regex: degree, $options: "i" };
    }
    if (graduationYear) {
      filter.graduationYear = Number(graduationYear);
    }

    // Fetch students populated with user credentials
    const students = await Student.find(filter)
      .populate({
        path: "userId",
        select: "name email isEmailVerified createdAt",
      })
      .sort({ createdAt: -1 });

    // Count applications for each student to assess placement activity
    const studentIds = students.map((s) => s._id);
    const applicationStats = await Application.aggregate([
      { $match: { studentId: { $in: studentIds } } },
      {
        $group: {
          _id: "$studentId",
          totalApplications: { $sum: 1 },
          interviewsCount: {
            $sum: { $cond: [{ $eq: ["$status", "interview"] }, 1, 0] },
          },
          hiredCount: {
            $sum: { $cond: [{ $eq: ["$status", "hired"] }, 1, 0] },
          },
        },
      },
    ]);

    const statsMap: Record<
      string,
      { totalApplications: number; interviewsCount: number; hiredCount: number }
    > = {};

    applicationStats.forEach((stat) => {
      statsMap[stat._id.toString()] = {
        totalApplications: stat.totalApplications,
        interviewsCount: stat.interviewsCount,
        hiredCount: stat.hiredCount,
      };
    });

    // Client-side text filter for name/email/skills if query is passed
    let result = students.map((student) => {
      const stats = statsMap[student._id.toString()] || {
        totalApplications: 0,
        interviewsCount: 0,
        hiredCount: 0,
      };

      const user = student.userId as any;

      return {
        _id: student._id.toString(),
        name: user?.name || "Anonymous Candidate",
        email: user?.email || "No Email Provided",
        phone: student.phone || "—",
        college: student.college,
        degree: student.degree,
        specialization: student.specialization || "General",
        graduationYear: student.graduationYear,
        cgpa: student.cgpa || null,
        skills: student.skills || [],
        resumeUrl: student.resumeUrl || null,
        githubUrl: student.githubUrl || null,
        linkedinUrl: student.linkedinUrl || null,
        portfolioUrl: student.portfolioUrl || null,
        registeredAt: user?.createdAt || student.createdAt,
        totalApplications: stats.totalApplications,
        interviewsCount: stats.interviewsCount,
        hiredCount: stats.hiredCount,
      };
    });

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.college.toLowerCase().includes(q) ||
          s.skills.some((sk) => sk.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      students: result,
      totalCount: result.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch student directory" },
      { status: 500 }
    );
  }
}

