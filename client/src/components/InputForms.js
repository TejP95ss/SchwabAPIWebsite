import React from "react";

export const DateInput = ({ val, title, ch }) => {
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