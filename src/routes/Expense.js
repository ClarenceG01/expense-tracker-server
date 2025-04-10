const { addExpense, getDashboardData } = require("../controller/Expense");
const { authenticateSession } = require("../middleware/authenticate");

const expenseRoute = require("express").Router();

expenseRoute.post("/expense", authenticateSession, addExpense);

expenseRoute.get("/dashboard", authenticateSession, getDashboardData);

module.exports = { expenseRoute };
