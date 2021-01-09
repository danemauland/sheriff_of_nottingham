import {connect} from "react-redux";
import News from "../news/news"
import {fetchMarketNews} from "../../../actions/external_api_actions";

const mapStateToProps = ({newEntities : {marketNews}}) => ({
    news: marketNews,
});

const mapDispatchToProps = dispatch => ({
    fetchNews: () => fetchMarketNews(dispatch),
});

export default (connect(mapStateToProps, mapDispatchToProps)(News));