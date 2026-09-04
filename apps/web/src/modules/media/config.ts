import * as AWS from "@aws-sdk/client-s3";

export const s3Config = {
  region: "auto",
  bucket: process.env.NEXT_PUBLIC_R2_BUCKET!,
  endpoint: `https://${process.env.NEXT_PUBLIC_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  baseUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL || `https://${process.env.NEXT_PUBLIC_R2_BUCKET}.r2.cloudflarestorage.com`
};

// Singleton S3 client instance
export const s3Client = new AWS.S3({
  region: s3Config.region,
  endpoint: s3Config.endpoint,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY!
  }
});
