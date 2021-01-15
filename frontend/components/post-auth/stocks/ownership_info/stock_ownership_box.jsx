import React from "react";
import StockOwnershipItem from "./stock_ownership_item";

export default ({title, titleVal, items}) => (
        <div>
            <div>{title}</div>
            <h3>{titleVal}</h3>

            <div className="stock-ownership-sub-container">
                {items.map((item,i) => <StockOwnershipItem key={i} {...item}/>)}
            </div>
        </div>
)