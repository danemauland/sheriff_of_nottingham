import React from "react";
import {connect} from "react-redux";
import {openModal} from "../../../../actions/modal_actions";
import {AiOutlineInfoCircle} from "react-icons/ai";
import {Link} from "react-router-dom"

let pTextStart = "Make unlimited commission-free trades in stocks, ETFs, and o";
pTextStart += "ptions with Robinhood Financial, as well as buy and sell crypto";
pTextStart += "currencies with Robinhood Crypto. See our ";
const link = <Link to="#" className="dark-green-hover">fee schedule</Link>;
const pTextEnd = " to learn more about cost.";

class Commission extends React.Component {
    constructor(props) {
        super(props)
        this.openModal = this.openModal.bind(this);
    }

    openModal(e) {
        e.preventDefault();
        this.props.openModal("commission")
    }

    render() {
        return (
            <div className="outer-commission-div">
                <div className="commission-div">
                    <div className="inner-commission-div">
                        <h2>Break Free from Commission Fees</h2>
                        <p>{pTextStart}{link}{pTextEnd}</p>
                        <div className="commission-padding-div">
                            <button onClick={this.openModal}>
                                <AiOutlineInfoCircle /> Commissions Disclosure
                            </button>
                        </div>
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