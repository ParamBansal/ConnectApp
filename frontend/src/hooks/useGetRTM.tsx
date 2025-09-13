// 1. Import 'addMessage' instead of 'setMessages'
import { addMessage } from "@/redux/chatSlice.ts";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector((store: any) => store.socketio);
    // You no longer need to select 'messages' here!

    useEffect(() => {
        // Make sure socket is not null before adding a listener
        if (!socket) return;

        const handleNewMessage = (newMessage: any) => {
            // 2. Dispatch the 'addMessage' action with the new message
            dispatch(addMessage(newMessage));
        };

        socket.on('newMessage', handleNewMessage);

        // Cleanup function
        return () => {
            socket.off('newMessage', handleNewMessage);
        };

    // 3. The dependency array is now much cleaner
    }, [socket, dispatch]);
};

export default useGetRTM;