
import Feed from "./Feed.tsx";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar.tsx";
import useGetAllPost from "@/hooks/useGetAllPost.tsx";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers.tsx";
const Home=()=>{
    useGetAllPost()
    useGetSuggestedUsers()
    return (
        <div className="flex">
            <div className="flex-grow"> 
                <Feed/>
                <Outlet/>

            </div>
            <RightSidebar/>
        </div>
    )
}

export default Home