import { IoSettingsOutline } from "react-icons/io5";
import { FaConnectdevelop } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import { getCurrentUser, clearCurrentUser } from '../config/user';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    const [theme, setTheme] = useState(() =>
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )

    useEffect(() => {
      document.documentElement.classList.toggle('dark', theme)
    }, [theme])

    useEffect(() => {
      const media = window.matchMedia("(prefers-color-scheme: dark)")
      const listener = (e) => setTheme(e.matches)

      setTheme(media.matches)
      media.addEventListener("change", listener)

      return () => media.removeEventListener("change", listener)
    }, [])

    // Update user state when localStorage changes
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentUser(getCurrentUser());
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
      if (confirm('Are you sure you want to logout?')) {
        clearCurrentUser();
        setCurrentUser(null);
        navigate('/profile');
      }
    };

    return (
      <div className='flex justify-between items-center bg-card/50 text-secondary-foreground border-b border-border p-4'>
        <div className='flex items-center'>
          <FaConnectdevelop className='text-5xl mr-2 pt-2.5 text-primary'/>
          <div>
            <h1 className='text-xl font-bold'>ConnectToGrow</h1>
            <p className='text-xs text-muted-foreground'>Tool to connect to BE's</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* User Info */}
          {currentUser && currentUser.uuid && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">{currentUser.uuid}</div>
                <div className="text-xs text-muted-foreground">{currentUser.type}</div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs px-3 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition"
              >
                Logout
              </button>
            </div>
          )}
          {/* Theme Toggle */}
          <div
            onClick={() => setTheme(v => !v)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`cursor-pointer rounded p-2 border border-border ${
              isHovered ? "bg-primary text-secondary-foreground" : "bg-background text-secondary-foreground"
            }`}
          >
            <IoSettingsOutline />
          </div>
        </div>
      </div>
    )
}
