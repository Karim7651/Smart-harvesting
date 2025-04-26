import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import catchAsync from "./catchAsync.js";
dotenv.config({ path: "./config.env" });


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


const storage = multer.memoryStorage();
const upload = multer({ storage });
export const uploadToS3 = async (file) => {
  console.log("uploading image ....")
  try {
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `images/${Date.now().toString()}-${file.originalname}`, 
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const data = await s3.send(new PutObjectCommand(uploadParams));
    return {
      Location: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`,
    };
  } catch (error) {
    console.error("Error uploading to S3", error);
    throw new Error("Failed to upload file to S3");
  }
};

export default upload;
