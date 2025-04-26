import SensorReading from "../models/sensorReadingModel.js";
import Farm from "../models/farmModel.js";
import catchAsync from "../utils/catchAsync.js";
import { uploadToS3 } from "../utils/s3Upload.js"; 

export const addPicture = catchAsync(async (req, res) => {
  // Ensure that we have a file
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // API key validation has already been done by apiKeyMiddleware

  // Upload the file to S3
  const uploadResult = await uploadToS3(req.file);  // Upload to S3 using the uploadToS3 function
  const imageUrl = uploadResult.Location;  // Get the URL of the uploaded image

  // Find the farm using API key (since farmId is not required)
  const farm = await Farm.findFarmByApiKey(req.headers.apikey);
  if (!farm) {
    return res.status(404).json({ message: "Farm not found" });
  }

  // Create a new sensor reading with the image URL
  const newReading = new SensorReading({
    farm: farm._id,
    imageURL: imageUrl,
  });

  await newReading.save(); // Save the new sensor reading

  return res.status(201).json({
    message: "Sensor reading and image uploaded successfully",
    data: newReading,
  });
});


export const getSensorReadings = catchAsync( async(req, res) => {
  try {
    const { farmId } = req.params;
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
});