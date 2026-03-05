import { useState, useEffect } from "react"
import ProfileCard from "../components/ProfileCard"
import { motion, AnimatePresence } from "framer-motion"
import { businessExpertApi } from "../services/api"
import { likeApi } from "../services/api"
import { currentUser, getSwipeTargetType } from "../config/user"

export default function Home() {
  const [display, setDisplay] = useState(true)
  const [visible, setVisible] = useState(true)
  const [exitDirection, setExitDirection] = useState("left")
  const [currentProfile, setCurrentProfile] = useState(null)
  const [currentProfileId, setCurrentProfileId] = useState(1)
  const [loading, setLoading] = useState(false)
  const [matchNotification, setMatchNotification] = useState(null)

  // Fetch next profile
  const fetchNextProfile = async () => {
    setLoading(true)
    try {
      const targetType = getSwipeTargetType()
      let profile = null

      // Try to fetch the next profile by incrementing ID
      // If it fails, try the next ID
      for (let attempts = 0; attempts < 10; attempts++) {
        try {
          if (targetType === "BE") {
            profile = await businessExpertApi.getById(currentProfileId + attempts)
          }
          if (profile) {
            setCurrentProfileId(currentProfileId + attempts)
            setCurrentProfile(profile)
            break
          }
        } catch (err) {
          // Profile not found, try next ID
          continue
        }
      }

      if (!profile) {
        setCurrentProfile(null)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      setCurrentProfile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!display && !currentProfile && !loading) {
      fetchNextProfile()
    }
  }, [display, currentProfile])

  async function handleConnect() {
    setExitDirection("right")
    setTimeout(() => setVisible(false), 10)

    // Send like to backend
    try {
      await likeApi.create(currentUser.uuid, currentProfile.uuid)

      // Check if it's a match by seeing if the other person liked us back
      try {
        const reciprocalLike = await likeApi.check(currentProfile.uuid, currentUser.uuid)
        if (reciprocalLike && reciprocalLike.id) {
          setMatchNotification("It's a Match! 🎉")
          setTimeout(() => setMatchNotification(null), 3000)
        }
      } catch (err) {
        // No reciprocal like exists
      }
    } catch (error) {
      console.error("Error creating like:", error)
    }

    // Load next profile
    setTimeout(() => {
      setVisible(true)
      setCurrentProfile(null)
      setCurrentProfileId((prev) => prev + 1)
    }, 300)
  }

  function handleSkip() {
    setExitDirection("left")
    setTimeout(() => setVisible(false), 10)

    // Load next profile
    setTimeout(() => {
      setVisible(true)
      setCurrentProfile(null)
      setCurrentProfileId((prev) => prev + 1)
    }, 300)
  }

  return (
    <div className="flex items-center justify-center h-full relative">
      {/* Match notification */}
      <AnimatePresence>
        {matchNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-lg shadow-lg z-50 font-bold text-lg"
          >
            {matchNotification}
          </motion.div>
        )}
      </AnimatePresence>

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
        <AnimatePresence mode="wait">
          {visible && currentProfile && (
            <motion.div
              key={currentProfile.uuid}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                x: exitDirection === "left" ? -500 : 500,
                rotate: exitDirection === "left" ? -15 : 15,
                opacity: 0,
                transition: { duration: 0.3 },
              }}
            >
              <ProfileCard
                profile={currentProfile}
                userType={getSwipeTargetType()}
                onSkip={handleSkip}
                onConnect={handleConnect}
                loading={loading}
              />
            </motion.div>
          )}
          {visible && !currentProfile && !loading && (
            <div className="text-center text-muted-foreground">
              <div className="text-xl mb-4">No more profiles available</div>
              <button
                onClick={() => {
                  setCurrentProfileId(1)
                  setDisplay(true)
                }}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
              >
                Start Over
              </button>
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

