import React from "react";
import {connect} from "react-redux";

class CommissionPrompt extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                <h2 className="commissions-disclosure-header">Commissions Disclosure</h2>
                <p className="commissions-disclosure-text">Commission-free trading means $0 commission trades placed on self-directed accounts via mobile devices or web. Keep in mind, we may sell your order to a hedgefund so they can skim a little from the top.</p>
            </>
        )
    }
}

export default CommissionPrompt