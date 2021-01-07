import {connect} from "react-redux";
import News from "../news/news"

const mapStateToProps = (state, {ticker}) => ({
    ticker,
    news: state.newEntities.marketNews,
})

export default (connect(mapStateToProps, null)(News));