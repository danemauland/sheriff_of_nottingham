import React from "react";
import {CgSearch} from "react-icons/cg";
import SearchDropdown from "./search_dropdown.jsx";

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: "",
            focused: false,
            selected: -1
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleKeyStroke = this.handleKeyStroke.bind(this);
        this.clickOffHandler = this.clickOffHandler.bind(this);
    }

    resetState() {
        this.setState({ 
            focused: false,
            input: "",
            selected: -1
        });
    }

    handleEnter(results) {
        const selected = Math.max(this.state.selected, 0);
        const result = results[selected];

        if (result) {
            result.click();
            this.resetState();
        }
    }

    handleArrows(results, e, keyCode) {
        const selected = this.state.selected + (keyCode < 39 ? -1 : 1);
    
        if (selected < 0) {selected = results.length - 1}
        else if (selected === results.length) { selected = 0 }
    
        e.preventDefault();
    
        this.setState({selected});
    }

    handleKeyStroke(e) {
        const results = $(".seach-result-item-wrapper a");
        const keyCode = e.keyCode;

        if (keyCode === 13) { this.handleEnter(results) }
        else if (keyCode === 38 || keyCode === 40) {
            this.handleArrows(results, e, keyCode)
        }
    }

    clickOffHandler() {
        this.resetState();
        document.removeEventListener("click", this.clickOffHandler)
    }

    handleChange(e) {
        this.setState({input: e.target.value});
    }

    handleFocus() {
        this.setState({focused: true});
        document.addEventListener("click", this.clickOffHandler);
    }

    render() {
        return (
            <div className="search-bar-sizer">
                <div className="search-bar-and-dropdown-container"
                    onFocus={this.handleFocus}
                >
                    <div className="search-bar-icon-input-container">
                        <div className="search-icon-container">
                            <CgSearch className="search-icon"/>
                        </div>

                        <input type="text"
                            className="search"
                            autoComplete="off"
                            placeholder="Search"
                            value={this.state.input}
                            onChange={this.handleChange}
                            onKeyDown={this.handleKeyStroke}
                        />
                    </div>

                    <SearchDropdown
                        input={this.state.input}
                        focused={this.state.focused}
                        selected={this.state.selected}
                    />
                </div>
            </div>    
        )
    }
}
export default SearchBar