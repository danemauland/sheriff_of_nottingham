import React from "react";
import SearchResultItem from "./search_result_item";
import tickers from "../../../util/all_tickers";

// TODO: rework to use alphaVantage search

let strBSearch = (arr, str) => {
    let startIndex = 0;
    let endIndex = arr.length;
    let midIndex;
    let found = false;
    let upCased = str.toUpperCase();
    let result = -1;
    while (!found) {
        midIndex = Math.floor((startIndex + endIndex) / 2);
        if (endIndex - startIndex < 2) {
            found = true;
            if (arr[startIndex][0].slice(0, upCased.length) === upCased) {
                result = startIndex;
            } else if (
                arr[endIndex] !== undefined && 
                arr[endIndex][0].slice(0, upCased.length) === upCased) {
                result = endIndex;
            }
        }
        if (arr[midIndex][0] < upCased) {
            startIndex = midIndex;
        } else if (arr[midIndex][0] > upCased) {
            endIndex = midIndex;
        } else {
            result = midIndex;
            found = true;
        };
    }
    return result;
}

class SearchDropdown extends React.Component {
    searchItems() {
        let startIndex = 0;
        let endIndex = tickers.length;
        let midIndex = Math.floor(startIndex + endIndex);
        let found = false;
        upCased = this.props.input.toUpperCase();
        while (!found) {
            for(let i = 0; i < upCased.length; i++) {
                if (tickers[midIndex][i] < upCased[i]) {
                    endIndex = midIndex;
                } else if (tickers[midIndex][0] > upCased[i]) {
                    startIndex = midIndex;
                } else if ( i === upCased.length - 1) {
                    found = true;
                }
            }
        }
    }

    getSearchResults() {
        const startIndex = strBSearch(tickers, this.props.input);
        if (startIndex < 0) return [];
        let breakLoop = false;
        let numTo = 0;
        for (let i = 5; i > 0; i--) {
            if (!breakLoop) {
                if (tickers[startIndex + i][0].slice(
                        0, this.props.input.length
                    ) === this.props.input.toUpperCase()
                ) {
                    numTo = i;
                    breakLoop = true;
                }
            }
        }
        const results = [];
        for (let i = 0; i < numTo + 1; i++) {
            results.push(tickers[startIndex + i])
        }
        return results;
    }

    render() {
        if (this.props.focused && this.props.input) {
            const results = this.getSearchResults();
            return (
                <div className="seach-dropdown-container">
                    <div className="dropdown-header"><p>{results.length > 0 ? "Stocks" : "We were unable to find any results for your search."}</p></div>
                    <div className="results-container">
                        {results.map((result, i) => <SearchResultItem key={i} result={result} input={this.props.input} selected={this.props.selected === i}/>)}
                    </div>
                </div>
            )
        }
        return <></>
    }  
}

export default SearchDropdown