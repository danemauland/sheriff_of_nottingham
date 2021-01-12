import React from "react";
import {fetchAllCandles} from "../../actions/external_api_actions";
import {connect} from "react-redux";
import Loading from "./loading";
import {
    Route,
    Switch,
    Redirect
} from "react-router-dom";
import Header from "./header/header";
import Dashboard from "./dashboard/dashboard";
import Stock from "./stocks/stock";
import {ownedPricesAreLoaded} from "../../util/dashboard_calcs";
import {
    getAssetInformation,
    getTickers,
} from "../../util/extract_from_state_utils";
import PostAuthWrapper from "./post-auth_wrapper";

const mapStateToProps = state => {
    const assetInformation = getAssetInformation(state);
    return ({
        assetInformation,
        tickers: getTickers(state),
        loading: !ownedPricesAreLoaded(assetInformation),
    }
)};

const mapDispatchToProps = dispatch => ({
        fetchAllCandles: tickers => fetchAllCandles(tickers, dispatch),
});

class PostAuth extends React.Component {

    componentDidMount() {
        this.props.fetchAllCandles(this.props.tickers);
    }

    renderStock({match: {params: {ticker}}}) {
        const assetInformation = this.props.assetInformation;
        return <Stock ticker={ticker} assetInformation={assetInformation}/>
    }

    render() {
        if (this.props.loading) return <Loading />;

        return (<>
            <Header />
            <PostAuthWrapper>

                <Switch>
                    <Route exact path ="/">
                        <Dashboard />
                    </Route>

                    <Route exact path ="/stocks/:ticker"
                        render={props => this.renderStock(props)}
                    />
                    
                    <Route >
                        <Redirect to="/" />
                    </Route>
                </Switch>
                
            </PostAuthWrapper>
        </>)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostAuth);