import React from "react";

export default () => (
    <div className="splash-header-image-div">
        <div className="splash-header-image-wrapper">
            <video className="splash-video"
                playsInline
                preload="auto"
                loop
                muted={true}
                autoPlay={true}
                src={window.headerVid}
                poster={window.headerPoster}>
            </video>
            <img className="header-overlay"
            draggable="false"
            src={window.headerOverlay}/>
        </div>
    </div>
)

