import React from "react";
import { connect } from "react-redux";
import {
    extractAboutItems,
    getCutoffDescription,
} from "../../../util/dashboard_calcs";
import StockAboutItem from "./stock_about_item";
import StockAboutHeader from "./stock_about_header";
import StockAboutDescription from "./stock_about_description";

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

    get items() {
        const items = this.props.items;

        return (this.state.expanded ? items : items.slice(0,8));
    }

    get description() {
        const description = this.props.description;
        const expanded = this.state.descriptionExpanded;

        return (expanded ? description : getCutoffDescription(description))+" ";
    }

    get className() {
        const color = this.props.valueIncreased ? "green" : "red";
        return `${color} light-${color}-hover`;
    }

    get toggleType() {
        return this.state.expanded ? "Less" : "More";
    }

    render() {
        return (
            <div className="stock-about-positioner">
                <StockAboutHeader 
                    className={this.className}
                    toggle={this.toggleExpand}
                    toggleType={this.toggleType}
                />

                <StockAboutDescription 
                    className={this.className}
                    toggle={this.toggleDescriptionExpand}
                    toggleType={this.toggleType}
                    desc={this.description}
                />

                <ul className="stock-items">
                    {this.items.map((item, i)=> (
                        <StockAboutItem key={i} item={item}/>
                    ))}
                </ul>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(StockAbout)