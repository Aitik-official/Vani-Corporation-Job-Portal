import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Student } from "@/models/Student";
import { User } from "@/models/User";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const student = await Student.findOne({ userId: session.userId }).populate({
      path: "userId",
      select: "name email",
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch student profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      headline,
      profileSummary,
      noticePeriod,
      phone,
      college,
      degree,
      specialization,
      graduationYear,
      cgpa,
      skills,
      itSkills,
      employmentHistory,
      educationList,
      projectList,
      accomplishments,
      careerProfile,
      personalDetails,
      experience,
      projects,
      certifications,
      resumeUrl,
      resumeName,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      location,
    } = body;

    await connectToDatabase();

    // Update User name if provided
    if (name) {
      await User.findByIdAndUpdate(session.userId, { name });
    }

    // Prepare update object
    const updateData: any = {};
    if (headline !== undefined) updateData.headline = headline;
    if (profileSummary !== undefined) updateData.profileSummary = profileSummary;
    if (noticePeriod !== undefined) updateData.noticePeriod = noticePeriod;
    if (phone !== undefined) updateData.phone = phone;
    if (college !== undefined) updateData.college = college;
    if (degree !== undefined) updateData.degree = degree;
    if (specialization !== undefined) updateData.specialization = specialization;
    if (graduationYear !== undefined) updateData.graduationYear = Number(graduationYear);
    if (cgpa !== undefined) updateData.cgpa = cgpa === "" ? undefined : Number(cgpa);
    if (skills !== undefined) {
      updateData.skills = Array.isArray(skills)
        ? skills
        : typeof skills === "string"
        ? skills.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];
    }
    if (itSkills !== undefined) updateData.itSkills = itSkills;
    if (employmentHistory !== undefined) updateData.employmentHistory = employmentHistory;
    if (educationList !== undefined) updateData.educationList = educationList;
    if (projectList !== undefined) updateData.projectList = projectList;
    if (accomplishments !== undefined) updateData.accomplishments = accomplishments;
    if (careerProfile !== undefined) updateData.careerProfile = careerProfile;
    if (personalDetails !== undefined) updateData.personalDetails = personalDetails;
    if (experience !== undefined) updateData.experience = experience;
    if (projects !== undefined) updateData.projects = projects;
    if (certifications !== undefined) updateData.certifications = certifications;
    if (resumeUrl !== undefined) {
      updateData.resumeUrl = resumeUrl;
      updateData.resumeUpdatedAt = new Date();
    }
    if (resumeName !== undefined) updateData.resumeName = resumeName;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl;
    if (location !== undefined) updateData.location = location;

    // Update Student record
    const updatedStudent = await Student.findOneAndUpdate(
      { userId: session.userId },
      updateData,
      { new: true, upsert: true }
    ).populate({ path: "userId", select: "name email" });

    return NextResponse.json({
      message: "Profile updated successfully",
      student: updatedStudent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
