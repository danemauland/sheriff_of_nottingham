import React from "react";
import {CgSearch} from "react-icons/cg";
class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {search: ""}
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({search: e.target.value})
    }

    render() {
        return (
            <div className="search-bar-sizer">
                <div className="search-bar-and-dropdown-container">
                    <div className="search-bar-icon-input-container">
                        <div className="search-icon-container">
                            <CgSearch className="search-icon"/>
                        </div>
                        <input type="search"
                            className="search"
                            autoComplete="off"
                            placeholder="SEE COMMENT IN external_api_actions.js"
                            value={this.state.search}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
            </div>    
        )
    }
}
export default SearchBar