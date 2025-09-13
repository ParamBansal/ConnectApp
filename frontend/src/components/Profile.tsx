import  { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.tsx'
import useGetUserProfile from "@/hooks/useGetUserProfile.tsx";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button.tsx";
import { Badge } from "./ui/badge.tsx";
import { AtSign, Heart, MessageCircle } from "lucide-react";
const Profile = () => {
    const params = useParams()
    const userId = params.id;
    useGetUserProfile(userId);
    const [activeTab, setActiveTab] = useState("posts");
    const { userProfile, user } = useSelector((store: any) => store?.auth)

    const isLoggedInUserProfile = user?._id == userProfile?._id;
    const isFollowing = true;
    const handleTabChange = (tab:any) => {
        setActiveTab(tab);
    }
    const displayedPost = activeTab == 'posts' ? userProfile?.posts : userProfile?.bookmarks
    return (
        <div className=" max-w-5xl justify-center mx-auto pl-10 mt-10">
            <div className="  items-center justify-center">
                <div className="grid grid-cols-2 ">
                    <section className="flex items-center justify-center">
                        <Avatar className="h-32 w-32">
                            <AvatarImage src={userProfile?.profilePicture} alt='profilephoto' />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </section>
                    <section>
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-2">
                                <span>{userProfile?.username}</span>
                                {
                                    isLoggedInUserProfile ? (
                                        <>
                                            <Link to='/account/edit'>
                                                <Button variant="secondary" className="hover:bg-gray-200 h-8 ">Edit profile</Button>
                                            </Link>
                                            {/* <Button variant="secondary" className="hover:bg-gray-200 h-8 ">View archive</Button>
                                            <Button variant="secondary" className="hover:bg-gray-200 h-8 ">Ad tools</Button> */}
                                        </>
                                    ) : (

                                        isFollowing ? (
                                            <>
                                                <Button variant="secondary" className="  h-8 ">Unfollow</Button>
                                                <Button variant="secondary" className="  h-8 ">Message</Button>
                                            </>
                                        ) : (
                                            <Button className="bg-[#0095F6] hover:bg-[#3192d2] h-8 ">Follow</Button>
                                        )

                                    )
                                }
                            </div>
                            <div className="flex items-center gap-4">
                                <p><span className="font-semibold  ">{userProfile?.posts.length}  posts</span></p>
                                <p> <span className="font-semibold  ">{userProfile?.followers.length} followers</span></p>
                                <p> <span className="font-semibold  ">{userProfile?.following.length} following</span></p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold">{userProfile?.bio||'bio here' }</span>
                                <Badge className="w-fit" variant="secondary"><AtSign /><span className="pl-1">{userProfile?.username}</span></Badge>
                                {/* <span>Connect with your favourite ones here</span> */}
                            </div>
                        </div>
                    </section>
                </div>
                <div className="border-t border-t-gray-300 mtt-8 pt-4">
                    <div className="flex items-center justify-center gap-10 text-sm text-gray-500  font-medium">
                        <span onClick={() => handleTabChange('posts')} className={`py-3 cursor-pointer ${activeTab == 'posts' ? 'font-bold text-black border-t border-black' : ''}`}>
                            POSTS
                        </span>
                        <span  onClick={() => handleTabChange('saved')} className={`py-3 cursor-pointer ${activeTab == 'saved' ? 'font-bold text-black border-t border-black' : ''}`}>
                            SAVED
                        </span>
                    
                    </div>
                    <div className="ml-5 mt-4 grid grid-cols-3 gap-1 md:gap-4 ">
                        {
                            displayedPost?.map((post: any) => {
                                return (
                                    <div key={post?._id} className="relative group cursor-pointer overflow-hidden">
                                        <img src={post.image} alt="post image" className="rounded-sm w-full aspect-square object-cover transition-transform duration-300 ease-in-out group-hover:scale-110" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-50 transition-opacity duration-300 ease-in-out">
                                            <div className="flex items-center justify-center gap-x-6 text-white opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out ">
                                                <Button className="flex items-center gap-x-2 hover:text-gray-300">
                                                    <Heart className="w-6 h-6" fill="white" />
                                                    <span className="font-bold text-lg">
                                                        {post.likes.length}
                                                    </span>
                                                </Button>
                                                <Button className="flex items-center gap-x-2 hover:text-gray-300">
                                                    <MessageCircle className="w-6 h-6" fill="white" />
                                                    <span className="font-bold text-lg">
                                                        {post.comments.length}
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Profile