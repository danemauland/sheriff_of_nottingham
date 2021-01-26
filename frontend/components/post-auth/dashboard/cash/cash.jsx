import React from "react";
import {
    formatToDollar,
    cashFormIsOpen,
    toggleCashForm,
} from "../../../../util/dashboard_calcs";
import {connect} from "react-redux";
import CashForm from "./cash_form.jsx";
import {getCashBalance} from "../../../../util/extract_from_state_utils";

const mapStateToProps = state => ({cashBal: getCashBalance(state)});

class Cash extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     expanded: false,
        // }
        this.handleClick = this.handleClick.bind(this);
        this.flash = this.flash.bind(this);
    }
    
    handleClick(e) {
        e.preventDefault();

        toggleCashForm();
        
        // this.setState({
        //     expanded: !this.state.expanded
        // });
    }

    flash(e) {
        e.preventDefault();

        const tar = $(e.currentTarget);
        
        if (!cashFormIsOpen()) {
            tar.addClass("darkish-gray-background");
            tar.addClass("darkish-gray-background-hover");

            const handleMouseUp = () => {
                tar.removeClass("darkish-gray-background");
                tar.removeClass("darkish-gray-background-hover");

                document.removeEventListener("mouseup", handleMouseUp);
            };

            document.addEventListener("mouseup", handleMouseUp);
        }
    }

    render() {
        return (
            <div className="cash-spacer">
                <div className="cash-container">
                    <button className="cash-expander-button"
                        onClick={this.handleClick}
                        onMouseDown={this.flash}
                    >
                        <div className="cash-button-text-container">
                            <span>Buying Power</span>
                            <span>{formatToDollar(this.props.cashBal)}</span>
                        </div>
                    </button>
                    
                    <CashForm />
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(Cash)