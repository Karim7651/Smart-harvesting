import { mongoose } from "mongoose";
const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Farm name is required"],
  },
  crop:{
    type:String,
    required: [true, "Farm crop is required"],
  }
});
const Farm = mongoose.model("Farm", farmSchema);
export default Farm;
