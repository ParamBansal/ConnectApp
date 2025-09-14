import { Dialog, DialogContent } from "./ui/dialog.tsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.tsx'

import { Button } from "./ui/button.tsx";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment.tsx";
import axios from "axios";
import { setPosts } from "@/redux/postSlice.ts";
import { toast } from "sonner";

interface CommentDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const CommentDialog = ({ open, setOpen }: CommentDialogProps) => {
    // --- ALL OF YOUR ORIGINAL LOGIC IS UNCHANGED ---
    const [text, setText] = useState('')
    const { selectedPost } = useSelector((store: any) => store.post)
    const [comment, setComment] = useState<any[]>(selectedPost?.comments || []);
    const dispatch = useDispatch()
    const { posts } = useSelector((store: any) => store.post)
    const changeEventHandler = (e: any) => {
        const inputText = e.target.value
        if (inputText.trim()) {
            setText(inputText);
        }
        else {
            setText('')
        }
    }
    useEffect(() => {
        if (selectedPost) {
            setComment(selectedPost.comments)
        }
    }, [selectedPost])

    const sendMessageHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`, { text }, {
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

    // Safeguard in case dialog is open without a selected post
    if (!selectedPost) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!max-w-4xl w-full p-0 flex flex-col md:flex-row max-h-[90vh] bg-card text-card-foreground">
                
                {/* Image Section */}
                <div className="w-full md:w-1/2">
                    <img
                        className="w-full h-full object-cover max-h-64 md:max-h-full rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                        alt='post_img'
                        src={selectedPost?.image} />
                </div>

                {/* Comments Section */}
                <div className="w-full md:w-1/2 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex gap-3 items-center">
                            <Link to={`/profile/${selectedPost?.author?._id}`}>
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                                    <AvatarFallback>{selectedPost?.author?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Link>
                            <Link to={`/profile/${selectedPost?.author?._id}`} className="font-semibold text-sm hover:underline text-foreground">
                                {selectedPost?.author?.username}
                            </Link>
                        </div>
                        {/* You can add back the "MoreHorizontal" dialog here if needed */}
                    </div>

                    {/* Comment List (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {comment?.map((commentItem: any) =>
                            <Comment key={commentItem._id} comment={commentItem} />
                        )}
                    </div>

                    {/* Add Comment Input */}
                    <div className="p-3 border-t border-border">
                        <div className="flex items-center gap-2">
                            <input 
                                type="text" 
                                onChange={changeEventHandler} 
                                value={text} 
                                className="w-full outline-none border-none focus:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground" 
                                placeholder="Add a comment..." 
                            />
                            <Button 
                                disabled={!text.trim()} 
                                onClick={sendMessageHandler} 
                                variant='ghost'
                                className="text-primary hover:text-primary/80 font-semibold"
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog;