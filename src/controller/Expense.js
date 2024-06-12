const { expenseModel } = require("../models/ExpenseModel");
const mongoose = require("mongoose");
async function addExpense(req, res) {
  const { title, amount, userDate, notes } = req.body;
  try {
    const newExpense = new expenseModel({
      title,
      amount,
      date: new Date(),
      userDate,
      notes,
      userId: req.user._id,
    });
    await newExpense.save();
    res.status(200).json({ message: "Expense added successfully" });
  } catch (error) {
    console.log(error);
  }
}
async function getRecentExpense(req, res) {
  try {
    const recentExpenses = await expenseModel
      .find({ userId: req.user._id })
      .sort({ date: -1 });
    res.status(200).json({
      message: "Recent expenses fetched successfully",
      recentExpenses,
    });
  } catch (error) {
    console.log(error);
  }
}
async function getExpenseTotal(req, res) {
  try {
    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);

    // Check if there are any expenses for this user
    const expenses = await expenseModel.find({ userId: userObjectId });

    if (expenses.length === 0) {
      return res
        .status(200)
        .json({ message: "Total fetched successfully", total: 0 });
    }

    // Aggregate to get the total amount
    const total = await expenseModel.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    const { totalAmount } = total[0];

    res
      .status(200)
      .json({ message: "Total fetched successfully", total: totalAmount });
  } catch (error) {
    console.error("Error fetching total:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
}
async function getTopExpenses(req, res) {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);
    //get all expenses and sort by amount then limit to 5
    const topExpenses = await expenseModel
      .find({ userId: userObjectId })
      .sort({ amount: -1 })
      .limit(5);
    console.log(topExpenses);
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  addExpense,
  getRecentExpense,
  getExpenseTotal,
  getTopExpenses,
};
