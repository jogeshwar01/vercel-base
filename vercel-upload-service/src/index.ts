import express, { Request, Response } from 'express';
import cors from 'cors'
import path from 'path'
import { generate } from './utils'
import { getAllFiles } from './file';
import simpleGit from 'simple-git';
import dotenv from 'dotenv';
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.UPLOAD_SERVICE_PORT;

app.post('/upload', async (req: Request,res: Response) => {
    const id = generate()

    await simpleGit().clone(req.body.repoUrl, path.join(__dirname,`/output/${id}`))

    const files = getAllFiles(path.join(__dirname,`/output/${id}`))
    console.log(files)

    res.json({
        id : id
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})