const mongoose = require("mongoose");

const uri = "mongodb+srv://kittyparkar1230_db_user:wBjGBNdcvNXbRwiA@cluster0.fklsc5u.mongodb.net/job_portal?retryWrites=true&w=majority";

async function testBookmarkPersistence() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const usersCol = db.collection("users");
  const studentsCol = db.collection("students");
  const jobsCol = db.collection("jobs");

  const studentUser = await usersCol.findOne({ role: "student" });
  const student = await studentsCol.findOne({ userId: studentUser._id });
  const job = await jobsCol.findOne({ status: "published" });

  console.log("Testing Bookmark Persistence for:");
  console.log("Student:", studentUser.name, "(ID:", student._id, ")");
  console.log("Job:", job.title, "(ID:", job._id, ")");

  // Test 1: Add bookmark
  await studentsCol.updateOne(
    { _id: student._id },
    { $addToSet: { savedJobs: job._id } }
  );
  let updated = await studentsCol.findOne({ _id: student._id });
  let savedIds = (updated.savedJobs || []).map(id => id.toString());
  console.log("Added bookmark. Saved jobs count:", savedIds.length, "Includes job:", savedIds.includes(job._id.toString()));

  if (!savedIds.includes(job._id.toString())) {
    throw new Error("Failed to save job into database");
  }

  // Test 2: Remove bookmark
  await studentsCol.updateOne(
    { _id: student._id },
    { $pull: { savedJobs: job._id } }
  );
  updated = await studentsCol.findOne({ _id: student._id });
  savedIds = (updated.savedJobs || []).map(id => id.toString());
  console.log("Removed bookmark. Saved jobs count:", savedIds.length, "Includes job:", savedIds.includes(job._id.toString()));

  // Add back for user to see in their saved jobs page
  await studentsCol.updateOne(
    { _id: student._id },
    { $addToSet: { savedJobs: job._id } }
  );
  console.log("Bookmark verified and successfully saved in MongoDB Atlas!");
  process.exit(0);
}

testBookmarkPersistence().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
