import React from "react";
import {CgSearch} from "react-icons/cg";
import SearchDropdown from "./search_dropdown.jsx";

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: "",
            focused: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }

    handleChange(e) {
        this.setState({input: e.target.value})
    }

    handleFocus(e) {
        this.setState({focused: true})
        const clickHandler = e => {
            this.setState({ focused: false });
            document.removeEventListener("click", clickHandler)    
        }
        document.addEventListener("click", clickHandler)
    }

    render() {
        return (
            <div className="search-bar-sizer">
                <div className="search-bar-and-dropdown-container" onFocus={this.handleFocus}>
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
                            
                            
                        />
                    </div>
                    <SearchDropdown input={this.state.input} focused={this.state.focused}/>
                </div>
            </div>    
        )
    }
}
export default SearchBar