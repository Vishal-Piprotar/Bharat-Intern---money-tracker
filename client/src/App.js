import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
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
      .catch(err => {
        console.log(err);
        toast.error('Failed to fetch expenses');
      });
  };

  const calculateTotalAmount = (expenses) => {
    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    setTotalAmount(total);
  };

  const addExpense = () => {
<<<<<<< HEAD
    if (!category || !amount || !date) {
      toast.error('Please fill all fields');
      return;
    }
    const newExpense = { category, amount: parseFloat(amount), date };
=======
    const newExpense = { category, amount, date };
>>>>>>> d020f0c1f0358dd7b6baf2ceecd864ee852f770e
    axios.post('https://money-8cby.onrender.com/api/expenses', newExpense)
      .then(res => {
        setExpenses([...expenses, res.data]);
        calculateTotalAmount([...expenses, res.data]);
        resetForm();
        toast.success('Expense added successfully');
      })
      .catch(err => {
        console.log(err);
        toast.error('Failed to add expense');
      });
  };

  const deleteExpense = (id) => {
    axios.delete(`https://money-8cby.onrender.com/api/expenses/${id}`)
      .then(() => {
        setExpenses(prevExpenses => {
          const updatedExpenses = prevExpenses.filter(expense => expense._id !== id);
          calculateTotalAmount(updatedExpenses);
          return updatedExpenses;
        });
        toast.success('Expense deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting expense:', error);
        toast.error('Failed to delete expense');
      });
  };

  const resetForm = () => {
    setCategory('');
    setAmount('');
    setDate('');
  };

  return (
    <div className="container">
      <h1>Money Tracker Web App</h1>
      <div className="input-section">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="College Fee">College Fee</option>
          <option value="Rent">Rent</option>
          <option value="Transport">Transport</option>
          <option value="Food">Food</option>
          <option value="Shopping">Shopping</option>
          <option value="Cool Drinks">Cool Drinks</option>
        </select>
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={addExpense}>Add</button>
      </div>
      <div className="expenses-list">
        <h2>Expenses List</h2>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense._id}>
                  <td>{expense.category}</td>
                  <td>Rs. {expense.amount.toFixed(2)}</td>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td><button className="delete-btn" onClick={() => deleteExpense(expense._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2">Total:</td>
                <td colSpan="2">Rs. {totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;