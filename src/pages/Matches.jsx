import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { matchApi, nwkrApi, businessExpertApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Matches() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [error, setError] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  // Determine the type of matched profiles (opposite of logged-in user)
  const matchedProfileType = authUser?.profileType === "NWKR" ? "BE" : "NWKR";

  // Get the user's UUID based on their profile
  const getUserUuid = () => {
    if (!authUser) return null;
    const profileId = authUser.profileType === "NWKR" ? authUser.nwkrId : authUser.businessExpertId;
    const prefix = authUser.profileType === "NWKR" ? "NWKR-" : "BE-";
    return profileId ? `${prefix}${profileId}` : null;
  };

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
          navigate('/profile', {
            state: { message: 'Please create your profile to view matches' }
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
          navigate('/profile', {
            state: { message: 'Please complete your profile before viewing matches' }
          });
          return;
        }

        // Profile is complete, fetch matches
        setCheckingProfile(false);
        const userUuid = getUserUuid();
        if (userUuid) {
          fetchMatches(userUuid);
        }
      } catch (err) {
        console.error('Error checking profile:', err);
        setCheckingProfile(false);
      }
    };

    checkUserProfile();
  }, [authUser, navigate]);

  const fetchMatches = async (userUuid) => {
    if (!userUuid) {
      setError("No user logged in");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const matchData = await matchApi.getMatches(userUuid);
      setMatches(matchData);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError("Failed to load matches. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const openMatchDetails = (match) => {
    setSelectedMatch(match);
  };

  const closeMatchDetails = () => {
    setSelectedMatch(null);
  };

  if (checkingProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-muted-foreground">Checking your profile...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-muted-foreground">Loading matches...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary">Your Matches</h1>

      {error && (
        <div className="mb-4 p-3 bg-muted border border-border rounded-lg text-sm text-muted-foreground">
          {error}
        </div>
      )}

      {matches.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-xl text-muted-foreground mb-4">No matches yet</div>
          <div className="text-sm text-muted-foreground">Start swiping to find your matches!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {matches.map((match) => (
            <motion.div
              key={match.matchedUserUuid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => openMatchDetails(match)}
            >
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={match.pictureLink || "https://i.pravatar.cc/150"}
                  alt={match.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                />
                <div className="flex-1">
                  <div className="font-bold text-lg">{match.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {matchedProfileType === "BE"
                      ? (match.bereich || "N/A")
                      : (match.bildungsgang?.join(", ") || "N/A")}
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground line-clamp-2">
                {match.description || "No description"}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openMatchDetails(match);
                }}
                className="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 transition text-sm font-medium"
              >
                View Details
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Match Details Modal */}
      <AnimatePresence>
        {selectedMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeMatchDetails}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedMatch.name}</h2>
                <button
                  onClick={closeMatchDetails}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <img
                  src={selectedMatch.pictureLink || "https://i.pravatar.cc/150"}
                  alt={selectedMatch.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary mx-auto md:mx-0"
                />
                <div className="flex-1">
                  {selectedMatch.birthday && (
                    <div className="mb-3">
                      <div className="text-sm font-semibold text-muted-foreground mb-1">Geburtsjahr</div>
                      <div className="text-base">
                        {new Date(selectedMatch.birthday).getFullYear()}
                        {" "}({new Date().getFullYear() - new Date(selectedMatch.birthday).getFullYear()} Jahre)
                      </div>
                    </div>
                  )}
                  <div className="mb-3">
                    <div className="text-sm font-semibold text-muted-foreground mb-1">Email</div>
                    <div className="text-base break-all">{selectedMatch.email}</div>
                  </div>
                  {selectedMatch.officelokation && (
                    <div className="mb-3">
                      <div className="text-sm font-semibold text-muted-foreground mb-1">Standort</div>
                      <div className="text-base">{selectedMatch.officelokation.join(", ")}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* BE-specific fields */}
              {matchedProfileType === "BE" && (
                <>
                  {selectedMatch.bereich && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-muted-foreground mb-1">Bereich</div>
                      <div className="text-base">{selectedMatch.bereich}</div>
                    </div>
                  )}
                  {selectedMatch.bildungBetreuen && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-muted-foreground mb-1">Bildung Betreuen</div>
                      <div className="text-base">{selectedMatch.bildungBetreuen.join(", ")}</div>
                    </div>
                  )}
                  {selectedMatch.studied !== undefined && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-muted-foreground mb-1">Studiert</div>
                      <div className="text-base">{selectedMatch.studied ? "Ja" : "Nein"}</div>
                    </div>
                  )}
                  {selectedMatch.teamDescription && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-muted-foreground mb-1">Team</div>
                      <div className="text-base leading-relaxed">{selectedMatch.teamDescription}</div>
                    </div>
                  )}
                </>
              )}

              {/* NWKR-specific fields */}
              {matchedProfileType === "NWKR" && (
                <>
                  {selectedMatch.bildungsgang && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-muted-foreground mb-1">Bildungsgang</div>
                      <div className="text-base">{selectedMatch.bildungsgang.join(", ")}</div>
                    </div>
                  )}
                  {selectedMatch.codinglanguages && selectedMatch.codinglanguages.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-muted-foreground mb-1">Programmiersprachen</div>
                      <div className="text-base">{selectedMatch.codinglanguages.join(", ")}</div>
                    </div>
                  )}
                </>
              )}

              {selectedMatch.description && (
                <div className="mb-6">
                  <div className="text-sm font-semibold text-muted-foreground mb-2">Beschreibung</div>
                  <div className="text-base leading-relaxed">{selectedMatch.description}</div>
                </div>
              )}

              {selectedMatch.teamsLink && (
                <a
                  href={selectedMatch.teamsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-primary text-white text-center py-3 rounded-lg hover:opacity-90 transition font-medium"
                >
                  Teams Chat öffnen
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
