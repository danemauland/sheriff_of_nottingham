import React from "react";
import DashboardMainContent from "./dashboard_main_content";
import Sidebar from "../sidebar";

const Dashboard = () => (
    <>
        <div className="scroll-bar-correction">
            <div className="dashboard-centering-div">
                <div className="dashboard-main-div">
                    <DashboardMainContent />
                    <Sidebar />
                </div>
            </div>
        </div>
    </>
)

export default Dashboard;