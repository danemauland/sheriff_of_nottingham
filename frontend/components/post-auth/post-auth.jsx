import React from "react";
import {
    fetchMarketNews,
    fetchAllCandles,
} from "../../actions/external_api_actions";
import {connect} from "react-redux";
import Loading from "./loading";
import {
    Route,
    Switch,
    Redirect
} from "react-router-dom";
import Header from "./header/header";
import Dashboard from "./dashboard/dashboard_wrapper";
import StockInitializer from "./stocks/stock_initializer";
import {ownedPricesAreLoaded} from "../../util/dashboard_calcs";

const mapStateToProps = ({newEntities, ui}) => {
    const assetInformation = newEntities.assetInformation;
    return ({
        tickers: assetInformation.tickers,
        loading: !ownedPricesAreLoaded(assetInformation),
    })
};

const mapDispatchToProps = dispatch => ({
        fetchAllCandles: tickers => fetchAllCandles(tickers, dispatch),
});



class PostAuth extends React.Component {

    componentDidMount() {
        this.props.fetchAllCandles(this.props.tickers);
    }

    render() {
        if (this.props.loading) return <Loading />;
        
        return (<>
            <Header />
            <Switch>
                <Route exact path ="/" component={Dashboard} />
                <Route exact path ="/stocks" component={StockInitializer} />
                <Route >
                    <Redirect to="/" />
                </Route>
            </Switch>
        </>)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PostAuth);