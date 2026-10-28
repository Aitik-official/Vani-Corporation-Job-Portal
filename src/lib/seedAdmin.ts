import { connectToDatabase } from "./mongodb";
import { User } from "@/models/User";
import { hashPassword } from "./auth";

export async function seedAdminUser() {
  await connectToDatabase();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@jobportal.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashedPassword = await hashPassword(adminPassword);
    const admin = await User.create({
      name: "Platform Administrator",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      isEmailVerified: true,
    });
    console.log("Default admin account seeded successfully:", admin.email);
    return admin;
  }
  return existingAdmin;
}
