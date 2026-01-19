import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided. Please include a file in the form data with key 'file'." },
        { status: 400 },
      );
    }

    // Get file metadata
    const fileName = file.name;
    const fileType = file.type || "application/octet-stream";
    const fileSize = file.size;

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (fileSize > maxSize) {
      return NextResponse.json(
        { message: `File size exceeds maximum limit of ${maxSize / 1024 / 1024}MB` },
        { status: 400 },
      );
    }

    // Generate unique filename to avoid conflicts
    const fileExtension = fileName.split(".").pop() || "";
    const uniqueFileName = `${randomUUID()}.${fileExtension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file to public/uploads directory
    const filePath = join(uploadsDir, uniqueFileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate file URL (accessible via /uploads/filename)
    // In production, you might want to use a full URL like https://yourdomain.com/uploads/filename
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const fileUrl = `${baseUrl}/uploads/${uniqueFileName}`;

    // Return file metadata
    return NextResponse.json({
      success: true,
      fileUrl: fileUrl,
      fileName: fileName,
      fileType: fileType,
      fileSize: fileSize,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { 
        message: "Failed to upload file",
        error: (error as Error).message 
      },
      { status: 500 },
    );
  }
}
