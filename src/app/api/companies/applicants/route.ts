import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Application } from "@/models/Application";
import { Company } from "@/models/Company";
import { Notification } from "@/models/Notification";

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");
    const search = searchParams.get("search") || "";
    const minCgpa = searchParams.get("minCgpa");
    const graduationYear = searchParams.get("graduationYear");
    const degree = searchParams.get("degree");

    const query: any = { companyId: company._id };
    if (jobId) query.jobId = jobId;
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate({
        path: "jobId",
        select: "title location jobType workMode requiredSkills salaryMin salaryMax",
      })
      .sort({ appliedAt: -1 });

    // Multi-faceted filtering for search, CGPA, grad year, degree
    const filtered = applications.filter((app: any) => {
      const student = app.studentId;
      if (!student) return false;

      // Degree filter
      if (degree && degree !== "all") {
        if (!student.degree?.toLowerCase().includes(degree.toLowerCase())) {
          return false;
        }
      }

      // Graduation year filter
      if (graduationYear && graduationYear !== "all") {
        if (student.graduationYear !== parseInt(graduationYear, 10)) {
          return false;
        }
      }

      // Minimum CGPA filter
      if (minCgpa && minCgpa !== "all") {
        const threshold = parseFloat(minCgpa);
        if (student.cgpa === undefined || student.cgpa < threshold) {
          return false;
        }
      }

      // Text search query filter (student name, college, degree, or skills)
      if (search) {
        const q = search.toLowerCase();
        const studentName = student.userId?.name?.toLowerCase() || "";
        const email = student.userId?.email?.toLowerCase() || "";
        const college = student.college?.toLowerCase() || "";
        const skills = (student.skills || []).join(" ").toLowerCase();
        const jobTitle = app.jobId?.title?.toLowerCase() || "";

        const matches =
          studentName.includes(q) ||
          email.includes(q) ||
          college.includes(q) ||
          skills.includes(q) ||
          jobTitle.includes(q);

        if (!matches) return false;
      }

      return true;
    });

    return NextResponse.json({ applications: filtered });
  } catch (error: any) {
    console.error("Fetch applicants error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch applicants" },
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

    await connectToDatabase();
    const company = await Company.findOne({ userId: session.userId });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const body = await req.json();
    const { applicationId, status, interview } = body;

    if (!applicationId) {
      return NextResponse.json({ error: "Missing applicationId" }, { status: 400 });
    }

    const application = await Application.findOne({
      _id: applicationId,
      companyId: company._id,
    })
      .populate("jobId", "title")
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "_id name email" },
      });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found or unauthorized" },
        { status: 404 }
      );
    }

    const studentUser = (application.studentId as any)?.userId;
    const jobTitle = (application.jobId as any)?.title || "the role";

    // Scenario A: Schedule / Update Interview
    if (interview) {
      const { scheduledAt, roundTitle, mode, meetingLink, notes, status: interviewStatus } = interview;

      if (!scheduledAt) {
        return NextResponse.json(
          { error: "Interview scheduled date/time is required" },
          { status: 400 }
        );
      }

      application.interview = {
        scheduledAt: new Date(scheduledAt),
        roundTitle: roundTitle?.trim() || "Technical Round",
        mode: mode || "Google Meet",
        meetingLink: meetingLink?.trim() || "",
        notes: notes?.trim() || "",
        status: interviewStatus || "scheduled",
      };

      // Automatically advance status to shortlisted if currently applied or under_review
      if (status) {
        application.status = status;
      } else if (application.status === "applied" || application.status === "under_review") {
        application.status = "shortlisted";
      }

      await application.save();

      // Dispatch high-priority notification to student
      if (studentUser?._id) {
        const formattedDate = new Date(scheduledAt).toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        await Notification.create({
          userId: studentUser._id,
          title: `Interview Scheduled: ${application.interview.roundTitle} - ${jobTitle}`,
          message: `${company.companyName} has scheduled an interview for "${jobTitle}" on ${formattedDate} via ${application.interview.mode}. Access your portal to join or add to your calendar.`,
          type: "status_change",
          relatedJobId: (application.jobId as any)?._id,
          relatedApplicationId: application._id,
        });
      }

      return NextResponse.json({
        message: "Interview scheduled successfully and candidate notified",
        application,
      });
    }

    // Scenario B: Update Application Pipeline Status
    if (status) {
      const validStatuses = ["applied", "under_review", "shortlisted", "rejected", "selected"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      application.status = status;
      await application.save();

      const statusLabels: Record<string, string> = {
        under_review: "is now Under Review",
        shortlisted: "has been Shortlisted!",
        selected: "has been Selected! Congratulations!",
        rejected: "was not moved forward",
        applied: "status has been updated",
      };

      if (studentUser?._id) {
        await Notification.create({
          userId: studentUser._id,
          title: `Application Status Updated: ${jobTitle}`,
          message: `${company.companyName} updated your application for "${jobTitle}": status ${statusLabels[status] || status}.`,
          type: "status_change",
          relatedJobId: (application.jobId as any)?._id,
          relatedApplicationId: application._id,
        });
      }

      return NextResponse.json({
        message: `Status updated to ${status}`,
        application,
      });
    }

    return NextResponse.json({ error: "No changes requested" }, { status: 400 });
  } catch (error: any) {
    console.error("Update applicant error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update application" },
      { status: 500 }
    );
  }
}
