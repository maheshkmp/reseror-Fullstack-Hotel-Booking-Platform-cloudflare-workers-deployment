import { NextRequest, NextResponse } from "next/server";
import { Upload } from "@aws-sdk/lib-storage";
import sharp from "sharp";
import { r2ServerClient, r2ServerConfig } from "@/modules/media/server-config";
import { generateUniqueFileName, getMediaType } from "@/modules/media/utils";

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

    let body: Buffer | ReadableStream = file.stream();
    let finalContentType = fileType;

    // Optimization for images
    if (fileType.startsWith("image/") && !fileType.includes("svg")) {
      console.log("Optimizing image...");
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Convert to WebP and resize if too large
        const optimizedBuffer = await sharp(buffer)
          .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        body = optimizedBuffer;
        finalContentType = "image/webp";
        console.log("Image optimized successfully");
      } catch (sharpError) {
        console.error("Sharp optimization failed, falling back to original file:", sharpError);
        // Fallback to original stream
        body = file.stream();
        finalContentType = fileType;
      }
    }

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
