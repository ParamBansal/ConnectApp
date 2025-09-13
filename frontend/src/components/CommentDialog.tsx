import { Dialog, DialogContent,DialogTrigger } from "./ui/dialog.tsx";
import  { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.tsx'
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment.tsx";

import axios from "axios";
import { setPosts } from "@/redux/postSlice.ts";
import { toast } from "sonner";
interface CommentDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void; // This is the type for a React state setter function
}
const CommentDialog = ({ open, setOpen }:CommentDialogProps) => {
    const [text,setText]=useState('')
    const {selectedPost}=useSelector((store:any)=>store.post)
    // const [comment,setComment]=useState([])
    const [comment, setComment] = useState<any[]>(selectedPost?.comments||[]);
    const dispatch=useDispatch()
    const {posts}=useSelector((store:any)=>store.post)
    const changeEventHandler=(e:any)=>{
        const inputText=e.target.value
        if(inputText.trim()){
            setText(inputText);
        }
        else{
            setText('')
        }
    }
    useEffect(()=>{
        setComment(selectedPost?.comments)
    },[selectedPost])
 
    const sendMessageHandler = async () => {
        try {
            const res = await axios.post(`https://connectapp-k6fs.onrender.com/api/v1/post/${selectedPost?._id}/comment`, { text }, {
                headers: {
                    "Content-Type": 'application/json'
                },
                withCredentials: true
            })
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData)
                const updatedPostData = posts?.map((p: any) =>
                    p._id == selectedPost._id ? {
                        ...p, comments: updatedCommentData
                    } : p
                )
                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
                setText("")
            }
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <Dialog  open={open}>
            <DialogContent className="!max-w-5xl w-full p-0 flex" onInteractOutside={() => setOpen(false)}>
                <div className="flex flex-1">
                    <div className="w-1/2">
                        <img
                            className="w-full h-full object-cover rounded-l-lg"
                            alt='post_img'
                            src={selectedPost?.image} />
                    </div>
                    <div className="w-1/2 flex flex-col">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex gap-3 items-center">
                                <Link to='/'>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link to='/'className="font-semibold text-xs">
                                        {selectedPost?.author?.username}
                                    </Link>
     
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className="cursor-pointer"/>

                                </DialogTrigger >
                                <DialogContent className="flex flex-col text-center items-center text-sm">
                                    <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                                        Unfollow
                                    </div >
                                    <div className="cursor-pointer w-full">
                                        Add to favorite
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className="flex-1 overflow-y-auto max-h-96 p-4">
       
                            {  
                                comment?.map((comment:any)=>
                                    <Comment key={comment._id} comment={comment}/>
                                )
                            }
                        </div>
                        <div className="p-4">
                            <div className="flex items-center gap-2">
                                <input type="text" onChange={changeEventHandler} value={text} className="w-full outline-none border-gray-300 p-2 rounded" placeholder="Add a comment" />
                                <Button disabled={!text.trim()} onClick={sendMessageHandler}  variant='outline'>Send</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>

        </Dialog>
    )
}
export default CommentDialog