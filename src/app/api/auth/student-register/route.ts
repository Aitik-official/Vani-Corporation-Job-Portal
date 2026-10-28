import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Student } from "@/models/Student";
import { hashPassword, signSessionToken, COOKIE_NAME } from "@/lib/auth";
import { StudentRegisterSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = StudentRegisterSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, phone, college, degree, graduationYear } = validatedData.data;

    await connectToDatabase();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "student",
      isEmailVerified: true,
    });

    const student = await Student.create({
      userId: user._id,
      phone: phone || "",
      college,
      degree,
      graduationYear,
      skills: [],
    });

    const token = await signSessionToken({
      userId: user._id.toString(),
      email: user.email,
      role: "student",
      name: user.name,
      studentId: student._id.toString(),
    });

    const response = NextResponse.json(
      {
        message: "Student account created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: student._id,
        },
      },
      { status: 201 }
    );

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error("Student registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register student" },
      { status: 500 }
    );
  }
}
