import React from "react";
import OrderFormToggleItem from "./order_form_toggle_item";

export default ({color, isBuyOrder, ticker, setState}) => {
    const generateClassName = field => {
        let className = "buy-sell-button-positioner ";
        
        const isSelected = (field === "Buy") === isBuyOrder;

        if (isSelected) className += `selected ${color} `; 
        
        className += `${color}-hover `;

        return className;
    }

    const handleClick = e => {
        e.preventDefault();

        const isBuyOrder = e.target.value === "Buy";
        setState({
            isBuyOrder,
        })
    }

    const getItemProps = type => ({
        key: type,
        type,
        ticker,
        handleClick,
        classNames: generateClassName(type),
    })

    return (
        <div className="buy-sell-sizer">
            <div className="buy-sell-container">
                <div className="buy-sell-wrapper">
                    <OrderFormToggleItem {...getItemProps("Buy")} />
                    <OrderFormToggleItem {...getItemProps("Sell")} />
                </div>
            </div>
        </div>
    )
}