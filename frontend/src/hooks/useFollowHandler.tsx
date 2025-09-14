import { setFollowing } from "@/redux/authSlice.ts";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const followHandler = async (authorId:any) => {

    const dispatch=useDispatch()
        try {
            const url = `http://localhost:8000/api/v1/user/followorunfollow/${authorId}`;
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