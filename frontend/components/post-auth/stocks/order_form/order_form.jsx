import React from "react";
import {
    formatToDollar,
    parseDollarInput,
    parseIntegerInput,
    formatDateTime,
} from "../../../../util/dashboard_calcs";
import {connect} from "react-redux";
import {createTrade} from "../../../../actions/trade_actions";
import {
    getLastPrice,
    getValueIncreased,
} from "../../../../util/extract_from_state_utils";
import OrderFormToggle from "./order_form_toggle";
import InvestIn from "./invest_in";

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
        this.updateOrderFormFromChart = this.updateOrderFormFromChart.bind(this);
        // this.graphClickListener = this.graphClickListener.bind(this);
    }

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

    componentDidMount() {
        const chart = $("#myChart");
        this.lineChart = chart.data("lineChart");
        chart.click(this.updateOrderFormFromChart);
        chart.addClass("pointer-hover");
    }

    updateOrderFormFromChart(e) {
        const activePoints = this.lineChart.getElementsAtXAxis(e);
        const i = Math.min(activePoints[0]._index, this.lineChart.config.data.datasets[0].data.length - 1);
        let createdAt = this.lineChart.config.data.datasets[2].data[i];
        let hours = new Date(createdAt * 1000).getUTCHours();
        if (hours === 4 || hours === 5) createdAt += 16 * 60 * 60;
        const price = this.lineChart.config.data.datasets[0].data[i] * 100;
        this.setState({createdAt, price});
    }

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
        const {amount, numDecimals} = parseDollarInput(val);

        const numShares = Math.floor(amount / this.state.price) || "";

        this.setState({amount, numDecimals, numShares});
    }

    handleShareOrderChange(val) {
        const numShares = parseIntegerInput(val);

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

    get orderDate() {
        if (!this.state.createdAt) return <></>;

        return <div>
            <span>
                Order Time
            </span>

            <span>
                {formatDateTime(this.state.createdAt)}
            </span>
        </div>
    }

    render() {
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

                    {this.orderDate}

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