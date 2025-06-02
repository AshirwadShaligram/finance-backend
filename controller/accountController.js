import asyncHandler from "express-async-handler";
import Account from "../models/Accounts.js";
import Transaction from "../models/Transaction.js";

// @desc    Get all accounts
// @route   GET /api/accounts
// @access  Private
export const getAccounts = asyncHandler(async (req, res) => {
  const accounts = await Account.find({ user: req.user._id });
  res.json(accounts);
});

// @desc    Create a new account
// @route   POST /api/accounts
// @access  Private
export const createAccount = asyncHandler(async (req, res) => {
  const { name, balance, color } = req.body;

  const account = new Account({
    user: req.user._id,
    name,
    balance, // Initial balance
    currentBalance: balance, // Set currentBalance to initial balance
    color,
  });

  const createdAccount = await account.save();
  res.status(201).json(createdAccount);
});

// @desc    Update account
// @route   PUT /api/accounts/:id
// @access  Private
export const updateAccount = asyncHandler(async (req, res) => {
  const { name, balance, color } = req.body;

  const account = await Account.findById(req.params.id);

  if (account && account.user.toString() === req.user._id.toString()) {
    // If balance is being updated, we need to adjust currentBalance too
    if (balance !== undefined && balance !== account.balance) {
      const balanceDifference = balance - account.balance;
      account.currentBalance =
        (account.currentBalance || account.balance) + balanceDifference;
      account.balance = balance;
    }

    account.name = name || account.name;
    account.color = color || account.color;

    const updatedAccount = await account.save();
    res.json(updatedAccount);
  } else {
    res.status(404);
    throw new Error("Account not found");
  }
});

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private
export const deleteAccount = asyncHandler(async (req, res) => {
  const account = await Account.findById(req.params.id);

  if (account && account.user.toString() === req.user._id.toString()) {
    // Check if account has transactions
    const hasTransactions = await Transaction.exists({ account: account._id });

    if (hasTransactions) {
      res.status(400);
      throw new Error("Cannot delete account with transactions");
    }

    await account.deleteOne();
    res.json({ message: "Account removed" });
  } else {
    res.status(404);
    throw new Error("Account not found");
  }
});
