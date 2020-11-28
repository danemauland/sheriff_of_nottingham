import React from "react";
import { connect } from "react-redux";
import {Link} from "react-router-dom";

const mapStateToProps = state => ({
    valueIncreased: state.ui.valueIncreased,
})

class SearchResultItem extends React.Component {

    mapToSlices(str, substr) {
        let upCasedStr = str.toUpperCase();
        let upCasedSubstr = substr.toUpperCase();
        let i = upCasedStr.indexOf(upCasedSubstr);
        const spans = [];
        let key = 0;
        while (i > -1) {
            spans.push(<span key={key++}>{str.slice(0,i)}</span>)
            str = str.slice(i);
            upCasedStr = upCasedStr.slice(i);
            spans.push(<span key={key++} className={this.props.valueIncreased ? "dark-green" : "red"}>{str.slice(0, substr.length)}</span>);
            str = str.slice(substr.length);
            upCasedStr = upCasedStr.slice(substr.length);
            i = upCasedStr.indexOf(upCasedSubstr);
        }
        spans.push(<span key={key}>{str}</span>);
        return spans;
    }

    render() {
        return (
            <div>
                <Link to={`stocks/${this.props.result[0]}`} className="search-result-item">
                    <span>
                        {this.mapToSlices(this.props.result[0], this.props.input)}
                    </span>
                    <span>
                        {this.mapToSlices(this.props.result[1], this.props.input)}
                    </span>
                </Link>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(SearchResultItem)