import React, { useEffect, useState } from 'react';
import './PlaceOrder.css';
import {placeOrder} from '../services/api';
import Swal from 'sweetalert2';
import {fetchOpenOrders, cancelOrder} from '../services/api';
import useSortableData from './Sort';
import {pn, ColumnCreator} from './InputForms'

const PlaceOrder = () => {
  const [instrumentType, setInstrument] = useState('STOCK');
  const [ticker, setTicker] = useState('');
  const [expiry, setExpiry] = useState('');
  const [strike, setStrike] = useState('');
  const [cp, setCP] = useState('CALL');
  const [quantity, setQuantity] = useState('');
  const [buySell, setBuySell] = useState('BUY');
  const [orderType, setOrderType] = useState('LIMIT');
  const [price, setPrice] = useState('');
  const [orders, setOrders] = useState([]);
  const { items: sortedOrders, requestSort, sortConfig } = useSortableData(orders);

  const getOpenOrders = async () => {
    const data = await fetchOpenOrders();
    if (data) {
      setOrders(data);
    }
  };

  // Call the function in useEffect to fetch on component mount
  useEffect(() => {
    getOpenOrders();
  }, []);

  const handleTickerChange = (e) => {
    setTicker(e.target.value.toUpperCase());
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (/^[1-9]\d*$/.test(value) || value === '') {
      setQuantity(value);
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const handleSubmit = async (event) => {
    let infoDict = [];
    if(instrumentType === "OPTION") {
      infoDict.push(expiry);
      infoDict.push(strike);
      infoDict.push(cp);
    }

    event.preventDefault();
    const code = await placeOrder(ticker, quantity, orderType, price, buySell, infoDict);
    const bs = buySell.toLowerCase()
    if(code["code"] === 201) {
      let msg = 'Placed ' + orderType + ' order to ' + bs + ' ' + quantity + ' ' + ticker;
      if(orderType !== 'MARKET' && orderType !== 'MARKET_ON_CLOSE') {
        msg = msg +  ' at price ' + price;
      }  
      Swal.fire({
        title: "Success",
        text: msg,
        icon: "success"
      });
      getOpenOrders();
    }
    else {
      Swal.fire({
        title: "Failure",
        text: "Failed to place order. Double check your order.",
        icon: "error"
      });
    }
  };

  const handleCancelOrder = async (oid) => {
    const resp = await cancelOrder(oid);
    if(resp["code"] === 200) {
      Swal.fire({
        title: "Success",
        text: "Cancelled Order with id: " + oid,
        icon: "success"
      });
      getOpenOrders()
    }
    else {
      Swal.fire({
        title: "Error",
        text: "Failed to cancel Order",
        icon: "error"
      });
    }
  };

  const columns = ['Ticker', 'Quantity', 'DateTime', 'Type', 'Price', 'Session', 'Duration'];
      
  return (
    <div className='placeAndSee'> 
      <div className="place-order-container">
      <h1>Place an Order</h1>
      <form onSubmit={handleSubmit}>
        <div className="instrument-group">
          <label htmlFor="instrumentType">Instrument: </label>
          <select
            value={instrumentType}
            onChange={(e) => setInstrument(e.target.value)}
            required
          >
            <option value="STOCK">STOCK</option>
            <option value="OPTION">OPTION</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="ticker">Symbol:</label>
          <input
            type="text"
            value={ticker}
            onChange={handleTickerChange}
            required
          />
        </div>
        {instrumentType === "OPTION" && (
          <div className="option-inputs">
            <label htmlFor="expiry">Expiry:</label>
            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)} 
              required
            />
            <label htmlFor="strike">Strike:</label>
            <input
              type="number"
              value={strike}
              onChange={(e) => setStrike(e.target.value)} 
              required
            />
            <select
              value={cp}
              onChange={(e) => setCP(e.target.value)}
              required
            >
              <option value="CALL">CALL</option>
              <option value="PUT">PUT</option>
            </select>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <div className="input-group">
            <select
              id="buySell"
              value={buySell}
              onChange={(e) => setBuySell(e.target.value)}
              required
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
              <option value="SELL_SHORT">SHORT</option>
              <option value="BUY_TO_COVER">COVER</option>
              <option value="BUY_TO_OPEN">BUY(OPTION)</option>
              <option value="SELL_TO_CLOSE">SELL(OPTION)</option>
            </select>
            <input
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="orderType">Order Type:</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            required
          >
            <option value="LIMIT">LIMIT</option>
            <option value="STOP">STOP</option>
            <option value="MARKET">MARKET</option>
            <option value="MARKET_ON_CLOSE">MOC</option>
            <option value="LIMIT_ON_CLOSE">LOC</option>
          </select>
        </div>
        {(orderType !== "MARKET" && orderType !== "MARKET_ON_CLOSE") && (
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="text"
              value={price}
              onChange={handlePriceChange}
              required
            />
          </div>
        )}
        <button type="submit" className='submitButton'>Submit Order</button>
      </form>
    </div>  
    <h2>Open Orders</h2>
    <table className="transactions-table">
        <thead>
          <tr>
            <>{columns.map((label) => (//creates all the columns
            <ColumnCreator label={label} sortConfig={sortConfig} requestSort={requestSort} />
            ))}</>
            <th>Actions</th> {/* New column for the Cancel button */}
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => (
            <tr key={order.id}>
              <>{columns.map((label) => (//adds all the rows to the columns
                <td className={pn(order["Quantity"])}> {order[label]}</td>
              ))}</>
              <td>
                <button onClick={() => handleCancelOrder(order.oid)} className="cancelButton">
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
};

export default PlaceOrder;
