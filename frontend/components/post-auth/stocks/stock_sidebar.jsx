import React from "react";
import {formatToDollar} from "../../../util/dashboard_calcs";
import {connect} from "react-redux";
import {createTrade} from "../../../actions/trade_actions";
import {
    getLastPrice,
    getValueIncreased,
} from "../../../util/extract_from_state_utils";

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
            numDecimals: 0,
            numShares: "",
            price: this.props.price,
            createdAt: 0,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSell = this.handleSell.bind(this);
        this.handleBuy = this.handleBuy.bind(this);
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
            numDecimals: 0,
            numShares: "",
            price: this.props.price,
            createdAt: 0,
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location !== this.props.location) this.resetState();
    }

    generateClassName(field) {
        let className = "";
        const colorDark = this.props.colorDark;
        const isBuyOrder = this.state.isBuyOrder;
        
        const isSelected = (field === "Buy") === isBuyOrder;

        if (isSelected) className += `selected ${colorDark} `; 
        
        className += `${colorDark}-hover `;

        return className;
    }

    handleBuy(e) {
        e.preventDefault();

        this.setState({
            isBuyOrder: true,
        })
    }

    handleSell(e) {
        e.preventDefault();

        this.setState({
            isBuyOrder: false,
        })
    }

    handleSelect(e) {
        const wasDollarOrder = this.state.isDollarOrder;
        const isDollarOrder = e.target.value === "Dollars";

        if (wasDollarOrder !== isDollarOrder) {
            this.setState({
                isDollarOrder,
            })
        }
    }

    handleDollarOrderChange(val) {
        let numDecimals = -1;
        let numStr = "";
        for(let char of val) {
            if (DIGIT_STRINGS.includes(char) || char === ".") {
                if (numDecimals === -1 || char !== ".") {
                    numStr += char;

                    const numDecIs0or1 = (numDecimals > -1 && numDecimals < 2);
                    if (numDecIs0or1 || char === ".") numDecimals++;
                }
            }
        }
        if (numStr === "$" || numStr === "") {
            this.setState({amount: ""});
            return;
        }
        
        const amount = Math.floor(parseFloat(numStr) * 100);
        this.setState({amount: amount, numDecimals})
    }

    handleChange(e) {
        let allowableChars;
        const val = e.target.value;
        let numStr = "";
        if (this.state.isDollarOrder) {
            this.handleDollarOrderChange(val);
        } else {
            allowableChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
            for(let i = 0; i < val.length; i++) {
                if (allowableChars.includes(val[i]) || (i === 0 && val[i] === "-")) {
                    numStr += val[i]
                }
            }
            if (numStr === "") {this.setState({numShares: ""}); return;}
            if (numStr === "-") {this.setState({numShares: "-"}); return;}
            const numShares = parseInt(numStr);
            this.setState({numShares})
        }
    }

    handleBlur(e) {
        const val = e.target.value;
        if (val === "$" || val === "") return;
        this.setState({numDecimals: 2})
    }

    handleReset(e) {
        e.preventDefault();
        this.setState({
            price: this.props.price,
            createdAt: 0,
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        let trade = {};
        trade.ticker = this.props.ticker;
        trade.created_at = this.state.createdAt || new Date();
        if (this.state.isDollarOrder) {
            trade.num_shares = Math.floor(this.state.amount / this.state.price)
        } else {
            trade.num_shares = this.state.numShares;
        }
        if (!this.state.isBuyOrder) {
            trade.num_shares *= -1;
        }
        trade.trade_price = this.state.price;
        this.props.createTrade(trade);
    }

    render() {
        const {colorDark, color} = this.props;
        const {isDollarOrder} = this.state;
        return (
            <form className="order-form" onSubmit={this.handleSubmit}>
                <div className="buy-sell-sizer">
                    <div className="buy-sell-container">
                        <div className="buy-sell-wrapper">
                            <div className={"buy-sell-button-positioner " + this.generateClassName("Buy")}>
                                <button onClick={this.handleBuy}>Buy {this.props.ticker}</button>
                            </div>
                            <div className={"buy-sell-button-positioner " + this.generateClassName("Sell")}>
                                <button onClick={this.handleSell}>Sell {this.props.ticker}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="order-info-positioner">
                    <div>
                        <span>Invest In</span>
                        <select className="invest-in-select" onChange={this.handleSelect} value={isDollarOrder ? "Dollars" : "Shares"}>
                            <option value="Dollars" className={(isDollarOrder ? "selected " : "") + `${color}-background-selected`}>Dollars</option>
                            <option value="Shares" className={(!isDollarOrder ? "selected " : "") + `${color}-background-selected`}>Shares</option>
                        </select>
                    </div>
                    <div>
                        <span>{isDollarOrder ? "Amount" : "Shares"}</span>
                        <input onChange={this.handleChange} className={(isDollarOrder ? "dollar-input " : "share-input ") + `${colorDark}-border-focus`} value={(isDollarOrder ? (this.state.amount === "" ? "" : formatToDollar(this.state.amount, this.state.numDecimals)) : this.state.numShares)} onBlur={this.handleBlur} placeholder={(isDollarOrder ? "$0.00" : "0")} type="text"/>
                    </div>
                    <div>
                        <span>Market Price (<button onClick={this.handleReset} className={colorDark}>reset</button>)</span>
                        <span className="order-form-dollar">{formatToDollar(this.state.price)}</span>
                    </div>
                    <div>
                        <span>{isDollarOrder ? "Est. Quantity" : "Est. Proceeds"}</span>
                        <span>{isDollarOrder ? Math.floor(this.state.amount / this.state.price) : (this.state.numShares === "-" ? formatToDollar(0) : formatToDollar(this.state.numShares * this.state.price))}</span>
                    </div>
                </div>
                <div className="order-button-wrapper">
                    <button className={`order-button ${color}-background light-${color}-background-hover`}>Place Order</button>
                </div>
            </form>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);