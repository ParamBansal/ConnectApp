import { Home, MessageCircle, Heart, PlusSquare, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const BottomNavBar = () => {
    const navItems = [
        { to: "/", icon: <Home size={26} /> },
        { to: "/chat", icon: <MessageCircle size={26} /> },
        { to: "#create", icon: <PlusSquare size={26} /> }, // Placeholder for Create modal
        { to: "#notifications", icon: <Heart size={26} /> }, // Placeholder for Notifications
        { to: "/profile/me", icon: <User size={26} /> } // This link might need to be dynamic

    ];

    return (
        // This nav bar is fixed to the bottom, has a background, and is HIDDEN on medium screens and up (md:hidden)
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border p-2 md:hidden">
            <div className="flex justify-around items-center">
                {navItems.map((item, index) => (

                    <NavLink
                        key={index}
                        to={item.to}
                        className={({ isActive }) =>
                            `p-2 rounded-lg ${isActive ? 'text-primary' : 'text-muted-foreground'}`
                        }
                    >
                        {item.icon}
                    </NavLink>
                ))}
                
                    
                        <ThemeToggle hideText={true} />
                  

                
            </div>
        </nav>
    );
}

export default BottomNavBar;