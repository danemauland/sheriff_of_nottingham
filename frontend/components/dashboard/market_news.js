import {connect} from "react-redux";
import News from "./news"

const mapStateToProps = (state, {ticker}) => ({
    ticker,
    News: state.entities.displayedAssets[ticker].companyNews,
})

export default (connect(mapStateToProps, null)(News));