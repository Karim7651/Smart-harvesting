import express from "express";
import { addPicture, getSensorReadings } from "../controllers/sensorReadingController.js";
import upload from "../utils/s3Upload.js";
import apiKeyMiddleware from "../controllers/apiKeyMiddleware.js";

const router = express.Router();

router.post("/picture",apiKeyMiddleware,upload.single("image"),addPicture);

router.get("/:farmId", getSensorReadings);

export default router;
