import React from "react";
import Select from "react-select";
import InvestInOption from "./invest_in_option";

export default ({handler, color, selected}) => {
    <div>
        <span>Invest In</span>
        <Select className="invest-inSselect"
            onChange={handler}
            value={selected}
        >
            <InvestInOption color={color} type="Dollars"/>
            <InvestInOption color={color} type="Shares"/>
        </Select>
    </div>
}