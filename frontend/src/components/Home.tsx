import Feed from "./Feed.tsx";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar.tsx";
import useGetAllPost from "@/hooks/useGetAllPost.tsx";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers.tsx";

const Home = () => {
    useGetAllPost();
    useGetSuggestedUsers();

    return (
        // This flex container centers the content and adds space between the columns on desktop.
        // It also adds padding for mobile.
        <div className="flex w-full justify-center gap-x-12 px-4 py-6">

            {/* Main content container for the feed */}
            <div className="w-full max-w-xl">
                <Feed />
                {/* Kept Outlet as per your original code */}
                <Outlet />
            </div>

            {/* Container for the Right Sidebar */}
            <div className="hidden lg:block w-80">
                <RightSidebar />
            </div>

        </div>
    );
}

export default Home;