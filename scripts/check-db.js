const mongoose = require("mongoose");

const uri = "mongodb+srv://kittyparkar1230_db_user:wBjGBNdcvNXbRwiA@cluster0.fklsc5u.mongodb.net/job_portal?retryWrites=true&w=majority";

async function inspectDb() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();
  console.log("=== CURRENT COLLECTIONS IN MONGODB ATLAS ===");
  if (collections.length === 0) {
    console.log("No collections created yet.");
  }

  for (const col of collections) {
    const count = await db.collection(col.name).countDocuments();
    const indexes = await db.collection(col.name).indexes();
    console.log(`- Collection: "${col.name}" | Documents: ${count}`);
    indexes.forEach((idx) => {
      console.log(`    Index: ${idx.name} on (${JSON.stringify(idx.key)}) ${idx.unique ? "[UNIQUE]" : ""}`);
    });
  }
  process.exit(0);
}

inspectDb().catch((err) => {
  console.error("Error inspecting database:", err);
  process.exit(1);
});
