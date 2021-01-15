import {connect} from "react-redux";
import News from "../news/news"
import {fetchCompanyNews} from "../../../actions/external_api_actions";
import {
    getCompanyNews,
} from "../../../util/extract_from_state_utils";

const mapStateToProps = (state, {ticker}) => ({
    news: getCompanyNews(state, ticker) || [],
});

const mapDispatchToProps = (dispatch, {ticker}) => ({
    fetchNews: () => fetchCompanyNews(ticker, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(News);