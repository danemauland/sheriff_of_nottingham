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

    render() {
        if (this.props.loading) return <Loading />;
        const assetInformation = this.props.assetInformation;

        return (<>
            <Header />
            <div className="scroll-bar-correction">
                <div className="post-auth-centering-div">
                    <div className="post-auth-main-div">
                        <Switch>
                            <Route exact path ="/">
                                <Dashboard />
                            </Route>

                            <Route 
                                exact path ="/stocks/:ticker"
                                render={props => (
                                    <Stock 
                                        ticker={props.match.params.ticker}
                                        assetInformation={assetInformation}
                                    />
                                )}
                            />

                            <Route >
                                <Redirect to="/" />
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
        </>)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PostAuth);