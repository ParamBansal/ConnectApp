import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"; // Adjusted import path for consistency
import { toast } from "sonner";
import { setFollowing } from "@/redux/authSlice.ts";
import axios from "axios";

const SuggestedUsers = () => {
    const { suggestedUsers, user, following } = useSelector((store: any) => store.auth);
    const dispatch = useDispatch();

    // ALL LOGIC IS UNCHANGED
    if (!user) {
        return <div className="mt-8 text-center text-muted-foreground">Loading suggestions...</div>;
    }

    if (!suggestedUsers || suggestedUsers.length === 0) {
        return <div className="mt-8 text-center text-muted-foreground">No suggestions available</div>;
    }

    const followHandler = async (authorId: any) => {
        try {
            const url = `https://connectapp-k6fs.onrender.com/login/api/v1/user/followorunfollow/${authorId}`;
            const res = await axios.post(url, {}, { withCredentials: true });

            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setFollowing(res.data.following));
            }
        } catch (error: any) {
            console.error("Follow/Unfollow failed:", error);
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    };

    return (
        // Removed my-10 as parent component now handles spacing
        <div>
            {/* Header section */}
            <div className="flex items-center justify-between text-sm">
                <h2 className="font-semibold text-muted-foreground">Suggested for you</h2>
                <Link to="#" className="font-semibold text-primary hover:text-primary/80">See All</Link>
            </div>

            {/* List of users with consistent spacing */}
            <div className="flex flex-col gap-y-4 mt-4">
                {suggestedUsers.map((suggestedUser: any) => {
                    const isFollowing = following && Array.isArray(following) && following.includes(suggestedUser?._id);

                    return (
                        <div key={suggestedUser?._id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Link to={`/profile/${suggestedUser?._id}`}>
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage
                                            className="object-cover"
                                            src={suggestedUser?.profilePicture}
                                            alt='avatar' />
                                        <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                                            {suggestedUser?.username?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h3 className="font-semibold text-sm text-foreground">
                                        <Link to={`/profile/${suggestedUser?._id}`} className="hover:underline">{suggestedUser?.username}</Link>
                                    </h3>
                                    <p className="text-muted-foreground text-xs truncate w-40">{suggestedUser?.bio || 'New to Connect'}</p>
                                </div>
                            </div>
                            
                            {/* Changed to a <button> for better accessibility */}
                            <button
                                onClick={() => followHandler(suggestedUser?._id)}
                                className={`text-xs font-bold transition-colors ${
                                    isFollowing ? 'text-destructive hover:text-destructive/80' : 'text-primary hover:text-primary/80'
                                }`}
                            >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SuggestedUsers;