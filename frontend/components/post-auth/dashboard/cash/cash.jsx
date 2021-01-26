import React from "react";
import {
    formatToDollar,
    cashFormIsOpen,
    toggleCashForm,
} from "../../../../util/dashboard_calcs";
import {connect} from "react-redux";
import CashForm from "./cash_form.jsx";
import {getCashBalance} from "../../../../util/extract_from_state_utils";
import {
    cashFlashed,
} from "../../../../actions/ui_actions";

const mapStateToProps = state => ({
    cashBal: getCashBalance(state),
    doFlashCash: state.ui.flashCash,
});

const mapDispatchToProps = dispatch => ({
    cashFlashed: () => dispatch(cashFlashed())
});

class Cash extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     expanded: false,
        // }
        this.handleClick = this.handleClick.bind(this);
        this.highlight = this.highlight.bind(this);
    }
    
    handleClick(e) {
        e.preventDefault();

        toggleCashForm();
        
        // this.setState({
        //     expanded: !this.state.expanded
        // });
    }

    componentDidMount() {
        this.componentDidUpdate({doFlashCash: false});
    }

    componentDidUpdate(prevProps) {
        if (this.props.doFlashCash && !prevProps.doFlashCash) {
            this.flashCash();
            this.props.cashFlashed();
        }
    }

    flashCash() {
        const cashContainer = $(".cash-container");
        const cashExpanderButton = $(".cash-expander-button");

        if (!cashContainer.hasClass("cash-container-expanded")) {
            cashExpanderButton.trigger("click");
        }

        cashContainer.addClass("flash");

        window.setTimeout(() => {
            cashContainer.removeClass("flash")
        }, 1000);
    }

    highlight(e) {
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
                        onMouseDown={this.highlight}
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

export default connect(mapStateToProps, mapDispatchToProps)(Cash);