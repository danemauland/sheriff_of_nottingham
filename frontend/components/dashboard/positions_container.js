import { connect } from "react-redux";

const mapStateToProps = state => {
    const positions = [];
    Object.values(state.displayedAssets).forEach(pos => {
        if (pos.numShares) {positions.push(pos)}
    })
    return {positions}
}

const mapDispatchToProps = dispatch => ({

})