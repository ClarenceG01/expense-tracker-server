const {
  addExpense,
  getRecentExpense,
  getExpenseTotal,
  getTopExpenses,
} = require("../controller/Expense");
const { authenticateToken } = require("../middleware/authenticate");

const expenseRoute = require("express").Router();

expenseRoute.post("/expense", authenticateToken, addExpense);
expenseRoute.get("/expense", authenticateToken, getRecentExpense);
expenseRoute.get("/total", authenticateToken, getExpenseTotal);
expenseRoute.get("/top", authenticateToken, getTopExpenses);

module.exports = { expenseRoute };
