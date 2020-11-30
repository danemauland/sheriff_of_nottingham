import React from "react";
import {parseMonth} from "../../util/chart_utils";

export default class NewsItem extends React.Component{

    getSource() {
        let source = this.props.news.source
        let firstPeriod = source.indexOf(".");
        let secondPeriod = source.slice(firstPeriod + 1).indexOf(".") + firstPeriod + 1;
        if (secondPeriod === firstPeriod) {
            secondPeriod = firstPeriod;
            firstPeriod = source.indexOf("/") + 1;
        }
        return source.slice(firstPeriod + 1, secondPeriod);
    }

    getFormattedDate() {
        let date = new Date(this.props.news.datetime * 1000)
        let month = parseMonth(date);
        month = month[0] + month.slice(1).toLowerCase();
        return month + " " + date.getDate();
    }

    render() {
        return (
            <a className="news-item" href={this.props.news.url}>
                <div className="news-item-text">
                    <span className="news-item-header">
                        <span>{this.getSource()}</span>
                        <span>{this.getFormattedDate()}</span>
                    </span>
                    <div className="news-item-body">
                        <h3>{this.props.news.headline}</h3>
                        <div>{this.props.news.summary}</div>
                    </div>
                </div>
                <img loading="lazy" src={this.props.news.image}/>
            </a>
        )
    }
}