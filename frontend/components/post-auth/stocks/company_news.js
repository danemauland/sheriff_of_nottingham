import {connect} from "react-redux";
import News from "../news/news"
import {fetchCompanyNews} from "../../../actions/external_api_actions";

const mapStateToProps = ({newEntities: {assetInformation}}, {ticker}) => ({
    news: assetInformation.companyNews[ticker] || [],
});

const mapDispatchToProps = (dispatch, {ticker}) => ({
    fetchNews: () => fetchCompanyNews(ticker, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(News);