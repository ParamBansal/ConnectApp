import { setPosts } from "@/redux/postSlice.ts";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch(); 

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get(
          "https://connectapp-k6fs.onrender.com/login/api/v1/post/all",
          { withCredentials: true }
        );
        console.log("receive", res);
        if (res.data.success) {
          dispatch(setPosts(res.data.post));
        }
      } catch (error) {
       
        console.log(error);
      }
    };
    fetchAllPost();
  }, [dispatch]); // ✅ Include dispatch in dependencies
};

export default useGetAllPost;
