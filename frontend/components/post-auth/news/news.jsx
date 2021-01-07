import React from "react";
import {withRouter} from "react-router-dom";
import NewsItem from "./news_item";
import Loading from "../loading";

class News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemsToShow: 3,
        }
        this.listenToScroll = this.listenToScroll.bind(this);
    }

    componentDidMount() {
        if (!this.props.hasReceivedNews) this.props.fetchNews();

        window.addEventListener("scroll", this.listenToScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.listenToScroll);
    }

    listenToScroll() {
        const winScroll = $(window).scrollTop() + $(window).height();
        const totHeight = document.documentElement.scrollHeight;

        if (totHeight - winScroll < 450) {
            this.setState({
                itemsToShow: 3 + this.state.itemsToShow,
            });
        }
    }

    componentDidUpdate(prevProps) {
        // if (prevProps.location !== this.props.location) {
        //     this.setState({
        //         itemsToShow: 3,
        //     })
        // } 
    }

    newsItemsToRender() {
        return this.props.news.slice(0,this.state.itemsToShow);
    }

    renderNewsItems() {
        return (
            <ul className="news-items">
                {this.newsItemsToRender().map((news, i) => {
                    return <NewsItem key={i} news={news}/>
                })}
            </ul>
        )
    }

    render() {
        return (
            <div className="news-container">

                <h2 className="news-title">News</h2>

                {this.props.hasReceivedNews ?
                    this.renderNewsItems()
                :
                    <Loading/>
                }
            </div>
        )
    }
}

export default withRouter((News));