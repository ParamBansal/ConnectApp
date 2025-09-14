import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.tsx';
import { Button } from './ui/button.tsx';
import { Textarea } from './ui/textarea.tsx';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx';

import { Label } from './ui/label.tsx'; 
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { setAuthUser } from '../redux/authSlice.ts';

const EditProfile = () => {
    // --- ALL OF YOUR ORIGINAL LOGIC IS UNCHANGED ---
    const imageRef = useRef<HTMLInputElement>(null);
    const { user } = useSelector((store: any) => store.auth);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePicture: user?.profilePicture,
        bio: user?.bio || '',
        gender: user?.gender
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e: any) => {
        const file = e.target.files?.[0];
        if (file) setInput({ ...input, profilePicture: file });
    }

    const selectChangeHandler = (value: any) => {
        setInput({ ...input, gender: value });
    }
    
    const editProfileHandler = async () => {
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        // Check if profilePicture is a file, not a URL string
        if (input.profilePicture && typeof input.profilePicture !== 'string') {
            formData.append("profilePicture", input.profilePicture);
        }

        try {
            setLoading(true);
            const res = await axios.post('https://connectapp-k6fs.onrender.com/api/v1/user/profile/edit', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user)); // Dispatching the updated user from backend
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    }

    return (
        // --- ALL STYLING AND RESPONSIVE CHANGES ARE BELOW ---
        <div className='container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8'>
            <section className='flex flex-col gap-8 w-full'>
                <h1 className='font-bold text-2xl text-foreground'>Edit Profile</h1>
                
                {/* User info and photo change section */}
                <div className='flex flex-col sm:flex-row items-center justify-between bg-secondary rounded-lg p-4 gap-4'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-14 w-14">
                            <AvatarImage src={user?.profilePicture} alt="profile_photo" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className='font-bold text-base text-foreground'>{user?.username}</h2>
                            <p className='text-muted-foreground text-sm'>{user?.bio || 'Bio here...'}</p>
                        </div>
                    </div>
                    <input ref={imageRef} onChange={fileChangeHandler} type='file' accept="image/*" className='hidden' />
                    <Button onClick={() => imageRef?.current?.click()} className='bg-primary hover:bg-primary/80 text-primary-foreground h-9 w-full sm:w-auto'>Change Photo</Button>
                </div>

                {/* Bio field */}
                <div className="space-y-2">
                    <Label htmlFor="bio" className="font-semibold text-foreground">Bio</Label>
                    <Textarea
                        id="bio"
                        value={input.bio}
                        onChange={(e) => setInput({ ...input, bio: e.target.value })}
                        name='bio'
                        className="bg-input text-foreground"
                        placeholder="Tell us about yourself..."
                    />
                </div>

                {/* Gender field */}
                <div className="space-y-2">
                    <Label className="font-semibold text-foreground">Gender</Label>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-full bg-input text-foreground">
                            <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                        <SelectContent className='bg-popover text-popover-foreground'>
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                
                {/* Submit button */}
                <div className='flex justify-end'>
                    <Button onClick={editProfileHandler} disabled={loading} className='w-fit bg-primary hover:bg-primary/80 text-primary-foreground'>
                        {loading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </div>
            </section>
        </div>
    )
}

export default EditProfile;