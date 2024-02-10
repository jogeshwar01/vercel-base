import {
    UPLOAD_SERVICE_PORT,
    REDIS_FILES_QUEUE,
    REDIS_STATUS_OBJECT,
} from "./config";
import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { generate } from "./utils";
import { getAllFiles } from "./file";
import simpleGit from "simple-git";
import { uploadFile } from "./aws";
import { createClient } from "redis";
const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req: Request, res: Response) => {
    const id = generate();

    await simpleGit().clone(
        req.body.repoUrl,
        path.join(__dirname, `/output/${id}`)
    );

    const files = getAllFiles(path.join(__dirname, `/output/${id}`));

    files.forEach(async (file) => {
        await uploadFile(file.slice(__dirname.length + 1), file);
    });

    await new Promise((resolve): any => setTimeout(resolve, 10000));

    publisher.lPush(REDIS_FILES_QUEUE ?? "build-queue", id);

    publisher.hSet(REDIS_STATUS_OBJECT ?? "status", id, "uploaded");

    res.json({
        id: id,
    });
});

app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet(
        REDIS_STATUS_OBJECT ?? "status",
        id as string
    );
    res.json({
        status: response,
    });
});

app.listen(UPLOAD_SERVICE_PORT, () => {
    console.log(`Listening on port ${UPLOAD_SERVICE_PORT}`);
});
