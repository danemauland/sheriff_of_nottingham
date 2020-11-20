import React from "react";
import {connect} from "react-redux";
import {openModal} from "../../actions/modal_actions";
import {AiOutlineInfoCircle} from "react-icons/ai";
import {Link} from "react-router-dom"

class Commission extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        this.props.openModal("commission")
    }

    render() {
        return (
            <div className="commission-div">
                <div className="inner-commission-div">
                    <h2>Break Free from Commission Fees</h2>
                    <p>Make unlimited commission-free trades in stocks, ETFs, and options with Robinhood Financial, as well as buy and sell cryptocurrencies with Robinhood Crypto. See our <Link to="#" className="dark-green-hover">fee schedule</Link> to learn more about cost.</p>
                    <div className="commission-padding-div">
                        <button onClick={this.handleClick}><AiOutlineInfoCircle /> Commissions Disclosure</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch =>({
    openModal: (modal) => dispatch(openModal(modal))
})
export default connect(null, mapDispatchToProps)(Commission)