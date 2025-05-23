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
    select:false,
  },
  
});
sensorReadingSchema.pre("find", function (next) {
  this.populate("farm", "name"); // populate only the 'name' field from Farm
  next();
});
//faster query
//i didn't index timestamp as this will give a hit on performance (write heavy database)
sensorReadingSchema.index({ farm: 1 });

const SensorReading = mongoose.model("SensorReading", sensorReadingSchema);

export default SensorReading;
