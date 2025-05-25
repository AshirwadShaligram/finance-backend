import Transaction from "../models/Transaction.js";
import Account from "../models/Accounts.js";
import asyncHandler from "express-async-handler";

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id })
    .populate("category", "name type color")
    .populate("account", "name color");
  res.json(transactions);
});

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = asyncHandler(async (req, res) => {
  const { amount, description, date, type, category, account } = req.body;

  const transaction = new Transaction({
    user: req.user._id,
    amount,
    description,
    date,
    type,
    category,
    account,
  });

  // Update account balance
  const accountToUpdate = await Account.findById(account);
  if (!accountToUpdate) {
    res.status(404);
    throw new Error("Account not found");
  }

  if (type === "income") {
    accountToUpdate.balance += amount;
  } else {
    accountToUpdate.balance -= amount;
  }

  await accountToUpdate.save();
  const createdTransaction = await transaction.save();
  res.status(201).json(createdTransaction);
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = asyncHandler(async (req, res) => {
  const { amount, description, date, type, category, account } = req.body;

  const transaction = await Transaction.findById(req.params.id);

  if (transaction && transaction.user.toString() === req.user._id.toString()) {
    // First, revert the old transaction's effect on the account
    const oldAccount = await Account.findById(transaction.account);
    if (oldAccount) {
      if (transaction.type === "income") {
        oldAccount.balance -= transaction.amount;
      } else {
        oldAccount.balance += transaction.amount;
      }
      await oldAccount.save();
    }

    // Update transaction
    transaction.amount = amount || transaction.amount;
    transaction.description = description || transaction.description;
    transaction.date = date || transaction.date;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.account = account || transaction.account;

    // Apply new transaction's effect on the account
    const newAccount = await Account.findById(transaction.account);
    if (newAccount) {
      if (transaction.type === "income") {
        newAccount.balance += transaction.amount;
      } else {
        newAccount.balance -= transaction.amount;
      }
      await newAccount.save();
    }

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } else {
    res.status(404);
    throw new Error("Transaction not found");
  }
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (transaction && transaction.user.toString() === req.user._id.toString()) {
    // Revert the transaction's effect on the account
    const account = await Account.findById(transaction.account);
    if (account) {
      if (transaction.type === "income") {
        account.balance -= transaction.amount;
      } else {
        account.balance += transaction.amount;
      }
      await account.save();
    }

    await transaction.remove();
    res.json({ message: "Transaction removed" });
  } else {
    res.status(404);
    throw new Error("Transaction not found");
  }
});

// @desc    Get financial summary
// @route   GET /api/transactions/summary
// @access  Private
export const getFinancialSummary = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  res.json({
    totalIncome,
    totalExpense,
    netBalance,
  });
});
