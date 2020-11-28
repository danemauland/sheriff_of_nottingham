import React from "react";

export default props => (
    <div className="spinner-container">
        <div className={"lds-spinner " + (props.increase ? "lds-spinner-dark-green" : "lds-spinner-red")}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
)