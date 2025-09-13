// import React from "react";
import { Outlet } from "react-router-dom";
import LeftSideBar from './LeftSideBar.tsx'
const MainLayout=()=>{
    return (
        <div>
            <LeftSideBar/>
            <Outlet/>
        </div>
        
    )
}

export default MainLayout