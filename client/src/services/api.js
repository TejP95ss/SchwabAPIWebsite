const API_URL = '/api';

export const fetchTransactionsByDate = async (startDate, endDate, filterTicker) => {
  try {
    let url = `${API_URL}/transactions`;
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}&filter_ticker=${filterTicker}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return null;
  }
};

export const fetchCurrentPositions = async () => {
  try {
    const response = await fetch(`${API_URL}/currentpositions`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return null;
  }
};


export const placeOrder = async (ticker, quantity, type, price, buySell, infoDict) => {
  try {
    let url = `${API_URL}/placeorder`;
    let valid = (ticker && quantity && type && buySell && price) 
    || (ticker && quantity && (type === "MARKET" || type === "MARKET_ON_CLOSE") && buySell)
    if (valid) {
      url += `?ticker=${ticker}&quantity=${quantity}&type=${type}&price=${price}&buysell=${buySell}&infodict=${infoDict}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return null;
  }
};
