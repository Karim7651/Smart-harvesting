import express from "express";
import { createSensorReading, getSensorReadings } from "../controllers/sensorReadingController.js"; // Import the controller functions

const router = express.Router();

// POST route to add sensor reading to a specific farm
router.post("/:farmId", createSensorReading);

// GET route to get all sensor readings for a specific farm
router.get("/:farmId", getSensorReadings);

export default router;
