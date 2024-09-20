import React from "react";

export const DateInput = ({val, title, ch}) => {
    return ( // returns typical date input to avoid repition in code
        <label className="dateInput"> {title}
        <input 
            type="date"
            className="calendar" 
            value={val} 
            onChange={(e) => ch(e.target.value)} 
            required/>
        </label>
    );
}

export function pn(val) { // returns positive or negative for colors.
    if(val > 0) {
      return 'positive';
    }
    return 'negative';
}

export function ColumnCreator({ label, sortKey, sortConfig, requestSort}) {
    const fl = label.charAt(0);
    const title =  (fl === fl.toUpperCase()) ? label : fl.toUpperCase() + label.slice(1);
    return ( // returns the columns for presenting transactions and open orders.
        <th onClick={() => requestSort(label)}>
            {title} {sortConfig.key === label ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
        </th>
    );
};