import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ secure: true });

const streamUpload = (buffer: Buffer): Promise<{ public_id: string; secure_url: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
      if (error) {
        return reject(error);
      }
      if (!result) {
        return reject(new Error("Cloudinary upload returned no result."));
      }
      return resolve({ public_id: result.public_id, secure_url: result.secure_url });
    });

    stream.end(buffer);
  });
};

export { cloudinary, streamUpload };
