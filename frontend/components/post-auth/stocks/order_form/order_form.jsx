import React from "react";
import {formatToDollar} from "../../../../util/dashboard_calcs";
import {connect} from "react-redux";
import {createTrade} from "../../../../actions/trade_actions";
import {
    getLastPrice,
    getValueIncreased,
} from "../../../../util/extract_from_state_utils";
import OrderFormToggle from "./order_form_toggle";
import InvestIn from "./invest_in";

const DIGIT_STRINGS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const mapStateToProps = (state, {ticker}) => ({
    colorDark: getValueIncreased(state, ticker) ? "dark-green" : "red",
    color: getValueIncreased(state, ticker) ? "green" : "red",
    valueIncreased: getValueIncreased(state, ticker),
    price: getLastPrice(state, ticker),
});

const mapDispatchToProps = dispatch => ({
    createTrade: trade => dispatch(createTrade(trade))
});

class Sidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isBuyOrder: true,
            isDollarOrder: true,
            amount: "",
            numDecimals: -1,
            numShares: "",
            price: this.props.price,
            createdAt: 0,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleReset = this.handleReset.bind(this);
        // this.graphClickListener = this.graphClickListener.bind(this);
    }

    // TODO: REFACTOR AS EVENT HANDLER PASSED TO CHART THAT DISPATCHES TO STORE
    // ON CLICK

    // componentDidMount() {
    //     document.getElementById("myChart").addEventListener("click", this.graphClickListener)
    // }

    // graphClickListener(e) {
    //     const lineChart = $(e.target)
    //     // .data("myChart");
    //     const datasetIndex = lineChart.tooltip._active[0]._datasetIndex;
    //     const index = lineChart.tooltip._active[0]._index;
    //     const price = lineChart.tooltip._data.datasets[datasetIndex].data[index];
    //     const createdAt = lineChart.tooltip._data.datasets[4].data[index];
    //     this.setState({price: price*100,createdAt: createdAt * 1000});
    // }

    resetState() {
        this.setState({
            isBuyOrder: true,
            isDollarOrder: true,
            amount: "",
            numDecimals: -1,
            numShares: "",
            price: this.props.price,
            createdAt: 0,
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location !== this.props.location) this.resetState();
    }

    handleSelect(e) {
        const wasDollarOrder = this.state.isDollarOrder;
        const isDollarOrder = e.target.value === "Dollars";

        if (wasDollarOrder !== isDollarOrder) this.setState({isDollarOrder});
    }

    handleDollarOrderChange(val) {
        let numDecimals = -1;
        let numStr = "";

        for(let char of val) {
            const charIsDecimal = char === ".";

            const charIsValid = DIGIT_STRINGS.includes(char) || charIsDecimal;
            const digitIsValid = numDecimals === -1 || !charIsDecimal;

            if (charIsValid && digitIsValid) {
                numStr += char;

                const numDecIs0or1 = (numDecimals > -1 && numDecimals < 2);
                if (numDecIs0or1 || charIsDecimal) numDecimals++;
            }
        }

        let amount = "";
        if (numStr !== "$" && numStr !== "") {
            amount = Math.floor(parseFloat(numStr) * 100);
        }

        const numShares = Math.floor(amount / this.state.price) || "";
        this.setState({amount, numDecimals, numShares});
    }

    handleShareOrderChange(val) {
        let numStr = "";

        for(let char of val) if (DIGIT_STRINGS.includes(char)) numStr += char;;

        const numShares = parseInt(numStr) || "";
        this.setState({
            numShares,
            amount: this.state.price * numShares || "",
        });
    }

    handleChange(e) {
        const val = e.target.value;
        if (this.state.isDollarOrder) this.handleDollarOrderChange(val);
        else this.handleShareOrderChange(val);
    }

    handleBlur(e) {
        const val = e.target.value;
        if (val !== "$" && val !== "") this.setState({numDecimals: 2});
    }

    handleReset(e) {
        e.preventDefault();
        this.setState({
            price: this.props.price,
            createdAt: 0,
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const {ticker, createTrade} = this.props;
        const {createdAt, numShares, isBuyOrder, price} = this.state;

        let trade = {};

        trade.ticker = ticker;
        trade.created_at = createdAt || new Date();
        trade.trade_price = price;
        
        trade.num_shares = numShares;
        if (!isBuyOrder) trade.num_shares *= -1;

        createTrade(trade);
    }

    get orderFormToggleProps() {
        const {colorDark, ticker} = this.props;
        const {isBuyOrder} = this.state;
        
        return {
            ticker,
            isBuyOrder,
            color: colorDark,
            setState: this.setState.bind(this),
        };
    }

    get investInProps() {
        return {
            selected: this.state.isDollarOrder ? "Dollars" : "Shares",
            color: this.props.color,
            handleSelect: this.handleSelect,
        }
    }

    get amountInputValue() {
        const {isDollarOrder, amount, numDecimals, numShares} = this.state;

        let val = numShares;
        if (isDollarOrder) {
            if (amount === "") val = "";
            else val = formatToDollar(amount, numDecimals);
        }

        return val;
    }

    get amountInputProps() {
        const isDollarOrder = this.state.isDollarOrder;

        let className = (isDollarOrder ? "dollar" : "share") + "-input ";
        className += this.props.colorDark + "-border-focus";

        return {
            onChange: this.handleChange,
            className,
            value: this.amountInputValue,
            onBlur: this.handleBlur,
            placeholder: isDollarOrder ? "$0.00" : "0",
            type: "text",
        }
    }

    get resetButton() {
        return (
            <button onClick={this.handleReset} className={this.props.colorDark}>
                reset
            </button>)
    }

    get orderTotalHeader() {
        const {isDollarOrder, isBuyOrder} = this.state;
        if (isDollarOrder) return "Shares";

        if (isBuyOrder) return "Cost";
        return "Credit";
    }

    get orderTotalAmount() {
        const {numShares, price, isDollarOrder} = this.state;

        if (isDollarOrder) return numShares || 0;

        if (!numShares) return formatToDollar(0);

        return formatToDollar(numShares * price);
    }

    get orderButtonClassName() {
        const col = this.props.color;
        return `order-button ${col}-background light-${col}-background-hover`;
    }

    render() {
        const {color} = this.props;
        const {isDollarOrder, price} = this.state;
        return (
            <form className="order-form" onSubmit={this.handleSubmit}>
                <OrderFormToggle {...this.orderFormToggleProps}/>
                <div className="order-info-positioner">
                    <InvestIn {...this.investInProps}/>

                    <div>
                        <span>{isDollarOrder ? "Amount" : "Shares"}</span>
                        <input {...this.amountInputProps}/>
                    </div>

                    <div>
                        <span>
                            Market Price ({this.resetButton})
                        </span>

                        <span className="order-form-dollar">
                            {formatToDollar(price)}
                        </span>
                    </div>

                    <div>
                        <span>
                            {this.orderTotalHeader}
                        </span>
                        <span>{this.orderTotalAmount}</span>
                    </div>

                </div>
                
                <div className="order-button-wrapper">
                    <button className={this.orderButtonClassName}>
                        Place Order
                    </button>
                </div>
            </form>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);