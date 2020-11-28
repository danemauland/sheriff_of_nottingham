import React from "react";
import { connect } from "react-redux";
import SearchResultItem from "./search_result_item";

const mapStateToProps = state => ({
    tickers: state.entities.allTickers,
})

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

// strBSearch(["A", "B", "C", "D"], "B") // 1
// strBSearch(["A", "B", "C", "D"], "A") // 0
// strBSearch(["A", "B", "C", "D"], "D") // 3
// strBSearch(["B", "C", "D"], "A") // -1
// strBSearch(["A", "B", "C", "D"], "E") // -1
// strBSearch(["A", "B", "D"], "C") // -1
// strBSearch(["A", "B", "C", "D"], "AA") // -1
// strBSearch(["A", "BA", "C", "D"], "B") // 1
// strBSearch(["A", "BA", "BB", "D"], "B") // 1
// strBSearch(["A", "BA", "BB", "BBC"], "BB") // 2
// strBSearch(["A", "BA", "BB", "D", "E"], "B") // 1
// strBSearch(["A", "BA", "BB", "BC", "E"], "B") // 1
// strBSearch(["BA", "BB", "BC", "E"], "A") // -1
// strBSearch(["BA", "BB", "BC", "E"], "EE") // -1
// strBSearch(["A", "BB", "BC", "E"], "AA") // -1



class SearchDropdown extends React.Component {
    constructor(props) {
        super(props)
    }

    searchItems() {
        let startIndex = 0;
        let endIndex = this.props.tickers.length;
        let midIndex = Math.floor(startIndex + endIndex);
        let found = false;
        upCased = this.props.input.toUpperCase();
        while (!found) {
            for(let i = 0; i < upCased.length; i++) {
                if (this.props.tickers[midIndex][i] < upCased[i]) {
                    endIndex = midIndex;
                } else if (this.props.tickers[midIndex][0] > upCased[i]) {
                    startIndex = midIndex;
                } else if ( i === upCased.length - 1) {
                    found = true;
                }
            }
        }
    }

    getSearchResults() {
        const startIndex = strBSearch(this.props.tickers, this.props.input);
        if (startIndex < 0) return [];
        let breakLoop = false;
        let numTo = 0;
        for (let i = 5; i > 0; i--) {
            if (!breakLoop) {
                if (this.props.tickers[startIndex + i][0].slice(
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
            results.push(this.props.tickers[startIndex + i])
        }
        return results;
    }

    render() {
        if (this.props.focused && this.props.input) {
            const results = this.getSearchResults();
            if (results.length > 0) {
                return (
                    <div className="seach-dropdown-container">
                        <div className="dropdown-header"><p>Stocks</p></div>
                        <div className="results-container">
                            {results.map((result, i) => <SearchResultItem key={i} result={result} input={this.props.input}/>)}
                        </div>
                    </div>
                )
            }
        }
        return <></>
    }  
}

export default connect(mapStateToProps, null)(SearchDropdown)