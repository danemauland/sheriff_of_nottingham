import React from "react";
import { connect } from "react-redux";
import {Link} from "react-router-dom";
import {
    getValueIncreased,
} from "../../../util/extract_from_state_utils";

const mapStateToProps = state => ({
    color: getValueIncreased(state) ? "dark-green" : "red",
});

const mapToSlices = (str, substr, color) => {
    let upCasedStr = str.toUpperCase();
    let upCasedSubstr = substr.toUpperCase();
    const spans = [];
    let key = 0;

    let i = upCasedStr.indexOf(upCasedSubstr);
    
    while (i > -1) {
        spans.push(
            <span key={key++}>
                {str.slice(0,i)}
            </span>
        );

        str = str.slice(i);
        upCasedStr = upCasedStr.slice(i);
        
        spans.push(
            <span key={key++} className={color}>
                {str.slice(0, substr.length)}
            </span>
        );

        str = str.slice(substr.length);
        upCasedStr = upCasedStr.slice(substr.length);

        i = upCasedStr.indexOf(upCasedSubstr);
    }
    
    spans.push(
        <span key={key}>
            {str}
        </span>
    );

    return spans;
}

//TODO: refactor with more semantic variable names once alphaVantage search is set up

const SearchResultItem = ({result, selected, input, color}) => (
    <div className="seach-result-item-wrapper">
        <Link to={`/stocks/${result[0]}`} className={"search-result-item " + (selected ? "selected" : "")} onClick={() => $("body").click()}>
            <span>
                {mapToSlices(result[0], input, color)}
            </span>
            <span>
                {mapToSlices(result[1], input, color)}
            </span>
        </Link>
    </div>
)

export default connect(mapStateToProps, null)(SearchResultItem);