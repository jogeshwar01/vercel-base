import dotenv from "dotenv";
dotenv.config();

export const UPLOAD_SERVICE_PORT = process.env.UPLOAD_SERVICE_PORT;
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
export const REDIS_FILES_QUEUE = process.env.REDIS_FILES_QUEUE;
export const REDIS_STATUS_OBJECT = process.env.REDIS_STATUS_OBJECT;
