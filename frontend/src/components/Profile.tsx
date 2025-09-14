import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.tsx'
import { Button } from "./ui/button.tsx";

import { AtSign, Heart, MessageCircle } from "lucide-react";

const Profile = () => {
    // --- ALL OF YOUR ORIGINAL LOGIC IS UNCHANGED ---
    const params = useParams();
    const userId = params.id;
    useGetUserProfile(userId);
    const [activeTab, setActiveTab] = useState("posts");
    const { userProfile, user } = useSelector((store: any) => store?.auth);

    const isLoggedInUserProfile = user?._id === userProfile?._id;
    // Note: This is placeholder logic. You'll need to replace it with your actual 'following' state check
    const isFollowing = user?.following?.includes(userProfile?._id);

    const handleTabChange = (tab: any) => {
        setActiveTab(tab);
    };

    const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

    // Added a simple loading state to prevent crashes while userProfile is being fetched
    if (!userProfile) {
        return <div className="text-center p-10 text-muted-foreground">Loading profile...</div>;
    }

    return (
        // --- ALL STYLING AND RESPONSIVE CHANGES ARE BELOW ---
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 bg-background text-foreground">
            {/* Profile Header: Stacks on mobile, side-by-side on desktop */}
            <header className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-border shadow-md">
                        <AvatarImage src={userProfile?.profilePicture} alt='profile_photo' />
                        <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
                            {userProfile?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* User Info & Stats */}
                <section className="flex flex-col items-center md:items-start gap-4 w-full">
                    {/* Top row: Username & Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <h1 className="text-2xl font-light text-foreground">{userProfile?.username}</h1>
                        <div className="flex items-center gap-2">
                            {isLoggedInUserProfile ? (
                                <Link to='/account/edit'>
                                    <Button variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8">Edit Profile</Button>
                                </Link>
                            ) : isFollowing ? (
                                <>
                                    <Button variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8">Unfollow</Button>
                                    <Button variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8">Message</Button>
                                </>
                            ) : (
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/80 h-8">Follow</Button>
                            )}
                        </div>
                    </div>

                    {/* Middle row: Stats */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <p><span className="font-semibold text-foreground">{userProfile?.posts.length}</span> posts</p>
                        <p><span className="font-semibold text-foreground">{userProfile?.followers.length}</span> followers</p>
                        <p><span className="font-semibold text-foreground">{userProfile?.following.length}</span> following</p>
                    </div>

                    {/* Bottom row: Bio */}
                    <div className="text-center md:text-left text-sm">
                        <p className="font-semibold text-foreground">{userProfile?.bio || 'No bio provided.'}</p>
                        <div className="flex items-center justify-center md:justify-start gap-1 text-muted-foreground mt-1">
                            <AtSign size={16} />
                            <span>{userProfile?.username}</span>
                        </div>
                    </div>
                </section>
            </header>

            {/* Tabs & Post Grid */}
            <div className="border-t border-border mt-8 pt-4">
                <div className="flex items-center justify-center gap-10 text-sm font-medium">
                    {/* Changed spans to buttons for better accessibility */}
                    <button onClick={() => handleTabChange('posts')} className={`py-3 ${activeTab === 'posts' ? 'font-semibold text-foreground border-t-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        POSTS
                    </button>
                    <button onClick={() => handleTabChange('saved')} className={`py-3 ${activeTab === 'saved' ? 'font-semibold text-foreground border-t-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        SAVED
                    </button>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-4">
                    {displayedPost?.map((post: any) => (
                        <div key={post?._id} className="relative group cursor-pointer overflow-hidden rounded-md">
                            <img src={post.image} alt="post" className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110" />
                            <div className="absolute inset-0 flex items-center justify-center gap-x-6 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="flex items-center gap-x-1 font-bold"><Heart fill="white" size={18} /> {post.likes.length}</span>
                                <span className="flex items-center gap-x-1 font-bold"><MessageCircle fill="white" size={18} /> {post.comments.length}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;