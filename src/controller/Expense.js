const { expenseModel } = require("../models/ExpenseModel");
async function addExpense(req, res) {
  const { title, amount, date, category, notes } = req.body;
  try {
    const newExpense = new expenseModel({
      title,
      amount,
      date: new Date(),
      category,
      notes,
      userId: req.user._id,
    });
    await newExpense.save();
    res.status(200).json({ message: "Expense added successfully" });
  } catch (error) {
    console.log(error);
  }
}
module.exports = { addExpense };
