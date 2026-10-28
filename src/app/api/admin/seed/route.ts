import { NextResponse } from "next/server";
import { seedAdminUser } from "@/lib/seedAdmin";

export async function POST() {
  try {
    const admin = await seedAdminUser();
    return NextResponse.json({
      message: "Admin check/seed completed",
      adminEmail: admin.email,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to seed admin" }, { status: 500 });
  }
}
