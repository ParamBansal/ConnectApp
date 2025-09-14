// import React from "react";
import { Outlet } from "react-router-dom";
import LeftSideBar from './LeftSideBar.tsx';
import BottomNavBar from "./BottomNavBar.tsx"; // We need to add this for mobile

const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* LeftSideBar will be controlled by its own responsive classes in the next step */}
            <LeftSideBar />
           
            {/* Main content area */}
            <main className="w-full md:ml-[16%] pb-16 md:pb-0">
                <Outlet />
            </main>

            {/* This new component will only be visible on mobile screens */}
            <BottomNavBar />
        </div>
    );
}

export default MainLayout;