import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { fetchCurrentPositions } from '../services/api';
import './CurrentPositions.css';
import 'chart.js/auto';

const CurrentPositions = () => {
  const [positions, setPositions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const getCurrentPositions = async () => {
      const data = await fetchCurrentPositions();
      if (data) {
        setPositions(data);
      }
    };

    getCurrentPositions();
  }, []);

  const legend = positions.map(positions => positions["ticker"])
  legend.pop(); // gets all the tickers and cash as labels for the pie chart
  const colors = positions.map(() => '#' + Math.floor(Math.random()*16777215).toString(16))

  const dollarData = {
    labels: legend,
    datasets: [
      {
        label: 'Dollar Allocation',
        data: positions.map(position => (position["quantity"] * position["avgPrice"])),
        backgroundColor: colors,
      }
    ]
  };

  const percentageData = {
    labels: legend,
    datasets: [
      {
        label: 'Percentage Allocation',
        data: positions.map(position => position["perAcc"]),
        backgroundColor: colors,
      }
    ]
  };

  const sortedPositions = [...positions].sort((a, b) => {
    if (sortConfig.key === null) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  }).filter(position => (position["ticker"] !== "cash" && position["ticker"] !== "liqVal"));

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({key, direction});
  };
  

  return (
    <div className="current-positions-container">
      <h1>Current Positions</h1>
      <div className="chart-container">
        <div className="chart">
          <h2>Dollar Allocation($)</h2>
          <Pie data={dollarData} />
        </div>
        <div className="chart">
          <h2>Percentage Allocation</h2>
          <Pie data={percentageData} />
        </div>
      </div>
      <table className="transactions-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('ticker')}>
              Ticker {sortConfig.key === 'ticker' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('avgPrice')}>
              Average Price {sortConfig.key === 'avgPrice' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('quantity')}>
              Quantity {sortConfig.key === 'quantity' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('PL')}>
              P/L {sortConfig.key === 'PL' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('perPL')}>
              P/L % {sortConfig.key === 'perPL' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPositions.map((position) => (
            <tr key={position.id}>
              <td className={position["PL"] > 0 ? 'positive' : 'negative'}> {position["ticker"]}</td>
              <td className={position["PL"]  > 0 ? 'positive' : 'negative'}> {position["avgPrice"]}</td>
              <td className={position["PL"]  > 0 ? 'positive' : 'negative'}> {position["quantity"]}</td>
              <td className={position["PL"]  > 0 ? 'positive' : 'negative'}> {position["PL"]}</td>
              <td className={position["PL"]  > 0 ? 'positive' : 'negative'}> {position["perPL"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrentPositions;
