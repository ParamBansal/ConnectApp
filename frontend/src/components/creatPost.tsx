import  { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog.tsx";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Textarea } from "./ui/textarea.tsx";
import { Button } from "./ui/button.tsx";
import { readFileAsDataURL } from "@/lib/utils.ts";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice.ts";
interface CommentDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void; // This is the type for a React state setter function
}
const CreatePost = ({ open, setOpen }:CommentDialogProps) => {
    const [file, setFile] = useState('')
    const [caption, setCaption] = useState('')
    const [imagePreview, setImagePreview] = useState('')
    const [loading, setLoading] = useState(false)
    const {user}=useSelector((store:any)=>store.auth);
    const dispatch=useDispatch()
    const {posts}=useSelector((store:any)=>store.post)
    const createPostHandler = async () => {


        const formData = new FormData();
        formData.append("caption", caption);
        if (imagePreview) formData.append("image", file);

        try {
            setLoading(true);

            const res=await axios.post('https://connectapp-k6fs.onrender.com/api/v1/post/addpost',formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                withCredentials:true
            })

            if (res.data.success) {
                dispatch(setPosts([res.data.post,...posts]))
                toast.success(res.data.message);
                setOpen(false)
            }
        } catch (error:any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const fileChangeHandler = async (e:any) => {
        const file = e.target.files?.[0]
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file)
            setImagePreview(dataUrl)
        }
    }
    const imageRef = useRef<HTMLInputElement>(null)
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)}>
                <DialogTitle>Create new post</DialogTitle>
                <DialogDescription>
                    Add a photo and caption to create a new post
                </DialogDescription>
                <DialogHeader className="text-center font-semibold">
                    Create New Post
                </DialogHeader>
                <div className="flex gap-3 items-center">
                    <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                        <AvatarImage className="w-full h-full object-cover"  src={user?.profilePicture} alt="img" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="font-semibold text-xs">{user?.username}</h1>
                        <span className="text-gray-600 text-s">{user?.bio}</span>
                    </div>
                </div>
                {
                    imagePreview && (
                        <div className="w-full h-64 flex items-center justify-center">
                            <img className="object-cover w-full h-full rounded-md" src={imagePreview} alt="preview_img" />
                        </div>
                    )
                }
                <Textarea onChange={e => setCaption(e.target.value)} value={caption} className="focus-visible:ring-transparent border-none" placeholder="Write a caption" />
                <input ref={imageRef} type="file" className="hidden" onChange={fileChangeHandler} />
                <Button onClick={() => imageRef.current&&imageRef.current.click()} className="w-fit mx-auto bg-[#0095F6] hover:bg-[#625d92]">Select from computer</Button>
                {
                    imagePreview && (
                        loading ? (
                            <Button>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin">
                                    Please wait
                                </Loader2>
                            </Button>
                        ) : (
                            <Button onClick={createPostHandler} type="submit" className="w-full ">
                                Post
                            </Button>
                        )
                    )
                }
            </DialogContent>
        </Dialog>
    )
}

export default CreatePost