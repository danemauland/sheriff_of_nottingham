import React from "react";
import {postCashTransaction} from "../../actions/cash_transactions_actions";
import {connect} from "react-redux";

const ONE = "1";
const TEN = "10";
const HUNDRED = "100";
const THOUSAND = "1,000";
const TEN_THOUSAND = "10,000";
const HUNDRED_THOUSAND = "100,000";
const MILLION = "1,0000,000";



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
                amount: 0,
            },
            deposit: true,
        }
        this.toggleDeposit = this.toggleDeposit.bind(this);
        this.setDeposit = this.setDeposit.bind(this);
        this.setWithdraw = this.setWithdraw.bind(this);
    }
    
    handleClick(e) {
        e.preventDefault();
        this.setState({
            expanded: !this.state.expanded
        })
    }

    toggleDeposit(e) {
        debugger
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
            if (field[i] === ",") {num += field[i]}
        };
        const amount = parseInt(strNum);
        return e => {
            this.props.postCashTransaction({amount})
        }
    }

    render() {
        return (
            <form>
                <div className="cash-deposit-toggle-container">
                    <button onClick={this.setDeposit} className={this.state.deposit ? "" : "dark-green-hover darkish-gray"}>Deposit</button>
                        <span className="cash-deposit-toggle-wrapper">
                            <label className="switch" id="cash-deposit-toggle">
                                <input type="checkbox" onClick={this.toggleDeposit}/>
                                <span className="slider"></span>
                            </label>
                        </span>
                    <button onClick={this.setWithdraw} className={this.state.deposit ? "red-hover darkish-gray" : ""}>Withdraw</button>
                    <div className="cash-buttons">
                        <button className="cash-button" onClick={this.generateClickHandler(ONE)}>{(this.state.deposit ? "+" : "-") + "$" + ONE}</button>
                        <button className="cash-button"></button>
                        <button className="cash-button"></button>
                    </div>
                </div>
            </form>
        )
    }
}

export default connect(null, mapDispatchToProps)(Cash)