import  { setUserProfile}  from "@/redux/authSlice.ts";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId:any) => {
  const dispatch = useDispatch(); 

  useEffect(() => {
    const fetchUserProfile = async () => {
    
        try {
        const res = await axios.get(
          `https://connectapp-k6fs.onrender.com/api/v1/user/${userId}/profile`,
          { withCredentials: true }
        );

        if (res.data.success) {

          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
       
        console.log(error);
      }
    };
    fetchUserProfile();
  }, [userId]);
};

export default useGetUserProfile;
