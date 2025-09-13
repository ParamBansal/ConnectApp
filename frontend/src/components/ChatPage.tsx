import  { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback } from './ui/avatar.tsx';
import { AvatarImage } from '@radix-ui/react-avatar';
import { setSelectedUser } from '@/redux/authSlice.ts';
import { Input } from './ui/input.tsx';
import { Button } from './ui/button.tsx';
import {  MessageCircleCode } from 'lucide-react';
import Messages from './Messages.tsx';
import axios from 'axios';
import { addMessage } from '@/redux/chatSlice.ts';


const ChatPage = () => {
    const [textMessage,setTextMessage]=useState("");
    const dispatch = useDispatch();
    const { user, selectedUser } = useSelector((store: any) => store.auth);
    const { suggestedUsers } = useSelector((store: any) => store.auth);
    const {onlineUsers}=useSelector((store:any)=>store.chat)
    // const {messages}=useSelector((store:any)=>store.chat)
    const setSelectHandler = (user:any) => {
        if ((selectedUser) && (selectedUser == user)) {
            dispatch(setSelectedUser(null));
        }
        else {
            dispatch(setSelectedUser(user));
        }
    }
    const sendMessageHandler=async(receiverId:any)=>{
        try{
            const res=await axios.post(`https://connectapp-k6fs.onrender.com/api/v1/message/send/${receiverId}`,{textMessage},{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            })
            if(res.data.success){
                console.log("message sent")
                // dispatch(setMessages([...messages, res.data.newMessage]));
                dispatch(addMessage(res.data.newMessage));
                console.log("message dispatched")


                setTextMessage("");
            }
        }catch(e){
            console.log(e);
        }

    }
    useEffect(()=>{
        return ()=>{
            dispatch(setSelectedUser(null));
        }
    },[]);
    return (
        <div className='flex ml-[16%] h-screen'>
            <section className='w-full md:w-1/4 my-8'>
                <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />
                <div className='overflow-y-auto h-[80vh]'>
                    {
                        suggestedUsers&&suggestedUsers.map((suggestedUser:any) => {
                            const isOnline=onlineUsers.includes(suggestedUser?._id)
                            return (
                                <div onClick={() => setSelectHandler(suggestedUser)} className={`flex gap-3 items-center p-3 hover:bg-gray-300 cursor-pointer ${suggestedUser == selectedUser && 'bg-gray-200'}`}>
                                    <Avatar className='h-14 w-14 overflow-hidden'>
                                        <AvatarImage className='object-top rounded-full h-full w-full object-cover  border-2 border-white' src={suggestedUser?.profilePicture} alt='profile' />

                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className='font-medium '>
                                            {suggestedUser?.username}
                                        </span>
                                        <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                                            {isOnline ? 'online' : 'offline'}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

            </section>
            {
                selectedUser ? (
                    <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
                        <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 stiicky top-0 bg-white z-10'>
                            <Avatar className='h-12 w-12 overflow-hidden'>
                                <AvatarImage className='object-top rounded-full h-full w-full object-cover  border-2 border-white' src={selectedUser?.profilePicture} alt='profile' />

                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col '>
                                <span>{selectedUser?.username}</span>
                            </div>
                        </div>
                        <Messages selectedUser={selectedUser} />
                        <div className='flex items-center p-4 border-t border-t-gray-300'>
                            <Input value={textMessage} onChange={(e)=>setTextMessage(e.target.value)} type='text' className='flex-1 mr-2 focus-visible:ring-transparent' placeholder='Messages...'></Input>
                            <Button onClick={()=>sendMessageHandler(selectedUser?._id)}>Send</Button>
                        </div>
                    </section>
                ) : (
                    <div className='flex flex-col items-center justify-center mx-auto'>
                        <MessageCircleCode className='32 h-32 my-4' />
                        <h1 className='font-medium text-xl'>Your messages</h1>
                        <span>Send a message to start a chat.</span>
                    </div>
                )
            }
        </div>
    )
}
export default ChatPage