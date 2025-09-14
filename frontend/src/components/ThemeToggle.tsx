import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';

interface ThemeToggleProps {
    
    hideText?: boolean;
  }

const ThemeToggle = ({hideText = false}:ThemeToggleProps) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkTheme = () => {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const root = document.documentElement;

            if (root.classList.contains('dark')) {
                setIsDarkMode(true);
            } else if (prefersDark) {
                root.classList.add('dark');
                setIsDarkMode(true);
            } else {
                root.classList.remove('dark');
                setIsDarkMode(false);
            }
        };

        checkTheme();
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkTheme);
        return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', checkTheme);
    }, []);

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        setIsDarkMode(!isDarkMode);
    };

    return (
        <Button

            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="   rounded-full"
        >
            <p
                className={`
    flex items-center gap-2 cursor-pointer 
    px-2 py-2 rounded-full font-medium text-sm 
    transition-colors duration-300
    ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
  `}
            >
                <span>
                    {!hideText&& (isDarkMode ? "Change to light mode" : "Change to Dark Mode")}
                </span>
                <span className="flex-shrink-0">
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </span>
            </p>

        </Button>
    );
};

export default ThemeToggle;