import React from "react";
import { connect } from "react-redux";
import {
    getSecondsToNextAPIPull,
    getValueIncreased,
} from "../../util/extract_from_state_utils";

const DIVS = new Array(12).fill().map((n, i) => <div key={i}></div>)

const mapStateToProps = state => ({
    increase: getValueIncreased(state),
    secondsToNextAPIPull: getSecondsToNextAPIPull(state),
})

class Loading extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            secondsToNextAPIPull: null,
            isCounting: false,
        }

        this.timeoutFunc = this.timeoutFunc.bind(this);
    }

    timeoutFunc() {
        this.setState({
            secondsToNextAPIPull: this.state.secondsToNextAPIPull - 1,
        });

        if (this.state.secondsToNextAPIPull - 1 > 0) {
            this.countDown();
        } else {
            this.setState({ isCounting: false })
        }
    }

    countDown() {
        this.timeOut = setTimeout(this.timeoutFunc, 1000)
    }

    initiateCountDown() {
        this.setState({
            secondsToNextAPIPull: this.props.secondsToNextAPIPull,
            isCounting: true,
        }, this.countDown())
    }

    componentWillUnmount() {
        clearTimeout(this.timeOut);
    }

    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        if (!this.state.isCounting && this.props.secondsToNextAPIPull) {
            this.initiateCountDown();
        }
    }

    renderCounter() {
        if (this.state.isCounting) return (
            <div>
                Time to next API Pull: {this.state.secondsToNextAPIPull}
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
                                {DIVS}
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