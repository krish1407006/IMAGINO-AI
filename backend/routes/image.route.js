import express from "express";
import { image } from "../controllers/image.controllers.js";

const imageRoute = express.Router();

imageRoute.post("/generate", image );

export default imageRoute;