import React from "react";
import { connect } from "react-redux";
import {
    getAPIDebounceStartTime,
    getValueIncreased,
} from "../../util/extract_from_state_utils";

const mapStateToProps = state => ({
    increase: getValueIncreased(state),
    apiDebounceStartTime: getAPIDebounceStartTime(state),
})

class Loading extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            secondsUntilNextAPIPull: null,
            counting: false,
        }

        this.timeoutFunc = this.timeoutFunc.bind(this);
    }

    timeoutFunc() {
        this.setState({
            secondsUntilNextAPIPull: this.state.secondsUntilNextAPIPull - 1,
        });

        if (this.state.secondsUntilNextAPIPull - 1 > 0) {
            this.countDown();
        } else {
            this.setState({ counting: false })
        }
    }

    countDown() {
        this.timeOut = setTimeout(this.timeoutFunc, 1000)
    }

    initiateCountDown() {
        if (this.state.secondsUntilNextAPIPull !== 0) {
            this.setState({
                secondsUntilNextAPIPull: Math.ceil((this.props.apiDebounceStartTime.getTime() + 60000 - new Date().getTime()) / 1000),
                counting: true,
            }, this.countDown())
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeOut);
    }

    componentDidMount() {
        if (this.props.apiDebounceStartTime) {
            this.initiateCountDown();
        }
    }

    componentDidUpdate() {
        if (!this.state.counting) {
            if (this.props.apiDebounceStartTime) {
                this.initiateCountDown();
            }
        }
    }

    renderCounter() {
        if (this.state.counting) return (
            <div>
                Time to next API Pull: ${this.state.secondsUntilNextAPIPull}
            </div>
        );
        return <></>;
    }

    render() {
        const color = (this.props.increase ? "dark-green" : "red");
        const spinnerClasses = `lds-spinner lds-spinner-${color}`;

        return (
            <div className="center">
                <div className="fill-vertically">
                    <div className="spinner-container">
                        <div>
                            <div className={spinnerClasses}>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>

                            {this.renderCounter()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(Loading)