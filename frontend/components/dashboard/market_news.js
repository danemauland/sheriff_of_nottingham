import {connect} from "react-redux";
import News from "./news"

const mapStateToProps = (state, {ticker}) => ({
    ticker,
    News: state.entities.marketNews,
})

export default (connect(mapStateToProps, null)(News));