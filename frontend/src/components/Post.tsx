import  {  useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.tsx'
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog.tsx'
import {  MoreHorizontal } from "lucide-react";
import { Button } from './ui/button.tsx'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MessageCircle, Bookmark } from "lucide-react";
import CommentDialog from "./CommentDialog.tsx";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice.ts";
import { Badge } from "./ui/badge.tsx";
import { setFollowing } from "@/redux/authSlice.ts";

interface PostProps{
    post:any
}
const Post = ({ post }:PostProps) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false)
    const changeEventHandler = (e:any) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText)
        }
        else {
            setText("")
        }
    }
    const dispatch = useDispatch()
    const { following } = useSelector((store: any) => store.auth);
    const { posts } = useSelector((store: any) => store.post)
    const { user } = useSelector((store: any) => store.auth)
    const [comment, setComment] = useState(post.comments)
    // In your Post.tsx component

    const followHandler = async () => {
        try {
            const url = `https://connectapp-k6fs.onrender.com/api/v1/user/followorunfollow/${post?.author?._id}`;
            const res = await axios.post(url, {}, { withCredentials: true });

            if (res.data.success) {
                toast.success(res.data.message);

                // No more filtering or spreading! Just set the new array from the backend.
                dispatch(setFollowing(res.data.following));
            }
        } catch (error:any) {
            console.error("Follow/Unfollow failed:", error);
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    }
    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`https://connectapp-k6fs.onrender.com/api/v1/post/${post?._id}/bookmark`, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        }
        catch (e) {
            console.log(e);

        }
    }
    const commentHandler = async () => {
        try {
            const res = await axios.post(`https://connectapp-k6fs.onrender.com/api/v1/post/${post?._id}/comment`, { text }, {
                headers: {
                    "Content-Type": 'application/json'
                },
                withCredentials: true
            })
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData)
                const updatedPostData = posts.map((p: any) =>
                    p._id == post._id ? {
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
    const deletePostHandler = async () => {
        try {

            const res = await axios.delete(`https://connectapp-k6fs.onrender.com/api/v1/post/delete/${post._id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem: any) => postItem._id != post?._id)
                dispatch(setPosts(updatedPostData))
                console.log("deleted")
                toast.success(res.data.message)
            }
        } catch (error:any) {
            console.log("error in deletion");

            console.log(error);

            toast.error(error.response.data.message)
        }
    }
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false)
    const [postLike, setPostLike] = useState(post.likes.length)
    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like'
            const res = await axios.get(`https://connectapp-k6fs.onrender.com/api/v1/post/${post._id}/${action}`, { withCredentials: true })
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes)
                const updatedPostData = posts.map((p:any) => {
                    if (p._id === post._id) {
                        return {
                            ...p,
                            likes: liked
                                ? p.likes.filter((id:any) => id !== user._id)
                                : [...p.likes, user._id]
                        };
                    }
                    return p;
                });

                dispatch(setPosts(updatedPostData))
                setLiked(!liked)
                toast.success(res.data.message);

            }
        } catch (error:any) {
            console.log(error);

            toast.error(error.response.data.message)
        }
    }
    return (
        <div className="my-8 w-full max-w-sm mx-auto ">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture} alt='post_image' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-3">
                        <h1>{post.author.username}</h1>
                        {user?._id == post.author._id && <Badge className="bg-black text-amber-100 " variant="secondary">Author</Badge>}
                    </div>
                </div>
                <Dialog >
                    <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center ">
                        {
                            post?.author?._id != user?._id && <Button onClick={followHandler} variant='ghost' className={`cursor-pointer w-fit ${following?.includes(post?.author?._id) ? 'text-[#ED4956]' : 'text-green-600'} font-bold`}>
{following?.includes(post?.author?._id) ? 'Unfollow' : 'Follow'}</Button>

                        }
                        <Button onClick={bookmarkHandler} variant='ghost' className="cursor-pointer w-fit ">Add To favorites</Button>
                        {user && user?._id == post?.author._id &&
                            <Button onClick={deletePostHandler} variant='ghost' className="cursor-pointer w-fit ">Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className="rounded-sm my-2 w-full aspect-square object-cover"
                src={post.image} alt="post_img"
            />

            <div className="flex items-center justify-between my-2">
                <div className="flex items-center gap-3">
                    {
                        liked ? <FaHeart onClick={() => likeOrDislikeHandler()} size={'24'} className="cursor-pointer text-red-600" /> :

                            <FaRegHeart onClick={() => likeOrDislikeHandler()} size={'22px'} className="cursor-pointer" />
                    }
                    <MessageCircle onClick={() => { dispatch(setSelectedPost(post)); setOpen(true) }} className="cursor-pointer hover:text-gray-600" />
                    {/* <Send className="cursor-pointer hover:text-gray-600" /> */}
                </div>
                <Bookmark  onClick={bookmarkHandler} className="cursor-pointer hover:bg-amber-200" />
            </div>
            <span className="font-medium block mb-2">{postLike} likes</span>
            <p >
                <span className="font-medium mr-2">{post.author?.username}</span>
                {post.caption}
            </p>
            {
                comment.length > 0 &&
                <span onClick={() => { dispatch(setSelectedPost(post)); setOpen(true) }} className="text-sm cursor-pointer text-gray-400" >View all {comment.length} comments</span>

            }
            <CommentDialog open={open} setOpen={setOpen} />
            <div className="flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={text}
                    onChange={changeEventHandler}
                    className="outline-none text-sm w-full"
                />
                {
                    text &&
                    <span onClick={commentHandler} className="cursor-pointer text-[#3BADF8]">Post</span>
                }
            </div>
        </div>)
}
export default Post