import SensorReading from "../models/sensorReadingModel.js"; // Import SensorReading model
import Farm from "../models/farmModel.js"; // Import Farm model

// Controller to add sensor readings to a specific farm
export const createSensorReading = async (req, res) => {
  try {
    const { farmId } = req.params;

    // Check if the farm exists
    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({
        status: "fail",
        message: "Farm not found",
      });
    }

    // Create a new sensor reading and associate it with the farm
    const sensorReading = new SensorReading({
      temperature: req.body.temperature,
      humidity: req.body.humidity,
      pH: req.body.pH,
      moisture: req.body.moisture,
      farm: farmId,
    });

    await sensorReading.save();

    res.status(201).json({
      status: "success",
      data: { sensorReading },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Controller to get all sensor readings for a specific farm
export const getSensorReadings = async (req, res) => {
  try {
    const { farmId } = req.params;

    // Fetch sensor readings associated with the farm
    const sensorReadings = await SensorReading.find({ farm: farmId });

    if (sensorReadings.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No sensor readings found for this farm",
      });
    }

    res.status(200).json({
      status: "success",
      data: { sensorReadings },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};