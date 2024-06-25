const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Expense = require('./models/Expense');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database connection
mongoose.connect('mongodb://localhost:27017/money-tracker')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define routes
app.post('/api/expenses', async (req, res) => {
  try {
    const { category, amount, date } = req.body;
    const newExpense = new Expense({ category, amount, date });
    const savedExpense = await newExpense.save();
    res.json(savedExpense);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Error adding expense' });
  }
});

app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Error fetching expenses' });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    console.log("Deleting expense with ID:", req.params.id); // Log the ID
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Error deleting expense' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
