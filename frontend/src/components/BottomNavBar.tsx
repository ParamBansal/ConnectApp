import { Home, MessageCircle, Heart, PlusSquare, User, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import CreatePost from './creatPost';
import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice.ts';
import axios from 'axios';
import { Button } from './ui/button.tsx';

const BottomNavBar = () => {
    const [open, setOpen] = useState(false); // For CreatePost modal
    const [profileOpen, setProfileOpen] = useState(false); // For profile dropdown
    const profileRef = useRef<HTMLDivElement>(null);
    const { user } = useSelector((store: any) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle click outside profile dropdown to close it
    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            const res = await axios.get('https://connectapp-k6fs.onrender.com/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const navItems = [
        { to: "/", icon: <Home size={26} /> },
        { to: "/chat", icon: <MessageCircle size={26} /> },
        { to: "#create", icon: <PlusSquare size={26} />, action: () => setOpen(true) },
        { to: "#notifications", icon: <Heart size={26} /> } // Placeholder for notifications
    ];

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border p-2 md:hidden">
                <div className="flex justify-around items-center relative">
                    {navItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.to}
                            onClick={item.action}
                            className={({ isActive }) =>
                                `p-2 rounded-lg ${isActive ? 'text-primary' : 'text-muted-foreground'}`
                            }
                        >
                            {item.icon}
                        </NavLink>
                    ))}

                    {/* Profile icon with dropdown */}
                    <div ref={profileRef} className="relative">
                        <Button
                            onClick={() => setProfileOpen(!profileOpen)}
                            variant="ghost"
                            className="p-2"
                        >
                            <User size={26} />
                        </Button>

                        {profileOpen && (
                            <div className="absolute bottom-10 right-0 w-40 bg-popover border border-border rounded-lg shadow-lg p-2 flex flex-col gap-2 z-50">
                                <Button
                                    variant="ghost"
                                    className="justify-start"
                                    onClick={() => {
                                        navigate(`/profile/${user?._id}`);
                                        setProfileOpen(false);
                                    }}
                                >
                                    View Profile
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="justify-start text-red-600"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </div>
                        )}
                    </div>

                    <ThemeToggle hideText={true} />
                </div>
            </nav>

            {/* CreatePost modal */}
            <CreatePost open={open} setOpen={setOpen} />
        </>
    );
};

export default BottomNavBar;
