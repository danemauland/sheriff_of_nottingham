import React from "react";
import HeaderText from "./header_text";
import HeaderImg from "./header_img";

export default () => (
    <header className="splash-header">
        <div className="grid-container">
            <div className="splash-header-div">
                <HeaderText />
                <HeaderImg />
            </div>
        </div>
    </header>
)