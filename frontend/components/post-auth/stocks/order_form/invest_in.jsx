import React from "react";
import InvestInOption from "./invest_in_option";
import {BsChevronExpand} from "react-icons/bs";
import InvestInWrapper from "./invest_in_wrapper";

class InvestIn extends React.Component {
    constructor(props) {
        super(props);
        this.clickOffHandler = this.clickOffHandler.bind(this);
        this.toggleExpand = this.toggleExpand.bind(this);
    }

    clickOffHandler() {
        $(".invest-in-options").addClass("hidden");
        $(".invest-in-select").removeClass("shadow");
        document.removeEventListener("click", this.clickOffHandler);
    }

    toggleExpand(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropdown = $(".invest-in-options")
        
        dropdown.toggleClass("hidden");
        $(".invest-in-select").toggleClass("shadow");
        
        if (dropdown.hasClass("hidden")) {
            document.removeEventListener("click", this.clickOffHandler);
        } else {
            document.addEventListener("click", this.clickOffHandler);
        }
    }

    getOptionClassNames(type) {
        let classNames = "pointer-hover ";

        const isSelected = type === this.props.selected;
        if (isSelected) classNames += this.props.color + "-background black";
        else classNames += "darkish-gray-background-hover ";

        return classNames;
    }

    getOptionProps(type) {
        return {
            classNames: this.getOptionClassNames(type),
            type,
            handleSelect: this.props.handleSelect,
        }
    }

    render() {
        const selected = this.props.selected;
        return (
            <InvestInWrapper>
                <button
                    value={selected}
                    onClick={this.toggleExpand}
                >
                    <div className="space-between align-center">
                        <div>{selected}</div>
                        <BsChevronExpand size={15}/>
                    </div>
                </button>

                <div className="invest-in-options hidden">
                    <InvestInOption {...this.getOptionProps("Shares")}/>
                    <InvestInOption {...this.getOptionProps("Dollars")}/>
                </div>
            </InvestInWrapper>
        )
    }
}

export default InvestIn;