import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { toast } from "sonner";
import { setFollowing } from "@/redux/authSlice.ts";
import axios from "axios";

const SuggestedUsers = () => {
    const { suggestedUsers, user } = useSelector((store: any) => store.auth)
    const { following } = useSelector((store: any) => store.auth);
    const dispatch = useDispatch()
    
    if (!user) {
        return <div className="my-10">Loading suggestions...</div>; 
    }

    // Add safety check for suggestedUsers
    if (!suggestedUsers || suggestedUsers.length === 0) {
        return <div className="my-10">No suggestions available</div>; 
    }
    
    const followHandler = async (authorId:any) => {
        try {
            const url = `https://connectapp-k6fs.onrender.com/api/v1/user/followorunfollow/${authorId}`;
            const res = await axios.post(url, {}, { withCredentials: true });

            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setFollowing(res.data.following));
            }
        } catch (error:any) {
            console.error("Follow/Unfollow failed:", error);
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    }
   
    return (
        <div className="my-10">
            <div className="flex items-center justify-between text-sm">
                <h1 className="font-semibold text-gray-600">Suggested for you</h1>
                <span className="ml-2 font-medium cursor-pointer">See All</span>
            </div>
            {
                suggestedUsers.map((user: any) => {
                    // Safety check for following array
                    const isFollowing = following && Array.isArray(following) && following.includes(user?._id);
                    
                    return (
                        <div key={user?._id} className="flex items-center justify-between my-5">
                            <div className="flex items-center gap-2">
                                <Link
                                    to={`/profile/${user?._id}`}
                                    className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                                >
                                    <Avatar className="!w-full !h-full">
                                        <AvatarImage
                                            className="!object-cover !w-full !h-full"
                                            src={user?.profilePicture}
                                            alt='post_image' />
                                        <AvatarFallback className="flex items-center justify-center !w-full !h-full bg-gray-200 text-xs font-semibold text-gray-700">
                                            CN
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className="font-semibold text-sm">
                                        <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                                    </h1>
                                    <span className="text-gray-600 text-sm">{user?.bio || 'Bio here...'}</span>
                                </div>
                            </div>
                            <span 
                                onClick={() => followHandler(user?._id)} 
                                className={`text-xs font-bold cursor-pointer hover:text-[#3495d6] ${
                                    isFollowing ? 'text-red-500' : 'text-blue-500'
                                }`}
                            >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </span>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SuggestedUsers