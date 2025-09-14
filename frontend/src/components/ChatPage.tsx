import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode, ArrowLeft, SendHorizonal } from 'lucide-react';
import Messages from './Messages.tsx';
import axios from 'axios';
import { addMessage } from '@/redux/chatSlice';

const ChatPage = () => {
    // --- ALL OF YOUR ORIGINAL LOGIC IS UNCHANGED ---
    const [textMessage, setTextMessage] = useState("");
    const dispatch = useDispatch();
    const { user, selectedUser } = useSelector((store: any) => store.auth);
    const { suggestedUsers } = useSelector((store: any) => store.auth);
    const { onlineUsers } = useSelector((store: any) => store.chat);

    const setSelectHandler = (user: any) => {
        if ((selectedUser) && (selectedUser._id === user._id)) {
            dispatch(setSelectedUser(null));
        } else {
            dispatch(setSelectedUser(user));
        }
    };

    const sendMessageHandler = async (receiverId: any) => {
        if (!textMessage.trim()) return;
        try {
            const res = await axios.post(`https://connectapp-k6fs.onrender.com/login/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(addMessage(res.data.newMessage));
                setTextMessage("");
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    }, [dispatch]);

    return (
        // --- ALL STYLING AND RESPONSIVE CHANGES ARE BELOW ---
        // Main container fills the available space from MainLayout
        <div className='flex h-full border-t border-gray-200'>

            {/* User List (Left Pane) */}
            <section className={`
                ${selectedUser ? 'hidden md:flex' : 'flex'} 
                w-full md:w-1/3 lg:w-1/4 flex-col border-r border-gray-200
            `}>
                <div className='p-4 border-b border-gray-200'>
                    <h1 className='font-bold text-xl'>{user?.username}</h1>
                </div>
                <div className='flex-1 overflow-y-auto'>
                    {suggestedUsers && suggestedUsers.map((suggestedUser: any) => {
                        const isOnline = onlineUsers.includes(suggestedUser?._id);
                        return (
                            <div 
                                key={suggestedUser._id}
                                onClick={() => setSelectHandler(suggestedUser)} 
                                className={`flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer ${selectedUser?._id === suggestedUser._id && 'bg-gray-200'}`}
                            >
                                <div className="relative">
                                    <Avatar className='h-12 w-12'>
                                        <AvatarImage className='object-cover' src={suggestedUser?.profilePicture} alt='profile' />
                                        <AvatarFallback>{suggestedUser?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    {isOnline && <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />}
                                </div>
                                <span className='font-medium'>{suggestedUser?.username}</span>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Message Area (Right Pane) */}
            {selectedUser ? (
                <section className='w-full md:flex-1 flex flex-col h-full'>
                    {/* Header */}
                    <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-200 bg-white'>
                        {/* Back button for mobile */}
                        <Button onClick={() => dispatch(setSelectedUser(null))} variant="ghost" size="icon" className="md:hidden">
                            <ArrowLeft />
                        </Button>
                        <Avatar className='h-10 w-10'>
                            <AvatarImage className='object-cover' src={selectedUser?.profilePicture} alt='profile' />
                            <AvatarFallback>{selectedUser?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">{selectedUser?.username}</span>
                    </div>

                    {/* Messages */}
                    <Messages selectedUser={selectedUser} />

                    {/* Input */}
                    <div className='flex items-center p-4 border-t border-gray-200 bg-white'>
                        <Input 
                            value={textMessage} 
                            onChange={(e) => setTextMessage(e.target.value)} 
                            onKeyPress={(e) => e.key === 'Enter' && sendMessageHandler(selectedUser?._id)}
                            type='text' 
                            className='flex-1 mr-2 text-black' 
                            placeholder='Type a message...'
                        />
                        <Button onClick={() => sendMessageHandler(selectedUser?._id)} className="bg-sky-500 hover:bg-sky-600 text-white">
                            <SendHorizonal />
                        </Button>
                    </div>
                </section>
            ) : (
                <div className='hidden md:flex flex-col items-center justify-center flex-1 text-gray-400'>
                    <MessageCircleCode className='h-32 w-32 my-4' />
                    <h1 className='font-medium text-xl'>Your Messages</h1>
                    <span>Select a conversation to start chatting.</span>
                </div>
            )}
        </div>
    );
};

export default ChatPage;