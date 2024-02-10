import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.UPLOAD_SERVICE_PORT;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})