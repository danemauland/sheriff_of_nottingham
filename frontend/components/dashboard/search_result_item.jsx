import React from "react";
import { connect } from "react-redux";

const mapStateToProps = state => ({
    valueIncreased: state.ui.valueIncreased,
})

class SearchResultItem extends React.Component {

    render() {
        return (
            <div className="search-result-item">
                <span>
                    {this.props.result[0]}
                </span>
                <span>
                    {this.props.result[1]}
                </span>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(SearchResultItem)