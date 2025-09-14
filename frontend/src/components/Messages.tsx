import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";
import { Button } from "./ui/button.tsx";
import useGetAllMessage from "@/hooks/useGetAllMessages.tsx";
import useGetRTM from "@/hooks/useGetRTM.tsx";

interface SelectedUserProps {
    selectedUser: any;
}

const Messages = ({ selectedUser }: SelectedUserProps) => {
    // --- ALL OF YOUR ORIGINAL LOGIC IS UNCHANGED ---
    useGetRTM();
    useGetAllMessage();
    const { messages } = useSelector((store: any) => store.chat);
    const { user } = useSelector((store: any) => store.auth);

    // This ref and effect handle auto-scrolling to the latest message
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Added a simple loading state
    if (!messages) {
        return <div className="p-4 text-center text-gray-500">Loading messages...</div>;
    }

    return (
        // --- ALL STYLING AND RESPONSIVE CHANGES ARE BELOW ---
        <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
                // Welcome message shown only when a conversation is empty
                <div className="flex flex-col items-center justify-center text-center h-full text-gray-500">
                    <Avatar className='h-24 w-24 border-4 border-gray-200'>
                        <AvatarImage className='object-cover' src={selectedUser?.profilePicture} alt='profile' />
                        <AvatarFallback className="text-3xl bg-gray-100">
                            {selectedUser?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold mt-4 text-gray-800">{selectedUser?.username}</h2>
                    <p className="mt-1">This is the beginning of your conversation.</p>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button className="h-8 my-4 bg-gray-100 hover:bg-gray-200 text-gray-800" variant="secondary">View Profile</Button>
                    </Link>
                </div>
            ) : (
                // The list of messages
                <div className="flex flex-col gap-4">
                    {messages.map((msg: any) => {
                        const isSender = msg.senderId === user?._id;
                        return (
                            <div key={msg._id} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`px-4 py-2 rounded-2xl max-w-sm md:max-w-md ${
                                        isSender
                                            ? "bg-sky-500 text-white rounded-br-none"
                                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                                    }`}
                                >
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {/* This empty div is the target for the auto-scroll */}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default Messages;