import React from "react";
import { formatDate } from "../../../util/array_and_date_utils";

const newsItem = ({news}) => (
    <a className="news-item" href={news.url}>

                <div className="news-item-text">
                    <span className="news-item-header">
                        <span>{news.source}</span>
                        <span>{formatDate(news.datetime)}</span>
                    </span>

                    <div className="news-item-body">
                        <h3>{news.headline}</h3>
                        <div>{news.summary}</div>
                    </div>
                </div>

                <img loading="lazy" src={news.image}/>

            </a>
)

export default newsItem;