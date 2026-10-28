import { z } from "zod";

export const StudentRegisterSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
  phone: z.string().optional(),
  college: z.string().min(2, "College/University is required"),
  degree: z.string().min(2, "Degree/Course is required"),
  graduationYear: z.coerce.number().int().min(1990).max(2035),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const CompanyRegisterSchema = z.object({
  companyName: z.string().min(2, "Company Name must be at least 2 characters"),
  officialEmail: z.string().email("Invalid official email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
  contactPerson: z.string().min(2, "Contact Person Name is required"),
  contactNumber: z.string().min(7, "Contact number is required"),
  website: z.string().url("Valid URL required").or(z.literal("")).optional(),
  location: z.string().min(2, "Company location is required"),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["student", "company", "admin"]).optional(),
});
