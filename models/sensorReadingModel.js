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
    type: String,
  },
  humidity: {
    type: String,
  },
  pH: {
    type: Number,
  },
  moisture: {
    type: String,
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farm",
    required: true,
  },
  imageURL:{
    type:String,
  },
});

// Create an index on the 'farm' field for faster querying
sensorReadingSchema.index({ farm: 1 });

const SensorReading = mongoose.model("SensorReading", sensorReadingSchema);

export default SensorReading;
