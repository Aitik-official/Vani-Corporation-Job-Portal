import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Student } from "@/models/Student";
import { Company } from "@/models/Company";
import { verifyPassword, signSessionToken, COOKIE_NAME } from "@/lib/auth";
import { LoginSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = LoginSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, role } = validatedData.data;

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (role && user.role !== role) {
      return NextResponse.json(
        { error: `This account is not registered as a ${role}. Please use the correct login page.` },
        { status: 403 }
      );
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    let studentId: string | undefined;
    let companyId: string | undefined;
    let verificationStatus: string | undefined;

    if (user.role === "student") {
      const student = await Student.findOne({ userId: user._id });
      studentId = student?._id.toString();
    } else if (user.role === "company") {
      const company = await Company.findOne({ userId: user._id });
      companyId = company?._id.toString();
      verificationStatus = company?.verificationStatus;
    }

    const token = await signSessionToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      studentId,
      companyId,
    });

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId,
          companyId,
          verificationStatus,
        },
      },
      { status: 200 }
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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to log in" },
      { status: 500 }
    );
  }
}
