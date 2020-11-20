import React from "react";
import { Link } from "react-router-dom";

export default () => (
    <header className="splash-header">
        <div className="grid-container">
            <div className="splash-header-div">
                <div className="splash-header-text-div">
                    <div className="splash-header-text-wrapper">
                        <h1>Investing for Everyone</h1>
                        <p>Nottingham, a pioneer of commission-free investing, gives you more ways to make your money work harder.</p>
                        <div className="header-button-div">
                            <Link className="header-signup rounded-button" to="/signup">Sign Up</Link>    
                        </div>                        
                    </div>
                </div>
                <div className="splash-header-image-div">
                    <div className="splash-header-image-wrapper">
                        <div className="video-control-cover"></div>
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
            </div>
        </div>
    </header>
)