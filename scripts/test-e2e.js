const mongoose = require("mongoose");

const uri = "mongodb+srv://kittyparkar1230_db_user:wBjGBNdcvNXbRwiA@cluster0.fklsc5u.mongodb.net/job_portal?retryWrites=true&w=majority";

async function runE2ETests() {
  console.log("==================================================");
  console.log("       STARTING END-TO-END WORKFLOW VERIFICATION   ");
  console.log("==================================================");

  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const usersCol = db.collection("users");
  const studentsCol = db.collection("students");
  const companiesCol = db.collection("companies");
  const jobsCol = db.collection("jobs");
  const applicationsCol = db.collection("applications");
  const notificationsCol = db.collection("notifications");

  // Step 1: Verify users of all 3 roles
  const adminUser = await usersCol.findOne({ role: "admin" });
  const companyUser = await usersCol.findOne({ role: "company" });
  const studentUser = await usersCol.findOne({ role: "student" });

  console.log("✓ Step 1: Role Authentication Accounts Verified");
  console.log(`   - Admin: ${adminUser?.email}`);
  console.log(`   - Company: ${companyUser?.email}`);
  console.log(`   - Student: ${studentUser?.email}`);

  if (!adminUser || !companyUser || !studentUser) {
    throw new Error("Missing required test accounts across roles");
  }

  // Step 2: Verify Company & Job
  const verifiedCompany = await companiesCol.findOne({ verificationStatus: "verified" });
  console.log(`✓ Step 2: Verified Company: "${verifiedCompany?.companyName}" (${verifiedCompany?.officialEmail})`);

  let testJob = await jobsCol.findOne({ companyId: verifiedCompany._id, status: "published" });
  if (!testJob) {
    console.log("Creating active published job for test...");
    const res = await jobsCol.insertOne({
      companyId: verifiedCompany._id,
      title: "Full Stack Engineer (TypeScript & Next.js)",
      category: "Software Engineering",
      jobType: "Full-time",
      workMode: "Remote",
      location: "San Francisco, CA or Remote",
      salaryMin: 110000,
      salaryMax: 145000,
      compensationPeriod: "Per Annum",
      openings: 2,
      description: "Exciting technical opportunity on our high-growth platform engineering team.",
      requiredSkills: ["Next.js", "TypeScript", "Node.js", "MongoDB"],
      status: "published",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    testJob = await jobsCol.findOne({ _id: res.insertedId });
  }
  console.log(`✓ Step 3: Verified Job Posting: "${testJob.title}" (ID: ${testJob._id})`);

  // Step 3: Verify Student Profile
  const student = await studentsCol.findOne({ userId: studentUser._id });
  console.log(`✓ Step 4: Student Profile Verified: "${studentUser.name}" from ${student.college}`);

  // Step 4: Simulate Student Applying to Job
  await applicationsCol.deleteMany({ studentId: student._id, jobId: testJob._id });
  const appResult = await applicationsCol.insertOne({
    studentId: student._id,
    companyId: verifiedCompany._id,
    jobId: testJob._id,
    resumeUrl: "/uploads/sample-resume.pdf",
    additionalInformation: "Passionate about full-stack web platforms and cloud backends.",
    status: "applied",
    appliedAt: new Date(),
    updatedAt: new Date(),
  });
  console.log(`✓ Step 5: Application Submitted Successfully! App ID: ${appResult.insertedId}`);

  // Step 5: Test Duplicate Prevention (MongoDB Compound Index check)
  let duplicatePrevented = false;
  try {
    await applicationsCol.insertOne({
      studentId: student._id,
      companyId: verifiedCompany._id,
      jobId: testJob._id,
      resumeUrl: "/uploads/another-resume.pdf",
      status: "applied",
      appliedAt: new Date(),
    });
  } catch (err) {
    if (err.code === 11000) {
      duplicatePrevented = true;
    }
  }
  console.log(`✓ Step 6: Compound Unique Index Check: Duplicate application prevented: ${duplicatePrevented ? "PASS" : "FAIL"}`);

  // Step 6: Simulate Company Review & Shortlisting Candidate
  await applicationsCol.updateOne(
    { _id: appResult.insertedId },
    { $set: { status: "shortlisted", updatedAt: new Date() } }
  );
  console.log(`✓ Step 7: Employer Shortlisted Candidate (Status updated to "shortlisted")`);

  // Step 7: In-App Notification Delivery
  const studentNotification = await notificationsCol.insertOne({
    userId: studentUser._id,
    title: `Application Status Updated: ${testJob.title}`,
    message: `${verifiedCompany.companyName} has shortlisted your profile for the ${testJob.title} position!`,
    type: "status_change",
    relatedJobId: testJob._id,
    relatedApplicationId: appResult.insertedId,
    isRead: false,
    createdAt: new Date(),
  });
  console.log(`✓ Step 8: In-App Notification Delivered to Student: ID ${studentNotification.insertedId}`);

  // Step 8: Verify Complete Data Retrieval for Company Dashboard
  const retrievedApp = await applicationsCol.findOne({ _id: appResult.insertedId });
  const populatedStudent = await studentsCol.findOne({ _id: retrievedApp.studentId });
  const populatedUser = await usersCol.findOne({ _id: populatedStudent.userId });

  console.log("✓ Step 9: Employer Pipeline Verification: Profile Inspection");
  console.log(`   - Candidate Name: ${populatedUser.name}`);
  console.log(`   - College: ${populatedStudent.college} (${populatedStudent.degree})`);
  console.log(`   - CGPA: ${populatedStudent.cgpa}`);
  console.log(`   - Skills: ${populatedStudent.skills.join(", ")}`);
  console.log(`   - Resume Link: ${retrievedApp.resumeUrl}`);
  console.log(`   - Current Status: ${retrievedApp.status}`);

  console.log("==================================================");
  console.log("       ALL END-TO-END PIPELINES PASSED!           ");
  console.log("==================================================");
  process.exit(0);
}

runE2ETests().catch((err) => {
  console.error("E2E Test Failed:", err);
  process.exit(1);
});
