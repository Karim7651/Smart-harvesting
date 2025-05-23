import { mongoose } from "mongoose";
import crypto from "crypto";

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Farm name is required"],
  },
  crop: {
    type: String,
    required: [true, "Farm crop is required"],
  },
  apiKey: {
    type: String,
    required: true,
    unique: true,
    select: false,
    index: true,
  },
  regions: [{
  number: Number,
  name: String,
  description: String
}],
});

//don't store plain api key
farmSchema.statics.createFarmWithApiKey = async function (farmData) {
  const rawKey = crypto.randomBytes(32).toString("hex");
  const hashedKey = crypto.createHash("sha256").update(rawKey).digest("hex");

  const farm = await this.create({
    ...farmData,
    apiKey: hashedKey,
  });
  farm.apiKey = undefined
  return { farm, plainApiKey: rawKey };
};

farmSchema.statics.findFarmByApiKey = async function (plainApiKey) {
  const hashedKey = crypto.createHash("sha256").update(plainApiKey).digest("hex");
  const farm = await this.findOne({ apiKey: hashedKey });
  return farm;
};

const Farm = mongoose.model("Farm", farmSchema);
export default Farm;
