const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const uri = "mongodb+srv://kittyparkar1230_db_user:wBjGBNdcvNXbRwiA@cluster0.fklsc5u.mongodb.net/job_portal?retryWrites=true&w=majority";

async function syncAndSeed() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(uri);
  console.log("Connected successfully!");

  // 1. User Schema
  const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
      password: { type: String, required: true },
      role: { type: String, enum: ["student", "company", "admin"], required: true },
      isEmailVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
  );
  const User = mongoose.models.User || mongoose.model("User", userSchema);

  // 2. Student Schema
  const studentSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
      phone: { type: String, default: "" },
      college: { type: String, required: true },
      degree: { type: String, required: true },
      specialization: { type: String, default: "" },
      graduationYear: { type: Number, required: true },
      cgpa: { type: Number },
      skills: { type: [String], default: [] },
      experience: { type: String, default: "" },
      projects: { type: String, default: "" },
      certifications: { type: String, default: "" },
      resumeUrl: { type: String, default: "" },
      linkedinUrl: { type: String, default: "" },
      githubUrl: { type: String, default: "" },
      portfolioUrl: { type: String, default: "" },
      location: { type: String, default: "" },
    },
    { timestamps: true }
  );
  const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

  // 3. Company Schema
  const companySchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
      companyName: { type: String, required: true },
      officialEmail: { type: String, required: true, lowercase: true },
      contactPerson: { type: String, required: true },
      contactNumber: { type: String, required: true },
      website: { type: String, default: "" },
      location: { type: String, required: true },
      description: { type: String, default: "" },
      logoUrl: { type: String, default: "" },
      verificationStatus: { type: String, enum: ["pending", "verified", "rejected"], default: "pending", index: true },
      verificationDocuments: { type: [String], default: [] },
      rejectionReason: { type: String, default: "" },
      verifiedAt: { type: Date },
    },
    { timestamps: true }
  );
  const Company = mongoose.models.Company || mongoose.model("Company", companySchema);

  // 4. Job Schema
  const jobSchema = new mongoose.Schema(
    {
      companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
      title: { type: String, required: true },
      category: { type: String, required: true },
      jobType: { type: String, enum: ["Full-time", "Part-time", "Internship", "Contract"], default: "Full-time" },
      workMode: { type: String, enum: ["On-site", "Remote", "Hybrid"], default: "Remote" },
      location: { type: String, required: true },
      salaryMin: { type: Number },
      salaryMax: { type: Number },
      compensationPeriod: { type: String, enum: ["Per Month", "Per Annum", "LPA"], default: "Per Annum" },
      openings: { type: Number, default: 1 },
      description: { type: String, required: true },
      responsibilities: { type: String, default: "" },
      requiredSkills: { type: [String], default: [] },
      qualifications: { type: String, default: "" },
      eligibleDegrees: { type: [String], default: [] },
      eligibleGraduationYears: { type: [Number], default: [] },
      minimumExperience: { type: Number, default: 0 },
      applicationDeadline: { type: Date },
      status: { type: String, enum: ["draft", "published", "closed", "inactive"], default: "draft", index: true },
    },
    { timestamps: true }
  );
  const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

  // 5. Application Schema
  const applicationSchema = new mongoose.Schema(
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
      companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true, index: true },
      resumeUrl: { type: String, required: true },
      additionalInformation: { type: String, default: "" },
      status: { type: String, enum: ["applied", "under_review", "shortlisted", "rejected", "selected"], default: "applied", index: true },
      appliedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );
  applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });
  const Application = mongoose.models.Application || mongoose.model("Application", applicationSchema);

  // 6. Notification Schema
  const notificationSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
      title: { type: String, required: true },
      message: { type: String, required: true },
      type: { type: String, enum: ["application", "verification", "system", "status_change"], default: "system" },
      relatedJobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
      relatedApplicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
      isRead: { type: Boolean, default: false, index: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
  );
  const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

  console.log("Creating/Ensuring all indexes across all models...");
  await User.syncIndexes();
  await Student.syncIndexes();
  await Company.syncIndexes();
  await Job.syncIndexes();
  await Application.syncIndexes();
  await Notification.syncIndexes();
  console.log("All indexes synchronized successfully.");

  // Check demo sample records for Phase 1 - 4
  const existingCompanyUser = await User.findOne({ email: "techcorp@recruiting.com" });
  let verifiedCompanyId;
  if (!existingCompanyUser) {
    const pw = await bcrypt.hash("Company@123", 12);
    const compUser = await User.create({
      name: "TechCorp Global",
      email: "techcorp@recruiting.com",
      password: pw,
      role: "company",
      isEmailVerified: true,
    });

    const company = await Company.create({
      userId: compUser._id,
      companyName: "TechCorp Global",
      officialEmail: "techcorp@recruiting.com",
      contactPerson: "Alex Morgan",
      contactNumber: "+1-555-0199",
      website: "https://techcorp.example.com",
      location: "San Francisco, CA",
      description: "Leading enterprise cloud software and AI solutions provider.",
      verificationStatus: "verified",
      verifiedAt: new Date(),
    });
    verifiedCompanyId = company._id;
    console.log("Sample Verified Company created:", company.companyName);

    // Create a published job for Phase 2 & 3 demonstration
    await Job.create({
      companyId: company._id,
      title: "Frontend Engineer (Next.js / React)",
      category: "Software Engineering",
      jobType: "Full-time",
      workMode: "Remote",
      location: "San Francisco, CA or Remote",
      salaryMin: 95000,
      salaryMax: 130000,
      compensationPeriod: "Per Annum",
      openings: 3,
      description: "We are seeking a talented Frontend Engineer to design and implement interactive portals and dashboards in Next.js and TypeScript.",
      responsibilities: "- Architect responsive, accessible UI components\n- Collaborate with product and backend teams\n- Optimize client-side performance",
      requiredSkills: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      qualifications: "B.S. in Computer Science or related degree. Graduation years: 2024 - 2026.",
      status: "published",
    });
    console.log("Sample published job created.");
  } else {
    const c = await Company.findOne({ userId: existingCompanyUser._id });
    verifiedCompanyId = c._id;
  }

  // Create a pending company for testing Admin Verification (Phase 4)
  const existingPending = await User.findOne({ email: "startup@innovate.io" });
  if (!existingPending) {
    const pw = await bcrypt.hash("Startup@123", 12);
    const pendingUser = await User.create({
      name: "Innovate Labs",
      email: "startup@innovate.io",
      password: pw,
      role: "company",
      isEmailVerified: true,
    });

    await Company.create({
      userId: pendingUser._id,
      companyName: "Innovate Labs",
      officialEmail: "startup@innovate.io",
      contactPerson: "Sarah Chen",
      contactNumber: "+1-555-4321",
      website: "https://innovatelabs.io",
      location: "New York, NY",
      description: "Early-stage fintech startup automating campus finance.",
      verificationStatus: "pending",
      verificationDocuments: ["/uploads/sample-incorporation.pdf"],
    });
    console.log("Sample Pending Company created for verification review.");
  }

  // Check demo student for testing Student Portal (Phase 2)
  const existingStudent = await User.findOne({ email: "student@stanford.edu" });
  if (!existingStudent) {
    const pw = await bcrypt.hash("Student@123", 12);
    const stuUser = await User.create({
      name: "Emily Watson",
      email: "student@stanford.edu",
      password: pw,
      role: "student",
      isEmailVerified: true,
    });

    await Student.create({
      userId: stuUser._id,
      phone: "+1-555-8899",
      college: "Stanford University",
      degree: "B.S. Computer Science",
      specialization: "Software Systems",
      graduationYear: 2026,
      cgpa: 3.9,
      skills: ["React", "TypeScript", "Node.js", "Python", "MongoDB"],
      experience: "Software Engineering Intern at CloudBase (Summer 2025)",
      projects: "OpportunityHub: Dual-sided Campus Recruitment Platform with App Router",
      location: "Palo Alto, CA",
    });
    console.log("Sample Student created:", stuUser.name);
  }

  console.log("Database synchronization completed!");
  process.exit(0);
}

syncAndSeed().catch((err) => {
  console.error("Error synchronizing database:", err);
  process.exit(1);
});
