import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.tsx'
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog.tsx'
import { MoreHorizontal } from "lucide-react";
import { Button } from './ui/button.tsx'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MessageCircle, Bookmark } from "lucide-react";
import CommentDialog from "./CommentDialog.tsx";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice.ts";

import { setFollowing } from "@/redux/authSlice.ts";

interface PostProps {
    post: any
}
const Post = ({ post }: PostProps) => {
    // --- ALL OF YOUR ORIGINAL LOGIC IS UNCHANGED ---
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false)
    const changeEventHandler = (e: any) => {
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
    
    const followHandler = async () => {
        try {
            const url = `https://connectapp-k6fs.onrender.com/login/api/v1/user/followorunfollow/${post?.author?._id}`;
            const res = await axios.post(url, {}, { withCredentials: true });

            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setFollowing(res.data.following));
            }
        } catch (error: any) {
            console.error("Follow/Unfollow failed:", error);
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    }
    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`https://connectapp-k6fs.onrender.com/login/api/v1/post/${post?._id}/bookmark`, {
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
            const res = await axios.post(`https://connectapp-k6fs.onrender.com/login/api/v1/post/${post?._id}/comment`, { text }, {
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
            const res = await axios.delete(`https://connectapp-k6fs.onrender.com/login/api/v1/post/delete/${post._id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem: any) => postItem._id != post?._id)
                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
            }
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    }
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false)
    const [postLike, setPostLike] = useState(post.likes.length)
    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like'
            const res = await axios.get(`https://connectapp-k6fs.onrender.com/login/api/v1/post/${post._id}/${action}`, { withCredentials: true })
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes)
                const updatedPostData = posts.map((p: any) => {
                    if (p._id === post._id) {
                        return {
                            ...p,
                            likes: liked
                                ? p.likes.filter((id: any) => id !== user._id)
                                : [...p.likes, user._id]
                        };
                    }
                    return p;
                });
                dispatch(setPosts(updatedPostData))
                setLiked(!liked)
                toast.success(res.data.message);
            }
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    }

    return (
        // --- ALL STYLING CHANGES ARE BELOW ---
        <article className="w-full max-w-xl mx-auto border border-border rounded-xl bg-card text-card-foreground">
            {/* Post Header */}
            <header className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${post?.author?._id}`}>
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={post?.author?.profilePicture} />
                            <AvatarFallback>{post?.author?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Link>
                    <Link to={`/profile/${post?.author?._id}`} className="font-semibold text-sm hover:underline text-foreground">
                        {post.author.username}
                    </Link>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="text-muted-foreground" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-popover text-popover-foreground">
                        {/* More Options Dialog Content */}
                        {post?.author?._id !== user?._id && (
                            <Button onClick={followHandler} variant='ghost' className={`w-full font-bold ${following?.includes(post?.author?._id) ? 'text-destructive' : 'text-primary'}`}>
                                {following?.includes(post?.author?._id) ? 'Unfollow' : 'Follow'}
                            </Button>
                        )}
                        <Button onClick={bookmarkHandler} variant='ghost' className="w-full text-foreground hover:bg-accent hover:text-accent-foreground">Add to favorites</Button>
                        {user?._id === post?.author._id && (
                            <Button onClick={deletePostHandler} variant='ghost' className="w-full text-destructive font-bold hover:bg-destructive/10">Delete Post</Button>
                        )}
                    </DialogContent>
                </Dialog>
            </header>

            {/* Post Image */}
            <div>
                <img className="w-full aspect-square object-cover" src={post.image} alt="post_img" />
            </div>

            {/* Post Actions & Content */}
            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={likeOrDislikeHandler}>
                            {liked ? 
                                <FaHeart size={24} className="text-destructive transition-transform active:scale-125" /> :
                                <FaRegHeart size={24} className="hover:text-muted-foreground transition-transform active:scale-125 text-foreground" />
                            }
                        </button>
                        <button onClick={() => { dispatch(setSelectedPost(post)); setOpen(true); }}>
                            <MessageCircle size={24} className="hover:text-muted-foreground text-foreground" />
                        </button>
                    </div>
                    <button onClick={bookmarkHandler}>
                        <Bookmark size={24} className="hover:text-muted-foreground text-foreground" />
                    </button>
                </div>

                <p className="font-semibold text-sm text-foreground">{postLike} likes</p>
                <p className="text-sm text-foreground">
                    <Link to={`/profile/${post.author?._id}`} className="font-semibold mr-2 hover:underline text-foreground">{post.author?.username}</Link>
                    {post.caption}
                </p>
                {comment.length > 0 && (
                    <button onClick={() => { dispatch(setSelectedPost(post)); setOpen(true) }} className="text-sm text-muted-foreground hover:underline">
                        View all {comment.length} comments
                    </button>
                )}
            </div>

            {/* Add Comment Input */}
            <div className="border-t border-border px-4 py-2 bg-card">
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={text}
                        onChange={changeEventHandler}
                        className="bg-transparent text-sm w-full border-none focus:ring-0 text-foreground placeholder:text-muted-foreground"
                    />
                    {text && (
                        <button onClick={commentHandler} className="text-sm font-semibold text-primary hover:text-primary/80">
                            Post
                        </button>
                    )}
                </div>
            </div>
            <CommentDialog open={open} setOpen={setOpen} />
        </article>
    )
}
export default Post;