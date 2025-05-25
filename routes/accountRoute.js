import express from "express";
const router = express.Router();
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../controller/accountController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").get(protect, getAccounts).post(protect, createAccount);
router.route("/:id").put(protect, updateAccount).delete(protect, deleteAccount);

export default router;
