import React from "react";
import Header from "../header/header";
import Summary from "./summary";
import Stock from "../stocks/stock";


const DashboardWrapper = () => (
    <>
        <div className="scroll-bar-correction">
            <div className="dashboard-centering-div">
                <div className="dashboard-main-div">
                    <Summary/>
                </div>
            </div>
        </div>
    </>
)

export default DashboardWrapper;