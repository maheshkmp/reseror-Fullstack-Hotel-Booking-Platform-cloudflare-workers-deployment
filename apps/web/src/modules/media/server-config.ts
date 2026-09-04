import * as AWS from "@aws-sdk/client-s3";

export const r2ServerConfig = {
  region: "auto",
  bucket: process.env.R2_BUCKET || process.env.NEXT_PUBLIC_R2_BUCKET!,
  endpoint: `https://${process.env.R2_ACCOUNT_ID || process.env.NEXT_PUBLIC_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  baseUrl: process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL || `https://${process.env.NEXT_PUBLIC_R2_BUCKET}.r2.cloudflarestorage.com`
};

export const r2ServerClient = new AWS.S3({
  region: r2ServerConfig.region,
  endpoint: r2ServerConfig.endpoint,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY!
  }
});
