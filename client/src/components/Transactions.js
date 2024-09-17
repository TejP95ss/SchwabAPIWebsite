import React, { useState, useEffect } from 'react';
import { fetchTransactionsByDate } from '../services/api';
import './Transactions.css';
import useSortableData from './Sort';
import {DateInput, pn} from './InputForms';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterTicker, setFilterTicker] = useState('');
  const { items: sortedTransactions, requestSort, sortConfig } = useSortableData(transactions);

  useEffect(() => {
    const getTransactions = async () => {
      const data = await fetchTransactionsByDate();
      if (data) {
        setTransactions(data);
      }
    };
    getTransactions();
  }, []);

  const handleFilter = async (event) => {
    event.preventDefault();
    const data = await fetchTransactionsByDate(startDate, endDate, filterTicker);
    if (data) {
      setTransactions(data);
    }
  };

  return (
    <div className="transactions-container">
      <h1>Transactions</h1>
      <form onSubmit={handleFilter} className='dateForm'>
          <DateInput 
            val={startDate} 
            title={"Start Date:"}
            ch={setStartDate} 
          />
          <DateInput
          val={endDate} 
          title={"End Date:"}
          ch={setEndDate} 
          />
        <label className="filterTicker">
         Ticker (Optional): 
          <input 
            type="text"
            className="calendar"
            value={filterTicker} 
            onChange={(e) => setFilterTicker(e.target.value)} 
          />
        </label>
        <button type="submit" className="submitButton">Filter</button>
      </form>
      <table className="transactions-table">
        <thead>
          <tr>
            <th onClick={() => requestSort('date')}>
              Date {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => requestSort('ticker')}>
              Ticker {sortConfig.key === 'ticker' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => requestSort('quantity')}>
              Quantity {sortConfig.key === 'quantity' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => requestSort('price')}>
              Price {sortConfig.key === 'price' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => requestSort('amount')}>
              Amount {sortConfig.key === 'amount' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className={pn(transaction.quantity)}> {transaction.date}</td>
              <td className={pn(transaction.quantity)}> {transaction.ticker}</td>
              <td className={pn(transaction.quantity)}> {transaction.quantity}</td>
              <td className={pn(transaction.quantity)}> {transaction.price}</td>
              <td className={pn(transaction.quantity)}> {transaction.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
