import React, { useState, useEffect } from 'react';
import { fetchTransactionsByDate } from '../services/api';
import './Transactions.css';
import useSortableData from './Sort';
import {DateInput, pn, ColumnCreator} from './InputForms';

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
  const columns = ['date', 'ticker', 'quantity', 'price', 'amount'];
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
          <>{columns.map((label) => ( //creates columns used by the list
            <ColumnCreator label={label} sortConfig={sortConfig} requestSort={requestSort} />
          ))}</>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <>{columns.map((label) => ( //adds values to the columns
              <td className={pn(transaction.quantity)}> {transaction[label]}</td>
              ))}</>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Transactions;
