import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { UploadedFile } from "@/models/UploadedFile";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    if (!filename) {
      return NextResponse.json({ error: "Filename required" }, { status: 400 });
    }

    await connectToDatabase();
    const fileDoc = await UploadedFile.findOne({ fileName: filename });

    if (!fileDoc) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", fileDoc.mimeType || "application/octet-stream");
    headers.set("Content-Length", fileDoc.size.toString());
    headers.set(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(fileDoc.originalName)}"`
    );
    // Cache for performance
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(fileDoc.data, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("Error serving uploaded file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
