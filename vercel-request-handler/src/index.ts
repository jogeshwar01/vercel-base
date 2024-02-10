import {
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    AWS_S3_BUCKET,
    UPLOAD_SERVICE_PORT,
} from "./config";
import express from "express";
import { S3 } from "aws-sdk";

const s3 = new S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
});

const app = express();

app.get("/*", async (req, res) => {
    // <id>.vercel.com
    const host = req.hostname;

    const id = host.split(".")[0];
    const filePath = req.path;

    const contents = await s3
        .getObject({
            Bucket: AWS_S3_BUCKET ?? "vercel-data-store",
            Key: `dist/${id}${filePath}`,
        })
        .promise();

    const type = filePath.endsWith("html")
        ? "text/html"
        : filePath.endsWith("css")
        ? "text/css"
        : "application/javascript";
    res.set("Content-Type", type);

    res.send(contents.Body);
});

app.listen(UPLOAD_SERVICE_PORT);
