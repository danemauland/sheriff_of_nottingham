import React from "react";
import {
    postCashTransaction,
} from "../../../../actions/cash_transactions_actions";
import {connect} from "react-redux";
import {CASH_AMOUNTS} from "../../../../util/cash_utils";
import CashToggles from "./cash_toggles";
import CashFormOptions from "./cash_form_options";

const DATETIME_ERROR = "You can only travel backwards in time, not forwards";

const convertDateAndTimeToMS = (date, time) => {
    const timezoneOffset = new Date().getTimezoneOffset();

    const hours = +time.slice(0,2) + timezoneOffset;
    const minutes = +time.slice(3);
    
    const timeAsMS = (hours * 60 + minutes) * 60 * 1000

    const dateAsMS = Date.parse(date);

    return dateAsMS + timeAsMS;
};

const mapDispatchToProps = dispatch => ({
    postCashTransaction: transaction => (
        dispatch(postCashTransaction(transaction))
    ),
});

class Cash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transaction: {
                amount: "",
            },
            numDecimals: 0,
            isDeposit: true,
            expandedOptions: false,
            date: "",
            time: "",
            datetimeError: "",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.generateCashButton = this.generateCashButton.bind(this);
        this.setState = this.setState.bind(this);
    }

    generateClickHandler(field) {
        const amount = parseInt(field.replace(/,/g, "")) * 100;

        return e => {
            e.preventDefault();

            this.props.postCashTransaction({
                amount: amount * (this.state.isDeposit ? 1 : -1),
                created_at: new Date().getTime(),
            });
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const {time, date} = this.state;

        const datetimeAsMs = convertDateAndTimeToMS(date, time);

        if (datetimeAsMs > new Date().getTime()) this.handleDatetimeError();
        else this.submit(datetimeAsMs);
    }
    
    handleDatetimeError() {
        this.setState({datetimeError: DATETIME_ERROR});
    }
    
    submit(datetimeAsMs) {
        this.setState({datetimeError: ""});

        const {transaction: {amount}, isDeposit} = this.state;

        this.props.postCashTransaction({
            amount: amount * (isDeposit ? 1 : -1),
            created_at: datetimeAsMs,
        });

    }

    generateCashButton(amount, i) {
        const isDeposit = this.state.isDeposit;
        
        const color = isDeposit ? "dark-green" : "red";
        const symbol = isDeposit ? "+" : "-";

        return (
            <button key={i}
                className={`cash-button rounded-button ${color}-background`}
                onClick={this.generateClickHandler(amount)}
            >
                <span>{symbol}</span>{"$" + amount}
            </button>
        );
    }

    render() {
        const {isDeposit, expandedOptions} = this.state;
        return (
            <div className="cash-form-div no-height" >
                <form onSubmit={this.handleSubmit}>
                    <CashToggles
                        isDeposit={isDeposit}
                        setState={this.setState}
                        expandedOptions={expandedOptions}
                    />

                    <div className="cash-buttons">
                        {CASH_AMOUNTS.map(this.generateCashButton)}
                    </div>

                    <CashFormOptions
                        color={isDeposit ? "dark-green" : "red"}
                        setState={this.setState}
                        amount={this.state.transaction.amount}
                        numDecimals={this.state.numDecimals}
                        datetimeError={this.state.datetimeError}
                        action={(isDeposit ? "Deposit" : "Withdraw")}
                        date={this.state.date}
                        time={this.state.time}
                    />
                </form>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(Cash);