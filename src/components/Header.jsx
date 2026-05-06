import { IoSettingsOutline } from "react-icons/io5";
import { FaConnectdevelop } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
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

    const handleLogout = async () => {
      if (confirm('Are you sure you want to logout?')) {
        await logout();
        navigate('/login');
      }
    };

    return (
      <div className='flex justify-between items-center bg-card/50 text-secondary-foreground border-b border-border p-2 sm:p-3 md:p-4'>
        <Link to="/" className='flex items-center hover:opacity-80 transition cursor-pointer'>
          <FaConnectdevelop className='text-3xl sm:text-4xl md:text-5xl mr-1 sm:mr-2 pt-1 sm:pt-2.5 text-primary'/>
          <div className='hidden sm:block'>
            <h1 className='text-base sm:text-lg md:text-xl font-bold'>ConnectToGrow</h1>
            <p className='text-xs text-muted-foreground hidden md:block'>Tool to connect to BE's</p>
          </div>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
          {/* Nav Link: switches between Matches and Home*/}
          {isAuthenticated && (
            <Link
              to={location.pathname === "/matches" ? "/" : "/matches"}
              className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded border border-border hover:bg-primary hover:text-white transition font-medium"
            >
              {location.pathname === "/matches" ? "Home" : "Matches"}
            </Link>
          )}
          {/* User Info */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium">{user.email}</div>
                <div className="text-xs text-muted-foreground">{user.profileType}</div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs px-2 sm:px-3 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition"
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
            className={`cursor-pointer rounded p-1.5 sm:p-2 border border-border ${
              isHovered ? "bg-primary text-secondary-foreground" : "bg-background text-secondary-foreground"
            }`}
          >
            <IoSettingsOutline className="text-sm sm:text-base" />
          </div>
        </div>
      </div>
    )
}
