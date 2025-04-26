import Farm from "../models/farmModel.js";
import catchAsync from "../utils/catchAsync.js";
//apiKey as header
const apiKeyMiddleware = catchAsync(async (req, res, next) => {
  const apiKey = req.headers['apikey'];
  if (!apiKey) {
    return res.status(400).json({ message: "API key is required" });
  }

  const farm = await Farm.findFarmByApiKey(apiKey);

  if (!farm) {
    return res.status(403).json({ message: "Invalid API key" });
  }

  req.farm = farm;
  next();
});

export default apiKeyMiddleware;
