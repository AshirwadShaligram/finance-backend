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

  // Update account current balance
  const accountToUpdate = await Account.findById(account);
  if (!accountToUpdate) {
    res.status(404);
    throw new Error("Account not found");
  }

  // Initialize currentBalance if it doesn't exist
  if (accountToUpdate.currentBalance === undefined) {
    accountToUpdate.currentBalance = accountToUpdate.balance;
  }

  if (type === "income") {
    accountToUpdate.currentBalance += amount;
  } else if (type === "expense") {
    accountToUpdate.currentBalance -= amount;
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
    // First, revert the old transaction's effect on the old account
    const oldAccount = await Account.findById(transaction.account);
    if (oldAccount) {
      // Initialize currentBalance if it doesn't exist
      if (oldAccount.currentBalance === undefined) {
        oldAccount.currentBalance = oldAccount.balance;
      }

      if (transaction.type === "income") {
        oldAccount.currentBalance -= transaction.amount;
      } else if (transaction.type === "expense") {
        oldAccount.currentBalance += transaction.amount;
      }
      await oldAccount.save();
    }

    // Update transaction fields
    transaction.amount = amount || transaction.amount;
    transaction.description = description || transaction.description;
    transaction.date = date || transaction.date;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.account = account || transaction.account;

    // Apply new transaction's effect on the new account (could be same or different)
    const newAccount = await Account.findById(transaction.account);
    if (newAccount) {
      // Initialize currentBalance if it doesn't exist
      if (newAccount.currentBalance === undefined) {
        newAccount.currentBalance = newAccount.balance;
      }

      if (transaction.type === "income") {
        newAccount.currentBalance += transaction.amount;
      } else if (transaction.type === "expense") {
        newAccount.currentBalance -= transaction.amount;
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
      // Initialize currentBalance if it doesn't exist
      if (account.currentBalance === undefined) {
        account.currentBalance = account.balance;
      }

      if (transaction.type === "income") {
        account.currentBalance -= transaction.amount;
      } else if (transaction.type === "expense") {
        account.currentBalance += transaction.amount;
      }
      await account.save();
    }

    await transaction.deleteOne();
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
  const accounts = await Account.find({ user: req.user._id });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Total initial balance across all accounts
  const totalInitialBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  // Net balance is simply the sum of all current account balances
  const netBalance = accounts.reduce((sum, a) => {
    const currentBalance =
      a.currentBalance !== undefined ? a.currentBalance : a.balance;
    return sum + currentBalance;
  }, 0);

  res.json({
    totalIncome,
    totalExpense,
    netBalance, // This is the sum of all current account balances
    totalInitialBalance,
    accounts: accounts.map((account) => ({
      id: account._id,
      name: account.name,
      initialBalance: account.balance,
      currentBalance:
        account.currentBalance !== undefined
          ? account.currentBalance
          : account.balance,
      color: account.color,
    })),
  });
});
