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
      userId: req.user.id,
    });
    await newExpense.save();
    res.status(200).json({ message: "Expense added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getDashboardData(req, res) {
  try {
    // Total expenses
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);
    // Check if there are any expenses for this user
    const expenses = await expenseModel.find({ userId: userObjectId });
    let totalExpenses;
    if (expenses.length === 0) {
      totalExpenses = 0; // Set to 0 when no expenses
    } else {
      // Aggregate to get the total amount
      const total = await expenseModel.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]);
      // Assign the totalAmount value to totalExpenses
      totalExpenses = total.length > 0 ? total[0].totalAmount : 0;
    }
    // top expenses
    const topExpenses = await expenseModel
      .find({ userId: userObjectId })
      .sort({ amount: -1 })
      .limit(5);
    // recent expenses
    const recentExpenses = await expenseModel
      .find({ userId: userObjectId })
      .sort({ date: -1 })
      .limit(5);
    res.status(200).json({
      message: "Dashboard data fetched successfully",
      total: totalExpenses,
      topExpenses,
      recentExpenses,
      username: req.user.username,
    });
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  addExpense,
  getDashboardData,
};
