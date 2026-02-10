import { useState } from "react"
import ProfileCard from "../components/ProfileCard"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [display, setDisplay] = useState(true)
  const [visible, setVisible] = useState(true)
  const [exitDirection, setExitDirection] = useState("left")

  function handleConnect() {
    setExitDirection("right")
    setTimeout(() => setVisible(false), 10)
  }

  function handleSkip() {
    setExitDirection("left")
    setTimeout(() => setVisible(false), 10)
  }

  return (
    <>
      {display ? (
        <div className="flex flex-col items-center text-center">
          <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 text-primary">
            Welcome to Connect to Grow
          </div>
          <div className="text-muted-foreground max-w-md md:max-w-2xl text-base md:text-lg">
            Start connecting to your BE's
          </div>
          <button
            onClick={() => setDisplay(false)}
            className="shadow-md m-2 md:m-4 bg-card py-0.5 px-1.5 md:py-2 md:px-4 border border-border rounded md:text-base
              hover:bg-card/80 hover:shadow-lg
              active:translate-y-0.5 active:shadow-sm
              transition-transform duration-150"
          >
            START
          </button>
        </div>
      ) : (
        <AnimatePresence>
          {visible && (
            <motion.div
              key="profile-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                x: exitDirection === "left" ? -500 : 500,
                rotate: exitDirection === "left" ? -15 : 15,
                opacity: 0,
                transition: { duration: 0.3 },
              }}
            >
              <ProfileCard onSkip={handleSkip} onConnect={handleConnect} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

