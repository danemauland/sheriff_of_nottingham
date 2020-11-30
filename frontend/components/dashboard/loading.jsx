import React from "react";
import { connect } from "react-redux";

const mapStateToProps = state => ({
    increase: state.ui.valueIncreased,
    apiDebounceStartTime: state.ui.apiDebounceStartTime,
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

    render() {
        return (
            <div className="spinner-container">
                <div>
                    <div className={"lds-spinner " + (this.props.increase ? "lds-spinner-dark-green" : "lds-spinner-red")}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    <div>{this.state.counting ? `Time to next API Pull: ${this.state.secondsUntilNextAPIPull}` : ""}</div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(Loading)