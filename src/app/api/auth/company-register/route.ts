import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Company } from "@/models/Company";
import { hashPassword, signSessionToken, COOKIE_NAME } from "@/lib/auth";
import { CompanyRegisterSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = CompanyRegisterSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      companyName,
      officialEmail,
      password,
      contactPerson,
      contactNumber,
      website,
      location,
      description,
      logoUrl,
    } = validatedData.data;

    await connectToDatabase();

    const existingUser = await User.findOne({ email: officialEmail.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this official email address already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name: companyName,
      email: officialEmail.toLowerCase(),
      password: hashedPassword,
      role: "company",
      isEmailVerified: true,
    });

    const company = await Company.create({
      userId: user._id,
      companyName,
      officialEmail: officialEmail.toLowerCase(),
      contactPerson,
      contactNumber,
      website: website || "",
      location,
      description: description || "",
      logoUrl: logoUrl || "",
      verificationStatus: "pending",
    });

    const token = await signSessionToken({
      userId: user._id.toString(),
      email: user.email,
      role: "company",
      name: user.name,
      companyId: company._id.toString(),
    });

    const response = NextResponse.json(
      {
        message: "Company registered successfully with Pending verification status",
        user: {
          id: user._id,
          name: company.companyName,
          email: user.email,
          role: user.role,
          companyId: company._id,
          verificationStatus: company.verificationStatus,
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
    console.error("Company registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register company" },
      { status: 500 }
    );
  }
}
