import  { useState, useRef, useEffect } from "react"
import { Heart, Home, LogOut, MessageCircle, PlusSquare,  } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"

import { setAuthUser } from "@/redux/authSlice.ts"
import CreatePost from "./creatPost.tsx"
import { setPosts, setSelectedPost } from "@/redux/postSlice.ts"
import { Button } from "./ui/button.tsx"
import { setLikeNotification } from "@/redux/rtnSlice.ts"


const LeftSideBar = () => {
    const navigate = useNavigate()
    const { user } = useSelector((store: any) => store.auth);
    const { likeNotification } = useSelector((store: any) => store.realTimeNotification);
    const dispatch = useDispatch()
    const [notifOpen, setNotifOpen] = useState(false)
    const [open, setOpen] = useState(false)
    const [displayedNotifications, setDisplayedNotifications] = useState<any[]>([]);
    // const [displayedNotifications, setDisplayedNotifications] = useState([])
    // const [displayedNotifications, setDisplayedNotifications] = useState([]);
    const [hasViewedNotifications, setHasViewedNotifications] = useState(false)
    // const notificationRef = useRef(null)
    const notificationRef = useRef<HTMLDivElement>(null);
    
    // Handle clicks outside notification popover
    useEffect(() => {
        const handleClickOutside = (event:any) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                if (notifOpen) {
                    setNotifOpen(false)
                    setDisplayedNotifications([])
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [notifOpen])

    // Reset hasViewedNotifications when new notifications arrive
    useEffect(() => {
        if (likeNotification.length > 0) {
            setHasViewedNotifications(false)
        }
    }, [likeNotification.length])

    const LogOutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true })
            if (res.data.success) {
                dispatch(setAuthUser(null))
                dispatch(setSelectedPost(null))
                dispatch(setPosts([]))
                navigate('/login')
                toast.success(res.data.message)
            }
        } catch (error:any) {
            toast.error(error.response.data.message)

        }
    }

    const sidebarHandler = (textType:any) => {
        if (textType == 'Logout') {
            LogOutHandler()
        }
        else if (textType == 'Create') {
            setOpen(true)
        }
        else if (textType == 'Profile') {
            navigate(`/profile/${user?._id}`);
        }
        else if (textType == 'Home') {
            navigate('/')
        }
        else if (textType == 'Messages') {
            navigate('/chat')
        }
    }

    // Handler for notification click
    const handleNotificationClick = () => {
        if (!notifOpen) {
            // Store current notifications to display in popover
            setDisplayedNotifications([...likeNotification])
            // Mark notifications as viewed (this will hide the badge immediately)
            setHasViewedNotifications(true)
            // Clear the badge notifications from Redux store
            dispatch(setLikeNotification([]))
            setNotifOpen(true)
        } else {
            setNotifOpen(false)
            setDisplayedNotifications([])
        }
    }
    
    const SideBarItems = [
        {
            icon: <Home />,
            text: "Home"
        },
        // {
        //     icon: <Search />,
        //     text: "Search"
        // },
        // {
        //     icon: <TrendingUp />,
        //     text: "Explore"
        // },
        {
            icon: <MessageCircle />,
            text: "Messages"
        },
        {
            icon: <Heart />,
            text: "Notifications"
        },
        {
            icon: <PlusSquare />,
            text: "Create"
        },
        {
            icon: <Avatar className="w-6 h-6">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>,
            text: "Profile"
        },
        {
            icon: <LogOut />,
            text: "Logout"
        },

    ]
    
    return (
        <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
            <div className="flex flex-col">
                <h1 className="my-8 pl-6 font-bold text-xl">Connect</h1>
                <div>

                    {SideBarItems.map((item, index) => {
                        if (item.text === "Notifications") {
                            return (
                                <div key={index} className="relative" ref={notificationRef}>
                                    <div 
                                        className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
                                        onClick={handleNotificationClick}
                                    >
                                        {item.icon}
                                        <span>{item.text}</span>
                                        {likeNotification.length > 0 && !hasViewedNotifications && (
                                            <Button
                                                size="icon"
                                                className="rounded-full hover:bg-red-600 h-5 w-5 absolute bottom-6 left-6 bg-red-600"
                                            >
                                                {likeNotification.length}
                                            </Button>
                                        )}
                                    </div>
                                    
                                    {/* Custom Popover */}
                                    {notifOpen && (
                                        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                                            <div>
                                                {displayedNotifications.length === 0 ? (
                                                    <p className="text-sm text-gray-500">No new notifications</p>
                                                ) : (
                                                    displayedNotifications.map((notification:any) => (
                                                        <div key={notification.userId} className="flex items-center gap-2 my-2">
                                                            <Avatar>
                                                                <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                <AvatarFallback>CN</AvatarFallback>
                                                            </Avatar>
                                                            <p className="text-sm">
                                                                <span className="font-bold">{notification.userDetails?.username}</span>{" "}
                                                                liked your post
                                                            </p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        return (
                            <div
                                onClick={() => sidebarHandler(item.text)}
                                key={index}
                                className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
                            >
                                {item.icon}
                                <span>{item.text}</span>
                            </div>
                        )
                    })}

                </div>
            </div>

            <CreatePost open={open} setOpen={setOpen} />
        </div>
    )
}

export default LeftSideBar;