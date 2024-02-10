import { UPLOAD_SERVICE_PORT } from "./config";
import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { generate } from "./utils";
import { getAllFiles } from "./file";
import simpleGit from "simple-git";
import { uploadFile } from "./aws";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/upload", async (req: Request, res: Response) => {
    const id = generate();

    await simpleGit().clone(
        req.body.repoUrl,
        path.join(__dirname, `/output/${id}`)
    );

    const files = getAllFiles(path.join(__dirname, `/output/${id}`));

    files.forEach(async (file) => {
        await uploadFile(file.slice(__dirname.length + 1), file);
    });

    res.json({
        id: id,
    });
});

app.listen(UPLOAD_SERVICE_PORT, () => {
    console.log(`Listening on port ${UPLOAD_SERVICE_PORT}`);
});
