import { NextRequest, NextResponse } from "next/server";
import { Upload } from "@aws-sdk/lib-storage";
import { r2ServerClient, r2ServerConfig } from "@/modules/media/server-config";
import { generateUniqueFileName, getMediaType } from "@/modules/media/utils";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const path = formData.get("path") as string || "";

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const fileType = file.type;
    console.log("Upload request received", { filename: file.name, size: file.size, type: fileType });

    const filename = generateUniqueFileName(file.name);
    const key = path ? `${path}/${filename}` : filename;

    const body: ReadableStream = file.stream();
    const finalContentType = fileType;

    console.log("Starting R2 upload...", { key, bucket: r2ServerConfig.bucket, endpoint: r2ServerConfig.endpoint });

    const upload = new Upload({
      client: r2ServerClient,
      params: {
        Bucket: r2ServerConfig.bucket,
        Key: key,
        Body: body,
        ContentType: finalContentType,
        CacheControl: "max-age=31536000"
      }
    });

    const result = await upload.done();
    console.log("R2 upload successful", result);

    const mediaData = {
      url: `${r2ServerConfig.baseUrl}/${result.Key}`,
      type: getMediaType(fileType),
      filename: filename,
      size: body instanceof Buffer ? body.length : file.size,
      contentType: finalContentType
    };

    return NextResponse.json(mediaData);
  } catch (error) {
    console.error("Detailed Upload Error:", error);
    return NextResponse.json(
      { message: "Upload failed", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
