
// import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";
import { Button } from "./ui/button.tsx";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessages.tsx";
import useGetRTM from "@/hooks/useGetRTM.tsx";
interface SelectedUserProps {
    selectedUser: any;
 // Using `any` is the quickest fix. Later, you can define a proper Post type.
  }
const Messages = ({ selectedUser }:SelectedUserProps) => {
    useGetRTM()
    useGetAllMessage()
    const { messages } = useSelector((store: any) => store.chat)
    const { user } = useSelector((store: any) => store.auth);
    return (
        <div className="overflow-y-auto flex-1 p-4">
            <div className="flex justify-center">
                <div className="flex flex-col items-center justify-center">
                    <Avatar className='h-20 w-20 overflow-hidden'>
                        <AvatarImage className='object-top rounded-full h-full w-full object-cover  border-2 border-white' src={selectedUser?.profilePicture} alt='profile' />

                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button className="h-8 my-2 " variant="secondary">View Profile</Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col gap-3 ">
                {
                    messages && messages.map((msg:any) => {
                        console.log("msg.senderId:", msg.senderId, "user._id:", user?._id);

                        return (
                            <div
                                key={msg._id}
                                className={`flex ${msg.senderId == user?._id ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`px-4 py-2 rounded-xl max-w-xs ${msg.senderId == user?._id
                                            ? "bg-blue-500 text-white rounded-br-none"
                                            : "bg-gray-200 text-black rounded-bl-none"
                                        }`}
                                >
                                    {msg.message}
                                </div>
                            </div>

                        )
                    })
                }
            </div>
        </div>
    )
}
export default Messages