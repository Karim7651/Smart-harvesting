import { mongoose } from "mongoose";

const sensorReadingSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  region: {
    type: Number,
  },
  temperature: {
    type: String, // You can use String or Number depending on the format you expect (e.g., "30C" or 30).
  },
  humidity: {
    type: String, // Similarly, String or Number based on your data format.
  },
  pH: {
    type: Number, // Assuming pH is a numeric value (e.g., 7.0).
  },
  moisture: {
    type: String, // Or Number depending on the format.
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farm",
    required: true,
  }, // Reference to Farm
  Diseases: {
    type: [String], // Array of strings for storing disease names
    default: [], // Default to an empty array
  },
  isRipe: {
    type: Boolean, // Boolean field for ripeness status
    default: false, // Default to false
  },
});

// Create an index on the 'farm' field for faster querying
sensorReadingSchema.index({ farm: 1 });

const SensorReading = mongoose.model("SensorReading", sensorReadingSchema);

export default SensorReading;
