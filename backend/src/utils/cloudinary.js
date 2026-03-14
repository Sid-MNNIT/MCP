import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export async function uploadPdfToCloudinary(buffer, publicId) {
  // config is read here at call-time, not at import-time
  // this ensures dotenv has already loaded the env vars
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id:     publicId,
        overwrite:     true,
        folder:        "",
      },
      (error, result) => {
        if (error) return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}
