import React from "react";
import {closeModal} from "../actions/modal_actions.js";
import { connect } from "react-redux";
import CommissionPrompt from "./splash/commission/commission_prompt";
import { GrClose } from "react-icons/gr";

const Modal = ({modal, closeModal}) => {
    let component;

    switch (modal) {
        case "commission":
            component = <CommissionPrompt />;
            break;

        default:
            return null;
    }

    return (
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
}

const mapStateToProps = state => ({
    modal: state.ui.modal,
});

const mapDispatchToProps = dispatch => ({
     closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);