import { getClient } from "@/lib/rpc/client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

import { s3Client, s3Config } from "@/modules/media/config";
import type {
  Media,
  MediaUploadType,
  QueryParamsSchema,
  UploadParams
} from "@/modules/media/types";
import {
  generatePresignedUrl,
  generateUniqueFileName,
  getMediaType
} from "@/modules/media/utils";

export class MediaService {
  private static instance: MediaService;

  private constructor() {}

  static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }

    return MediaService.instance;
  }

  async uploadFile({
    file,
    path = "",
    onProgress,
    onStatus
  }: UploadParams): Promise<Media> {
    return new Promise((resolve, reject) => {
      onStatus?.("Optimizing...");
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", path);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          onStatus?.("Uploading...");
          const percentage = (event.loaded / event.total) * 100;
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage,
            key: file.name
          });
        }
      });

      xhr.addEventListener("load", async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const optimizedMedia = JSON.parse(xhr.responseText);
            onStatus?.("Saving...");

            const mediaData: MediaUploadType = {
              url: optimizedMedia.url,
              type: optimizedMedia.type,
              filename: optimizedMedia.filename,
              size: optimizedMedia.size
            };

            const rpcClient = await getClient();
            const createdRes = await rpcClient.api.media.$post({
              json: mediaData
            });

            if (!createdRes.ok) {
              const { message } = await createdRes.json();
              reject(new Error(message));
              return;
            }

            const createdMedia = await createdRes.json();
            resolve({
              ...createdMedia,
              createdAt: new Date(createdMedia.createdAt),
              updatedAt: createdMedia?.updatedAt
                ? new Date(createdMedia.updatedAt)
                : null
            });
          } catch (error) {
            reject(error);
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.message || "Upload failed"));
          } catch {
            reject(new Error("Upload failed"));
          }
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.open("POST", "/api/media/upload");
      xhr.send(formData);
    });
  }

  async deleteFile(id: string) {
    // Step 1: Get media details to know the S3 key
    const rpcClient = await getClient();

    const media = await rpcClient.api.media[":id"].$get({
      param: { id }
    });

    // Step 2: Delete from S3
    const key = this.extractKeyFromUrl(media.url);
    await this.deleteS3File(key);

    // Step 3: Delete from database
    const deleteRes = await rpcClient.api.media[":id"].$delete({
      param: { id }
    });

    if (!deleteRes.ok) {
      const { message } = await deleteRes.json();
      throw new Error(message);
    }

    return await deleteRes.json();
  }

  private async deleteS3File(key: string): Promise<void> {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: s3Config.bucket,
        Key: key
      })
    );
  }

  private extractKeyFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // The key is the pathname after the leading slash
      return decodeURIComponent(
        urlObj.pathname.startsWith("/")
          ? urlObj.pathname.slice(1)
          : urlObj.pathname
      );
    } catch (error) {
      // Fallback for cases where URL might be just a path
      const baseUrlWithoutProtocol = s3Config.baseUrl.replace(/^https?:\/\//, "");
      return url
        .replace(/^https?:\/\//, "")
        .replace(baseUrlWithoutProtocol + "/", "");
    }
  }

  async getPresignedUrl(filename: string, path = ""): Promise<string> {
    const key = path ? `${path}/${filename}` : filename;
    return await generatePresignedUrl(key);
  }

  async getAllMedia(query: QueryParamsSchema) {
    const rpcClient = await getClient();

    const mediaRes = await rpcClient.api.media.$get({
      query: query
    });

    if (!mediaRes.ok) {
      const { message } = await mediaRes.json();
      throw new Error(message);
    }

    return await mediaRes.json();
  }

  async getMediaById(id: string) {
    const rpcClient = await getClient();

    const mediaRes = await rpcClient.api.media[":id"].$get({
      param: { id }
    });

    if (!mediaRes.ok) {
      const { message } = await mediaRes.json();
      throw new Error(message);
    }

    return await mediaRes.json();
  }

  async updateMediaDetails(id: string, body: MediaUploadType) {
    const rpcClient = await getClient();
    const updateRes = await rpcClient.api.media[":id"].$patch({
      param: { id },
      json: body
    });

    if (!updateRes.ok) {
      const { message } = await updateRes.json();
      throw new Error(message);
    }

    const updatedMedia = await updateRes.json();
    return updatedMedia;
  }
}
