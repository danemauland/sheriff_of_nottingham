import React from "react";
import {formatToDollar} from "../../util/dashboard_calcs";
import {connect} from "react-redux";

const mapStateToProps = state => {
    return ({
        cashBal: state.entities.summary.cashHistory.balances[state.entities.summary.cashHistory.balances.length - 1],
    })
}

class OwnershipInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expanded: false,
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this)
    }
    
    handleClick(e) {
        e.preventDefault();
        $(".cash-form-div").toggleClass("no-height");
        $(".cash-form-div").toggleClass("cash-form-div-expanded");
        $(".cash-container").toggleClass("cash-container-expanded");
        $(".cash-expander-button").toggleClass("cash-button-expanded");
        this.setState({
            expanded: !this.state.expanded
        })
    }

    handleMouseDown(e) {
        e.preventDefault();
        const tar = $(e.currentTarget)
        if (!this.state.expanded) {
            tar.addClass("cash-button-clicked")
            const handleMouseUp = event => {
                tar.removeClass("cash-button-clicked");
                document.removeEventListener("mouseup", handleMouseUp);
            }
            document.addEventListener("mouseup", handleMouseUp)
        }
    }

    render() {
        return (
            <div className="cash-spacer">
                <div className="cash-container">
                    <button className="cash-expander-button" onClick={this.handleClick} onMouseDown={this.handleMouseDown}>
                        <div className="cash-button-text-container">
                            <span>Buying Power</span>
                            <span>{formatToDollar(this.props.cashBal)}</span>
                        </div>
                    </button>
                    <div className="cash-form-div no-height" >
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(OwnershipInfo)