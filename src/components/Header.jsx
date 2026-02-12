import { IoSettingsOutline } from "react-icons/io5";
import { FaConnectdevelop } from "react-icons/fa6";
import { useState, useEffect } from 'react';

export default function Header() {
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

    return (
      <div className='flex justify-between items-center bg-card/50 text-secondary-foreground border-b border-border p-4'>
        <div className='flex items-center'>
          <FaConnectdevelop className='text-5xl mr-2 pt-2.5 text-primary'/>
          <div> 
            <h1 className='text-xl font-bold'>ConnectToGrow</h1>
            <p className='text-xs text-muted-foreground'>Tool to connect to BE's</p> 
          </div>
        </div>
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
    )
}
