import React from "react";
import DashboardMainContent from "./dashboard_main_content";
import SidebarWrapper from "../sidebar_wrapper";
import DashboardSidebar from "./dashboard_sidebar";

const Dashboard = () => (
    <>
        <DashboardMainContent />
        <SidebarWrapper>
            <DashboardSidebar />    
        </SidebarWrapper>
    </>
)

export default Dashboard;