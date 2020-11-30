import React from "react";
import { connect } from "react-redux";
import {
    extractAboutItems,
} from "../../util/dashboard_calcs";
import StockAboutItem from "./stock_about_item.jsx";

const mapStateToProps = (state, { ticker }) => {
    return ({
        valueIncreased: state.ui.valueIncreased,
        description: state.entities.displayedAssets[ticker].companyOverview.Description,
        items: extractAboutItems(ticker, state),
    })
}

class OwnershipInfo extends React.Component {
    constructor(props) {
        super(props)
        this.defaultState = {
            expanded: false,
            descriptionExpanded: false,
            ticker: "",
        }
        this.state = Object.assign({},this.defaultState, {ticker: this.props.ticker})
        this.toggleExpand = this.toggleExpand.bind(this);
        this.toggleDescriptionExpand = this.toggleDescriptionExpand.bind(this);
        
    }

    resetState() {
        this.setState(Object.assign({}, this.defaultState, { ticker: this.props.ticker }))
    }

    stockChanged() {
        return (this.props.ticker !== this.state.ticker)
    }

    componentDidUpdate() {
        if (this.stockChanged()) {
            this.resetState();
        }
    }

    toggleExpand(e) {
        e.preventDefault()
        this.setState({
            expanded: !this.state.expanded,
        })
    }

    toggleDescriptionExpand(e) {
        e.preventDefault()
        this.setState({
            descriptionExpanded: !this.state.descriptionExpanded,
        })
    }

    generateChartDescription() {
        if (this.state.descriptionExpanded) {
            return this.props.description + " ";
        } else {
            const cutoffIndex = this.props.description.slice(160).indexOf(".") + 161;
            let cutoff = this.props.description.slice(0,cutoffIndex)
            return cutoff + " ";
        }
    }

    getAboutItems() {
        return (this.state.expanded ? this.props.items : this.props.items.slice(0,8))
    }

    render() {
        return (
            <div className="stock-about-positioner">
                    <header className="stock-about-header">
                        <span>
                            <h2>About</h2>
                        </span>
                        <span>
                            <button onClick={this.toggleExpand} className={this.props.valueIncreased ? "green light-green-hover" : "red light-red-hover" }>Show {this.state.expanded ? "Less" : "More"}</button>
                        </span>
                    </header>
                <div className="stock-description-positioner">
                    <span>
                        {this.generateChartDescription()}
                        <button onClick={this.toggleDescriptionExpand} className={this.props.valueIncreased ? "green light-green-hover" : "red light-red-hover"}>Read {this.state.descriptionExpanded ? "Less" : "More"}</button>
                    </span>
                </div>
                <ul className="stock-items">
                    {this.getAboutItems().map((item, i)=> <StockAboutItem key={i} item={item}/>)}
                </ul>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(OwnershipInfo)