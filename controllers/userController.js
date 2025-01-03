import APIFeatures from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import { getOne } from "./handlerFactory.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
export const getUser = getOne(User);
export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  //only allow those fields to be updated
  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "address",
    "mobileNumber"
  );
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: "success", data: null });
});
