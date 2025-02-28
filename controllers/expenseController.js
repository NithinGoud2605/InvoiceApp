// controllers/expenseController.js
const { Expense } = require('../models');

exports.getAllExpenses = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('❌ Error: Missing userId in request.');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.id;
    console.log(`✅ Fetching expenses for user: ${userId}`);

    const expenses = await Expense.findAll({ where: { userId } });
    return res.json({ expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTotalExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const total = await Expense.sum('amount', { where: { userId } });
    return res.json({ total: total || 0 });
  } catch (error) {
    console.error('Error fetching total expenses:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAggregatedExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.findAll({
      where: { userId },
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['month'],
      raw: true
    });

    const aggregated = expenses.reduce((acc, curr) => {
      acc[curr.month] = parseFloat(curr.total) || 0;
      return acc;
    }, {});
    return res.json(aggregated);
  } catch (error) {
    console.error('Error fetching aggregated expenses:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, date, category } = req.body;

    const newExpense = await Expense.create({
      userId,
      amount,
      date,
      category,
    });

    return res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { amount, date, category } = req.body;

    const expense = await Expense.findOne({ where: { id, userId } });
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (amount !== undefined) expense.amount = amount;
    if (date !== undefined) expense.date = date;
    if (category !== undefined) expense.category = category;

    await expense.save();
    return res.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const expense = await Expense.findOne({ where: { id, userId } });
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await expense.destroy();
    return res.json({ message: `Expense ${id} deleted` });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};