import React from "react";
import {
    formatToDollar,
    parseDollarInput,
} from "../../../../util/dashboard_calcs";
import {
    demolishCashTransactions
} from "../../../../actions/cash_transactions_actions";
import {connect} from "react-redux";

const mapDispatchToProps = dispatch => ({
    demolishCashTransactions: () => dispatch(demolishCashTransactions()),
});

const CashFormOptions = ({color, setState, amount, datetimeError,
    demolishCashTransactions, numDecimals, action, date, time,
}) => {

    const handleDollarChange = ({target: {value}}) => {
        const {amount, numDecimals} = parseDollarInput(value);

        setState({transaction: {amount}, numDecimals});
    };

    const handleBlur = ({target: {value}}) => {
        if (value !== "$" && value !== "") setState({numDecimals: 2});
    };

    const generateDatetimeChangeHandler = type => ({currentTarget:{value}}) => {
        setState({[type]: value});
    };
    
    const handleCashReset = e => {
        e.preventDefault();
        demolishCashTransactions();
    };

    const amountStr = amount === "" ? "" : formatToDollar(amount, numDecimals);

    let datetimeClasses = `${color}-border-focus-within `;
    if (datetimeError) datetimeClasses += "red-border ";

    return (
        <div className="cash-form-options-div no-height">
            <div className="cash-form-options-wrapper">

                <label>Amount<input
                    required
                    type="text"
                    placeholder="$0.00"
                    className={`dollar-input ${color}-border-focus`}
                    onChange={handleDollarChange}
                    onBlur={handleBlur}
                    value={amountStr}
                /></label>

                <label>Date<input
                    required
                    type="date"
                    cursor="pointer"
                    className={"cash-option-date " + datetimeClasses}
                    onChange={generateDatetimeChangeHandler("date")}
                    value={date}
                /></label>

                <label>Time<input
                    type="time"
                    cursor="pointer"
                    className={"cash-option-time " + datetimeClasses}
                    onChange={generateDatetimeChangeHandler("time")}
                    step="60"
                    value={time}
                /></label>

                <button
                    id={"cash-option-submit"}
                    className={`rounded-button ${color}-background`}
                >{action}</button>

            </div>

            <div className = "cash-form-options-bottom-text">
                <a onClick={handleCashReset}>Reset cash</a>
                <span className="cash-submit-error red">{datetimeError}</span>
            </div>
        </div>
    )
}

export default connect(null, mapDispatchToProps)(CashFormOptions);