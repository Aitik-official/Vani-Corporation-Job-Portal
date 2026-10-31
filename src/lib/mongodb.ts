import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/job_portal";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    // Ensure all core models are registered even on reused cached connections
    await registerModels();
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    await registerModels();
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

async function registerModels() {
  // Eagerly import all Mongoose models so relations and deep populates
  // never fail with "Schema hasn't been registered for model" in serverless environments
  await import("@/models/User");
  await import("@/models/Company");
  await import("@/models/Student");
  await import("@/models/Job");
  await import("@/models/Application");
  await import("@/models/Notification");
  await import("@/models/UploadedFile");
}
