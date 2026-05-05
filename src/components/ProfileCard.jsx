import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

// Helper to format profile data for display
const formatProfile = (data, userType) => {
  const birthYear = data.birthday ? new Date(data.birthday).getFullYear() : null;
  const age = birthYear ? new Date().getFullYear() - birthYear : null;

  if (userType === "BE") {
    return {
      uuid: data.uuid,
      name: data.name,
      birthYear,
      age,
      email: data.email,
      avatar: data.pictureLink || "https://i.pravatar.cc/150?img=12",
      study: data.bildungBetreuen?.join(", ") || "N/A",
      location: data.officelocation?.join(", ") || "N/A",
      skills: [],
      bereich: data.bereich || "N/A",
      teamDescription: data.teamDescription || "",
      description: data.description || "No description available",
      studied: data.studied,
      teamsLink: data.teamsLink || "",
    };
  }

  // NWKR
  return {
    uuid: data.uuid,
    name: data.name,
    birthYear,
    age,
    email: data.email,
    avatar: data.pictureLink || "https://i.pravatar.cc/150?img=12",
    study: data.bildungsgang?.join(", ") || "N/A",
    location: data.officelocation?.join(", ") || "N/A",
    skills: data.codinglanguages || [],
    description: data.description || "No description available",
    teamsLink: data.teamsLink || "",
  };
};

export default function ProfileCard({ profile: rawProfile, userType, onSkip, onConnect, loading }) {
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);

  if (loading) {
    return (
      <div className="max-w-md md:max-w-3xl p-5 md:p-10 border border-border rounded-2xl shadow-lg bg-card flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!rawProfile) return null;

  const profile = formatProfile(rawProfile, userType);

  return (
    <div className="max-w-md md:max-w-3xl md:min-h-[600px] lg:min-h-[700px] p-5 md:p-10 lg:p-12 border border-border rounded-2xl shadow-lg bg-card scale-90 sm:scale-100 origin-top w-full flex flex-col">
      {/* Header: Bild + Name */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-8 mb-4 md:mb-10">
        <img
          src={profile.avatar}
          alt="Profile"
          className="w-24 h-24 sm:w-20 sm:h-20 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full object-cover border"
        />
        <div className="text-center sm:text-left">
          <div className="text-xl md:text-2xl font-bold md:mb-2">{profile.name}</div>
          <div className="text-xs md:text-sm text-muted-foreground mt-1 sm:mt-0 md:mt-2 md:mb-1">
            {profile.birthYear} ({profile.age} years old)
          </div>
          <div className="text-xs md:text-sm text-muted-foreground break-all">
            {profile.email}
          </div>
        </div>
      </div>

      {/* Grid für Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 lg:gap-8 text-sm mb-4 md:mb-10">
        <div className="md:space-y-1">
          <span className="font-semibold">{userType === "BE" ? "Searching for educational course:" : "Educational Course"}</span>
          <div>{profile.study}</div>
        </div>
        <div className="md:space-y-1">
          <span className="font-semibold">Location</span>
          <div>{profile.location}</div>
        </div>
      </div>

      {/* Description with popup button */}
      <div className="text-sm mb-5 md:mb-10 min-w-[280px] sm:min-w-[320px] md:min-w-[400px] lg:min-w-[500px]">
        <span className="font-semibold">Description</span>
        <div className="mt-1 md:mt-2 text-muted-foreground line-clamp-2">
          {profile.description}
        </div>
        <button
          onClick={() => setShowDescriptionPopup(true)}
          className="mt-2 text-primary font-medium text-sm md:text-base"
        >
          Read more
        </button>
      </div>

      {/* Description Popup - rendered via portal to escape Framer Motion transform context */}
      {createPortal(
        <AnimatePresence>
          {showDescriptionPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowDescriptionPopup(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">{profile.name}</h3>
                  <button
                    onClick={() => setShowDescriptionPopup(false)}
                    className="text-muted-foreground hover:text-foreground text-xl font-bold"
                  >
                    &times;
                  </button>
                </div>
                <div className="space-y-4 text-sm leading-relaxed">
                  <div>
                    <span className="font-semibold">Description</span>
                    <p className="mt-1 text-muted-foreground">{profile.description}</p>
                  </div>
                  {userType === "BE" && profile.teamDescription && (
                    <div>
                      <span className="font-semibold">Team</span>
                      <p className="mt-1 text-muted-foreground">{profile.teamDescription}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}



      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-6 mt-auto">
        <button
          onClick={onConnect}
          className="flex-1 bg-primary text-white py-2 md:py-2.5 rounded-lg hover:opacity-90 transition text-sm font-medium">
          Connect
        </button>
        <button
          onClick={onSkip}
          className="flex-1 border border-border py-2 md:py-2.5 rounded-lg hover:bg-muted transition text-sm font-medium">
          Skip
        </button>
      </div>
    </div>
  );
}

