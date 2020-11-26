import React from "react";
import {postCashTransaction} from "../../actions/cash_transactions_actions";
import {connect} from "react-redux";
import {formatToDollar} from "../../util/dashboard_calcs";

const ONE = "1";
const TEN = "10";
const HUNDRED = "100";
const THOUSAND = "1,000";
const TEN_THOUSAND = "10,000";
const HUNDRED_THOUSAND = "100,000";
const MILLION = "1,000,000";



const mapDispatchToProps = props => {
    return ({
        postCashTransaction: transaction => dispatch(postCashTransaction(transaction)),
    })
}

class Cash extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expanded: false,
            transaction: {
                createdAt: "",
                amount: "",
            },
            numDecimals: 0,
            deposit: true,
            expandedOptions: false,
        }
        this.toggleDeposit = this.toggleDeposit.bind(this);
        this.setDeposit = this.setDeposit.bind(this);
        this.setWithdraw = this.setWithdraw.bind(this);
        this.toggleExpandedOptions = this.toggleExpandedOptions.bind(this);
        this.mouseEnterSiblings = this.mouseEnterSiblings.bind(this);
        this.mouseLeaveSiblings = this.mouseLeaveSiblings.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleClick(e) {
        e.preventDefault();
        this.setState({
            expanded: !this.state.expanded
        })
    }

    toggleDeposit(e) {
        this.setState({
            deposit: !this.state.deposit,
        })
    }

    setDeposit(e) {
        e.preventDefault()
        if (!this.state.deposit) {
            $("#cash-deposit-toggle").trigger("click");
        }
    }

    setWithdraw(e) {
        e.preventDefault()
        if (this.state.deposit) {
            $("#cash-deposit-toggle").trigger("click");
        }
    }

    generateClickHandler(field) {
        let strNum = "";
        for (let i = 0; i < field.length; i++) {
            if (field[i] !== ",") {strNum += field[i]}
        };
        const amount = parseInt(strNum) * 100;
        return e => {
            e.preventDefault();
            this.props.postCashTransaction({
                amount: amount * (this.state.deposit ? 1 : -1),
                created_at: new Date().getTime() - (24 * 60 *60 * 1000), //ADJUSTMENT FOR TESTING DURING THANKSGIVING, REMOVE THE ONE DAY OFFSET
            })
        }
    }

    toggleExpandedOptions(e) {
        if ($(e.target).is("button")) {e.preventDefault()}
        this.setState({
            expandedOptions: !this.state.expandedOptions,
        })
        $(".cash-form-options-div").toggleClass("no-height")
        $(".cash-form-options-div").toggleClass("cash-form-options-div-expanded")
    }

    mouseEnterSiblings(e) {
        $(e.currentTarget).siblings().addClass("hovered")
    }

    mouseLeaveSiblings(e) {
        $(e.currentTarget).siblings().removeClass("hovered")
    }

    handleChange(e) {
        const val = e.target.value;
        if (val === "$") {this.setState({transaction: {amount: ""}}); return;}
        const allowableChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
        let numStr = "";
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
        const amount = parseInt(numStr) * 100;
        this.setState({transaction: {amount}, numDecimals})
    }

    render() {
        return (
            <form>
                <div className="cash-toggles-container">
                    <div className="cash-deposit-toggle-container">
                        <button onClick={this.setDeposit} className={this.state.deposit ? "" : "dark-green-hover black"}>Deposit</button>
                        <span className="cash-deposit-toggle-wrapper" onMouseEnter={this.mouseEnterSiblings} onMouseLeave={this.mouseLeaveSiblings}>
                            <label className="switch" id="cash-deposit-toggle">
                                <input type="checkbox" onClick={this.toggleDeposit}/>
                                <span className="slider"></span>
                            </label>
                        </span>
                        <button onClick={this.setWithdraw} className={this.state.deposit ? "red-hover black" : ""}>Withdraw</button>
                    </div>
                    <div className="cash-options-toggle-container">
                        <button className={this.state.expandedOptions ? "dark-green-hover" : "red-hover black"} onClick={this.toggleExpandedOptions}>Expanded Options</button>
                        <span className="cash-deposit-toggle-wrapper" onMouseEnter={this.mouseEnterSiblings} onMouseLeave={this.mouseLeaveSiblings}>
                            <label className="switch" id="cash-deposit-toggle">
                                <input type="checkbox" checked={!this.state.expandedOptions} onChange={this.toggleExpandedOptions}/>
                                <span className="slider"></span>
                            </label>
                        </span>
                    </div>
                </div>
                <div className="cash-buttons">
                    <button className={"cash-button rounded-button " + (this.state.deposit ? "dark-green-background" : "red-background")} onClick={this.generateClickHandler(ONE)}>{<span>{(this.state.deposit ? "+" : "-")}</span>}{"$" + ONE}</button>
                    <button className={"cash-button rounded-button " + (this.state.deposit ? "dark-green-background" : "red-background")} onClick={this.generateClickHandler(TEN)}>{<span>{(this.state.deposit ? "+" : "-")}</span>}{"$" + TEN}</button>
                    <button className={"cash-button rounded-button " + (this.state.deposit ? "dark-green-background" : "red-background")} onClick={this.generateClickHandler(HUNDRED)}>{<span>{(this.state.deposit ? "+" : "-")}</span>}{"$" + HUNDRED}</button>
                    <button className={"cash-button rounded-button " + (this.state.deposit ? "dark-green-background" : "red-background")} onClick={this.generateClickHandler(THOUSAND)}>{<span>{(this.state.deposit ? "+" : "-")}</span>}{"$" + THOUSAND}</button>
                    <button className={"cash-button rounded-button " + (this.state.deposit ? "dark-green-background" : "red-background")} onClick={this.generateClickHandler(TEN_THOUSAND)}>{<span>{(this.state.deposit ? "+" : "-")}</span>}{"$" + TEN_THOUSAND}</button>
                    <button className={"cash-button rounded-button " + (this.state.deposit ? "dark-green-background" : "red-background")} onClick={this.generateClickHandler(HUNDRED_THOUSAND)}>{<span>{(this.state.deposit ? "+" : "-")}</span>}{"$" + HUNDRED_THOUSAND}</button>
                    <button className={"cash-button rounded-button " + (this.state.deposit ? "dark-green-background" : "red-background")} onClick={this.generateClickHandler(MILLION)}>{<span>{(this.state.deposit ? "+" : "-")}</span>}{"$" + MILLION}</button>
                </div>
                <div className="cash-form-options-div no-height">
                    <label>Amount<input type="text" placeholder="$0.00" className="dollar-input" onChange={this.handleChange} value={this.state.transaction.amount === "" ? "" : formatToDollar(this.state.transaction.amount, this.state.numDecimals)}/></label>
                    <label>Time<input type="datetime-local"/></label>
                    <button>{this.state.deposit ? "Deposit" : "Withdraw"}</button>
                </div>
            </form>
        )
    }
}

export default connect(null, mapDispatchToProps)(Cash)