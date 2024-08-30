import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Transactions from './components/Transactions';
import CurrentPositions from './components/CurrentPositions';
import PlaceOrder from './components/PlaceOrder'
import './App.css';

// The home page has 3 buttons that let the user go to the appropriate page.
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Schwab API Web Application</h1>
      </header>
      <main>
        <Routes>
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/currentpositions" element={<CurrentPositions />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/" element={
            <div className="button-container">
              <div className="button-item">
              <Link to="/transactions">
                <button className='submitButton'>All Transactions</button>
              </Link>
              <h2>Filter transactions by dates and ticker, Also allows sorting various 
                columns in ascending or descending order</h2>
              </div>
              <div className="button-item">
              <Link to="/currentpositions">
                <button className='submitButton'>Current Positions</button>
              </Link>
              <h2>Visualize current open positions in the account in both dollar and percentage terms</h2>
              </div>
              <div className="button-item">
              <Link to="/placeorder">
                <button className='submitButton'>Place Order</button>
              </Link>
              <h2>Place a buy, sell, short, or cover order on stocks and options</h2>
              </div>
          </div>
          
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
