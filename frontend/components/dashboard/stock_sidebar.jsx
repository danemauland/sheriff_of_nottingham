import React from "react";
import {formatToDollar} from "../../util/dashboard_calcs";
import {connect} from "react-redux";
import {createTrade} from "../../actions/trade_actions";

const mapStateToProps = (state, {ticker}) => ({
    valueIncreased: state.ui.valueIncreased,
    price: state.entities.displayedAssets[ticker].prices.oneDay.last(),
})

const mapDispatchToProps = dispatch => ({
    createTrade: trade => dispatch(createTrade(trade))
})

class Sidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            order: "Buy",
            investIn: "Dollars",
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
        this.graphClickListener = this.graphClickListener.bind(this);
    }

    componentDidMount() {
        document.getElementById("myChart").addEventListener("click", this.graphClickListener)
    }

    graphClickListener(e) {
        const lineChart = $("#myChart").data("myChart");
        const datasetIndex = lineChart.tooltip._active[0]._datasetIndex;
        const index = lineChart.tooltip._active[0]._index;
        const price = lineChart.tooltip._data.datasets[datasetIndex].data[index];
        const createdAt = lineChart.tooltip._data.datasets[4].data[index];
        this.setState({price: price*100,createdAt: createdAt * 1000});
    }

    resetState() {
        this.setState({
            order: "Buy",
            investIn: "Dollars",
            amount: "",
            numDecimals: 0,
            numShares: "",
            price: this.props.price,
            createdAt: 0,
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location !== this.props.location) {
            this.resetState();
        }
    }

    generateClassName(field) {
        let className = "";
        if (field === this.state.order) {
            className += "selected "
            if (this.props.valueIncreased) {
                className += "dark-green ";
            } else {
                className += "red ";
            }
        } 
        if (this.props.valueIncreased) {
            className += "dark-green-hover "
        } else {
            className += "red-hover "
        }
        return className;
    }

    handleBuy(e) {
        e.preventDefault();
        this.setState({
            order: "Buy",
        })
    }

    handleSell(e) {
        e.preventDefault();
        this.setState({
            order: "Sell",
        })
    }

    handleSelect(e) {
        if (e.target.value !== this.props.investIn) {
            this.setState({
                investIn: e.target.value,
            })
        }
    }

    handleChange(e) {
        let allowableChars;
        const val = e.target.value;
        let numStr = "";
        if (this.state.investIn === "Dollars") {
            allowableChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
            let numDecimals = 0;
            for(let i = 0; i < val.length; i++) {
                if (allowableChars.includes(val[i])) {
                    if (numDecimals === 0) {
                        numStr += val[i]
                        if (val[i] === ".") {numDecimals = -1}
                    } else if (val[i] !== ".") {
                        numStr += val[i]
                        if (numDecimals === -1) {
                            numDecimals = 1;
                        } else if (numDecimals === 1) {
                            numDecimals = 2;
                        }
                    }
                }
            }
            if (numStr === "$" || numStr === "") {this.setState({amount: ""}); return;}
            const amount = Math.floor(parseFloat(numStr) * 100);
            this.setState({amount: amount, numDecimals})
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
        if (this.state.investIn === "Dollars") {
            trade.num_shares = Math.floor(this.state.amount / this.state.price)
        } else {
            trade.num_shares = this.state.numShares;
        }
        if (this.state.order === "Sell") {
            trade.num_shares *= -1;
        }
        trade.trade_price = this.state.price;
        this.props.createTrade(trade);
    }

    render() {
        return (
            <div className="dashboard-sidebar-spacer">
                <div className="dashboard-sidebar-wrapper">
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
                                <select className="invest-in-select" onChange={this.handleSelect}>
                                    <option value="Dollars" className={(this.props.investIn === "Dollars" ? "selected " : "") + (this.props.valueIncreased ? "green-background-selected" : "red-background-selected")}>Dollars</option>
                                    <option value="Shares" className={(this.props.investIn === "Dollars" ? "selected " : "") + (this.props.valueIncreased ? "green-background-selected" : "red-background-selected")}>Shares</option>
                                </select>
                            </div>
                            <div>
                                <span>{this.state.investIn === "Dollars" ? "Amount" : "Shares"}</span>
                                <input onChange={this.handleChange} className={(this.state.investIn === "Dollars" ? "dollar-input " : "share-input ") + (this.props.valueIncreased ? "dark-green-border-focus" : "red-border-focus")} value={((this.state.investIn === "Dollars") ? (this.state.amount === "" ? "" : formatToDollar(this.state.amount, this.state.numDecimals)) : this.state.numShares)} onBlur={this.handleBlur} placeholder={(this.state.investIn === "Dollars" ? "$0.00" : "0")} type="text"/>
                            </div>
                            <div>
                                <span>Market Price (<button onClick={this.handleReset} className={this.props.valueIncreased ? "dark-green" : "red"}>reset</button>)</span>
                                <span className="order-form-dollar">{formatToDollar(this.state.price)}</span>
                            </div>
                            <div>
                                <span>{this.state.investIn === "Dollars" ? "Est. Quantity" : "Est. Proceeds"}</span>
                                <span>{this.state.investIn === "Dollars" ? Math.floor(this.state.amount / this.state.price) : (this.state.numShares === "-" ? formatToDollar(0) : formatToDollar(this.state.numShares * this.state.price))}</span>
                            </div>
                        </div>
                        <div className="order-button-wrapper">
                            <button className={"order-button " + (this.props.valueIncreased ? "green-background light-green-background-hover" : "red-background light-red-background-hover")}>Place Order</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);