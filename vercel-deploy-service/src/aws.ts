import { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_S3_BUCKET } from "./config";
import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";

const s3 = new S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
});

// output/asdasd
export async function downloadS3Folder(prefix: string) {
    const allFiles = await s3
        .listObjectsV2({
            Bucket: AWS_S3_BUCKET ?? "vercel-data-store",
            Prefix: prefix,
        })
        .promise();

    const allPromises =
        allFiles.Contents?.map(async ({ Key }) => {
            return new Promise(async (resolve) => {
                if (!Key) {
                    resolve("");
                    return;
                }
                const finalOutputPath = path.join(__dirname, Key);
                const outputFile = fs.createWriteStream(finalOutputPath);
                const dirName = path.dirname(finalOutputPath);
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName, { recursive: true });
                }
                s3.getObject({
                    Bucket: AWS_S3_BUCKET ?? "vercel-data-store",
                    Key,
                })
                    .createReadStream()
                    .pipe(outputFile)
                    .on("finish", () => {
                        resolve("");
                    });
            });
        }) || [];
    console.log("awaiting");

    await Promise.all(allPromises?.filter((x) => x !== undefined));
}
