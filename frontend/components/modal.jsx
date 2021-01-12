import React from "react";
import {closeModal} from "../actions/modal_actions.js";
import { connect } from "react-redux";
import CommissionPrompt from "./pre-auth/splash/commission/commission_prompt";
import { GrClose } from "react-icons/gr";
import {
    getModal,
} from "../util/extract_from_state_utils";

const mapStateToProps = state => ({
    component: getModalComponent(getModal(state)),
});

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch(closeModal()),
});

const getModalComponent = modal => {
    switch (modal) {
        case "commission":
            return <CommissionPrompt />;

        default:
            return null;
    }
}

const Modal = ({component, closeModal}) => (
    <div className="modal-background" onClick={closeModal}>
        <div className="modal-child" onClick={e => e.stopPropagation()}>

            <div className="x-container">
                <button onClick={closeModal}>
                    <GrClose />
                </button>
            </div>
            
            {component}
        </div>
    </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Modal);