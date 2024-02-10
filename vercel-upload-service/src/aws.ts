import { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_S3_BUCKET } from "./config";
import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
});

// fileName => output/12312/src/App.jsx
// filePath => /home/jogeshwar/vercel/dist/output/12312/src/App.jsx
export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const s3Bucket = AWS_S3_BUCKET ?? "vercel-data-store";

    const response = await s3
        .upload({
            Body: fileContent,
            Bucket: s3Bucket,
            Key: fileName,
        })
        .promise();

    console.log(`${fileName} uploaded to S3`);
};
