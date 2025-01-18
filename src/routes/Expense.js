const {
  addExpense,
  getDashboardData,
} = require("../controller/Expense");
const { authenticateToken } = require("../middleware/authenticate");

const expenseRoute = require("express").Router();

expenseRoute.post("/expense", authenticateToken, addExpense);

expenseRoute.get("/dashboard", authenticateToken, getDashboardData);

module.exports = { expenseRoute };
