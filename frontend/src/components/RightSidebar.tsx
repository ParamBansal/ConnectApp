import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.tsx'
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers.tsx";

const RightSidebar = () => {
    const { user } = useSelector((store: any) => store.auth);

    return (
        <aside className="w-full">
            {/* User profile preview section */}
            <div className="flex items-center gap-4">
                <Link to={`/profile/${user?._id}`}>
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user?.profilePicture} alt='post_image' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex flex-col">
                    <h1 className="font-semibold text-sm text-foreground">
                        <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                    </h1>
                    <span className="text-muted-foreground text-sm">{user?.bio || 'Bio here...'}</span>
                </div>
            </div>
            
            <div className="mt-8">
                <SuggestedUsers />
            </div>
        </aside>
    );
};

export default RightSidebar;