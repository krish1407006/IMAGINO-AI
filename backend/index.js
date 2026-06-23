import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, ".env") });

import express from "express";
import cors from "cors";
import imageRoute from "./routes/image.route.js";
const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/v1" , imageRoute);
const image = async (req, res) => {
}
export { image };
// const PORT = 8000

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=>{
    console.log(`"server is running at http://localhost:${PORT}`)
})