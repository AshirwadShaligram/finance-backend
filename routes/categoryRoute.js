import express from "express";
const router = express.Router();
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").get(protect, getCategories).post(protect, createCategory);
router
  .route("/:id")
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

export default router;
