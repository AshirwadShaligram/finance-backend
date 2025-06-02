import express from "express";
const router = express.Router();
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getFinancialSummary,
} from "../controller/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(protect, getTransactions)
  .post(protect, createTransaction);
router.get("/summary", protect, getFinancialSummary);
router
  .route("/:id")
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

export default router;
