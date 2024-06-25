import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = () => {
    axios.get('https://money-8cby.onrender.com/api/expenses')
      .then(res => {
        setExpenses(res.data);
        calculateTotalAmount(res.data);
      })
      .catch(err => console.log(err));
  };

  const calculateTotalAmount = (expenses) => {
    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    setTotalAmount(total);
  };

  const addExpense = () => {
    const newExpense = { category, amount, date };
    axios.post('https://money-8cby.onrender.com/api/expenses', newExpense)
      .then(res => {
        setExpenses([...expenses, res.data]);
        calculateTotalAmount([...expenses, res.data]);
        resetForm();
      })
      .catch(err => console.log(err));
  };

  const deleteExpense = (id) => {
    axios.delete(`https://money-8cby.onrender.com/api/expenses/${id}`)
      .then(() => {
        setExpenses(prevExpenses => {
          const updatedExpenses = prevExpenses.filter(expense => expense._id !== id);
          calculateTotalAmount(updatedExpenses);
          return updatedExpenses;
        });
      })
      .catch(error => {
        console.error('Error deleting expense:', error);
      });
  };
  
  

  const resetForm = () => {
    setCategory('');
    setAmount(0);
    setDate('');
  };

  return (
    <div>
      <h1>Money Tracker Web App</h1>
      <div className="input-section">
        <label htmlFor="category-select">Category:</label>
        <select id="category-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="College Fee">College Fee</option>
          <option value="Rent">Rent</option>
          <option value="Transport">Transport</option>
          <option value="Food">Food</option>
          <option value="Shopping">Shopping</option>
          <option value="Cool Drinks">Cool Drinks</option>
        </select>
        <label htmlFor="amount-input">Amount:</label>
        <input type="number" id="amount-input" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <label htmlFor="date-input">Date:</label>
        <input type="date" id="date-input" value={date} onChange={(e) => setDate(e.target.value)} />
        <button id="add-btn" onClick={addExpense}>Add</button>
      </div>
      <div className="expenses-list">
        <h2>Expenses List</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody id="expense-table-body">
            {expenses.map(expense => (
              <tr key={expense._id}>
                <td>{expense.category}</td>
                <td>{expense.amount}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td><button onClick={() => deleteExpense(expense._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total:</td>
              <td id="total-amount">{totalAmount}</td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default App;
