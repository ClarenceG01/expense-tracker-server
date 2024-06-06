const { addExpense } = require("../controller/Expense");
const { authenticateToken } = require("../middleware/authenticate");

const expenseRoute = require("express").Router();

expenseRoute.post("/expense", authenticateToken, addExpense);

module.exports = { expenseRoute };
