import {connect} from "react-redux";
import News from "../news/news"

const mapStateToProps = (state, {ticker}) => ({
    ticker,
    news: state.newEntities.assetInformation.companyNews[ticker],
})

export default (connect(mapStateToProps, null)(News));