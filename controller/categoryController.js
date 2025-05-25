import Category from "../models/Category.js";
import Transaction from "../models/Transaction.js";
import asyncHandler from "express-async-handler";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ user: req.user._id });
  res.json(categories);
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
export const createCategory = asyncHandler(async (req, res) => {
  const { name, type, color } = req.body;

  const category = new Category({
    user: req.user._id,
    name,
    type,
    color,
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = asyncHandler(async (req, res) => {
  const { name, type, color } = req.body;

  const category = await Category.findById(req.params.id);

  if (category && category.user.toString() === req.user._id.toString()) {
    category.name = name || category.name;
    category.type = type || category.type;
    category.color = color || category.color;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// @desc    Delete category
// @route   DELETE  /api/categories/:id
// @access  Private
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category && category.user.toString() === req.user._id.toString()) {
    // Check if category has transaction
    const hasTransactions = await Transaction.exists({
      category: category._id,
    });

    if (hasTransactions) {
      res.status(400);
      throw new Error("Cannot delete category with transactions");
    }

    await category.remove();
    res.json({ message: "Category removed" });
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});
