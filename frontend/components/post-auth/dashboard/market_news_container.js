import {connect} from "react-redux";
import News from "../news/news"
import {fetchMarketNews} from "../../../actions/external_api_actions";
import {getMarketNews} from "../../../util/extract_from_state_utils";

const mapStateToProps = state => ({news: getMarketNews(state)});

const mapDispatchToProps = dispatch => ({
    fetchNews: () => fetchMarketNews(dispatch),
});

export default (connect(mapStateToProps, mapDispatchToProps)(News));