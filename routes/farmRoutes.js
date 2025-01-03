import express from "express";
import {
  getAllFarms,
  getFarm,
  createFarm,
  updateFarm,
  deleteFarm,
} from "../controllers/farmController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Routes
router
  .route("/")
  .get(getAllFarms)
  .post(restrictTo("admin", "owner"), createFarm);

router
  .route("/:id")
  .get(getFarm)
  .patch(restrictTo("admin", "owner"), updateFarm)
  .delete(restrictTo("admin"), deleteFarm);

export default router;
