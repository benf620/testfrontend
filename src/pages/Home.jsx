import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import ProfileCard from "../components/ProfileCard"
import { motion, AnimatePresence } from "framer-motion"
import { feedApi, likeApi, nwkrApi, businessExpertApi } from "../services/api"
import { useAuth } from "../context/AuthContext"

export default function Home() {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const [display, setDisplay] = useState(true)
  const [visible, setVisible] = useState(true)
  const [exitDirection, setExitDirection] = useState("left")
  const [currentProfile, setCurrentProfile] = useState(null)
  const [feedProfiles, setFeedProfiles] = useState([])
  const [feedIndex, setFeedIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [matchNotification, setMatchNotification] = useState(null)
  const [error, setError] = useState(null)
  const [checkingProfile, setCheckingProfile] = useState(true)

  // Get the user's profile ID based on their type
  const getUserUuid = () => {
    if (!authUser) return null;
    const profileId = authUser.profileType === "NWKR" ? authUser.nwkrId : authUser.businessExpertId;
    const prefix = authUser.profileType === "NWKR" ? "NWKR-" : "BE-";
    return profileId ? `${prefix}${profileId}` : null;
  };

  const currentUserUuid = getUserUuid();

  // Check if user has completed their profile before allowing access
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!authUser) {
        setCheckingProfile(false);
        return;
      }

      try {
        const profileId = authUser.profileType === "NWKR" ? authUser.nwkrId : authUser.businessExpertId;
        if (!profileId) {
          // No profile exists, redirect to create one
          navigate('/profile', {
            state: { message: 'Please create your profile to start matching' }
          });
          return;
        }

        // Fetch the user's profile to check if it's complete
        let profile;
        if (authUser.profileType === "NWKR") {
          profile = await nwkrApi.getById(profileId);
        } else {
          profile = await businessExpertApi.getById(profileId);
        }

        // Check if profile has basic required fields filled (name is mandatory)
        if (!profile || !profile.name || profile.name.trim() === '') {
          // Profile incomplete, redirect to profile page
          navigate('/profile', {
            state: { message: 'Please complete your profile before matching with others' }
          });
          return;
        }

        // Profile is complete, allow access
        setCheckingProfile(false);
      } catch (err) {
        console.error('Error checking profile:', err);
        setCheckingProfile(false);
      }
    };

    checkUserProfile();
  }, [authUser, navigate]);

  // Fetch feed profiles
  const fetchFeed = async () => {
    if (!currentUserUuid) {
      setError("Please create a profile first in the Profile page")
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const profiles = await feedApi.getFeed(currentUserUuid, 10)
      setFeedProfiles(profiles)
      setFeedIndex(0)
      if (profiles && profiles.length > 0) {
        setCurrentProfile(profiles[0])
      } else {
        setCurrentProfile(null)
      }
    } catch (error) {
      console.error("Error fetching feed:", error)
      setError("Failed to load profiles. Please try again.")
      setCurrentProfile(null)
      setFeedProfiles([])
    } finally {
      setLoading(false)
    }
  }

  // Load next profile from feed
  const loadNextProfile = () => {
    const nextIndex = feedIndex + 1
    if (nextIndex < feedProfiles.length) {
      setFeedIndex(nextIndex)
      setCurrentProfile(feedProfiles[nextIndex])
    } else {
      // Feed exhausted, try to fetch more
      setCurrentProfile(null)
    }
  }

  useEffect(() => {
    if (!display && feedProfiles.length === 0 && !loading) {
      fetchFeed()
    }
  }, [display])

  async function handleConnect() {
    setExitDirection("right")
    setTimeout(() => setVisible(false), 10)

    // Send like to backend
    try {
      await likeApi.create(currentUserUuid, currentProfile.uuid)

      // Check if it's a match by seeing if the other person liked us back
      try {
        const reciprocalLike = await likeApi.check(currentProfile.uuid, currentUserUuid)
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
      loadNextProfile()
    }, 300)
  }

  function handleSkip() {
    setExitDirection("left")
    setTimeout(() => setVisible(false), 10)

    // Load next profile
    setTimeout(() => {
      setVisible(true)
      loadNextProfile()
    }, 300)
  }

  // Show loading while checking profile
  if (checkingProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-muted-foreground">Checking your profile...</div>
      </div>
    )
  }

  // Show error if no user logged in or no profile created
  if (!authUser || !currentUserUuid) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="text-xl font-bold mb-4 text-primary">No Profile Found</div>
          <div className="text-muted-foreground mb-6">
            Please create your profile first to start swiping.
          </div>
          <Link
            to="/profile"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            Create Profile
          </Link>
        </div>
      </div>
    )
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

      {/* Error message */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-destructive/10 text-destructive px-6 py-3 rounded-lg border border-destructive/20 z-40">
          {error}
        </div>
      )}

      {display ? (
        <div className="flex flex-col items-center text-center">
          <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 text-primary">
            Welcome to Connect to Grow
          </div>
          <div className="text-muted-foreground max-w-md md:max-w-2xl text-base md:text-lg">
            Start connecting to your BE's
          </div>
          <div className="flex gap-3 m-2 md:m-4">
            <button
              onClick={() => setDisplay(false)}
              className="shadow-md bg-card py-0.5 px-1.5 md:py-2 md:px-4 border border-border rounded md:text-base
                hover:bg-card/80 hover:shadow-lg
                active:translate-y-0.5 active:shadow-sm
                transition-transform duration-150"
            >
              START
            </button>
            <button
              onClick={() => navigate("/matches")}
              className="shadow-md bg-primary text-white py-0.5 px-1.5 md:py-2 md:px-4 rounded md:text-base
                hover:opacity-90 hover:shadow-lg
                active:translate-y-0.5 active:shadow-sm
                transition-transform duration-150"
            >
              View Matches
            </button>
          </div>
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
                userType={authUser.profileType === "NWKR" ? "BE" : "NWKR"}
                onSkip={handleSkip}
                onConnect={handleConnect}
                loading={loading}
              />
            </motion.div>
          )}
          {visible && !currentProfile && !loading && (
            <div className="text-center text-muted-foreground">
              <div className="text-xl mb-4">No more profiles available</div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setFeedProfiles([])
                    setFeedIndex(0)
                    setDisplay(true)
                  }}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
                >
                  Start Over
                </button>
                <button
                  onClick={() => navigate("/matches")}
                  className="border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary/10 transition"
                >
                  View Matches
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

