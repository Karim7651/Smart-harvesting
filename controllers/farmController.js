import Farm from "../models/farmModel.js";
import User from "../models/userModel.js"
export const getAllFarms = async (req, res) => {
  try {
    const farms = await Farm.find().populate("sensorReadings");
    res.status(200).json({ status: "success", data: { farms } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

export const getFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id).populate("sensorReadings");
    if (!farm) {
      return res.status(404).json({ status: "fail", message: "Farm not found" });
    }
    res.status(200).json({ status: "success", data: { farm } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

export const createFarm = async (req, res) => {
  try {
    // Call the static method on Farm model
    const { farm, plainApiKey } = await Farm.createFarmWithApiKey(req.body);

    // Add the farm to the user's farms array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { farms: farm._id } },
      { new: true }
    );

    res.status(201).json({
      status: "success",
      data: {
        farm,
        apiKey: plainApiKey, // Only returned once
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};



export const updateFarm = async (req, res) => {
  try {
    const farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!farm) {
      return res.status(404).json({ status: "fail", message: "Farm not found" });
    }
    res.status(200).json({ status: "success", data: { farm } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

export const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    if (!farm) {
      return res.status(404).json({ status: "fail", message: "Farm not found" });
    }
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
