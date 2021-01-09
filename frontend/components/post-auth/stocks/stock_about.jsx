import React from "react";
import { connect } from "react-redux";
import {
    extractAboutItems,
    getCutoffDescription,
} from "../../../util/dashboard_calcs";
import StockAboutItem from "./stock_about_item.jsx";

const mapStateToProps = (
    {newEntities: {assetInformation}, ui: {valueIncreased}},
    { ticker }
) => ({
    valueIncreased,
    description: assetInformation.companyOverviews[ticker].Description,
    items: extractAboutItems(ticker, assetInformation),
});

class StockAbout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            descriptionExpanded: false,
        };

        this.toggleExpand = this.toggleExpand.bind(this);
        this.toggleDescriptionExpand = this.toggleDescriptionExpand.bind(this);
    }

    toggleExpand(e) {
        e.preventDefault();

        this.setState({
            expanded: !this.state.expanded,
        });
    }

    toggleDescriptionExpand(e) {
        e.preventDefault();

        this.setState({
            descriptionExpanded: !this.state.descriptionExpanded,
        });
    }

    generateChartDescription() {
        const description = this.props.description;
        const expanded = this.state.descriptionExpanded;

        return (expanded ? description : getCutoffDescription(description))+" ";
    }

    getAboutItems() {
        const items = this.props.items;

        return (this.state.expanded ? items : items.slice(0,8));
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

export default connect(mapStateToProps, null)(StockAbout)