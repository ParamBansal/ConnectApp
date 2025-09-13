import { setMessages } from "@/redux/chatSlice.ts";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector((store: any) => store.socketio);
    const {messages}=useSelector((store:any)=>store.chat)
    useEffect(() => {
        socket?.on('newMessage',(newMessage:any)=>{
            dispatch(setMessages([...messages,newMessage]))
        })
        return ()=>{
            socket?.off('newMessage');
        }
    }, [socket,dispatch]);
};

export default useGetRTM;
