import dotenv from "dotenv";
dotenv.config();

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

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`"server is running at http://localhost:${PORT}`)
})