import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileCard({ onSkip, onConnect }) {
  const [isOpen, setIsOpen] = useState(false)

  const profile = {
    name: "Max Mustermann",
    birthYear: 2006,
    age: 19,
    email: "max.mustermann@telekom.de",
    avatar: "https://i.pravatar.cc/150?img=12",
    study: "Informatik",
    location: "Winterfeldtstraße 21",
    skills: ["React", "Next", "Tailwind"],
    description:
      "IT-Spezialist mit Fokus auf Softwareentwicklung, Systemadministration und Cloud-Lösungen. Leidenschaft für effiziente IT-Prozesse, Automatisierung und innovative Technologien. Erfahrung in Programmierung, Netzwerken und Support.",
  };

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
            {profile.birthYear} ({profile.age} Jahre)
          </div>
          <div className="text-xs md:text-sm text-muted-foreground break-all">
            {profile.email}
          </div>
        </div>
      </div>

      {/* Grid für Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 lg:gap-8 text-sm mb-4 md:mb-10">
        <div className="md:space-y-1">
          <span className="font-semibold">Studiengang</span>
          <div>{profile.study}</div>
        </div>
        <div className="md:space-y-1">
          <span className="font-semibold">Standort</span>
          <div>{profile.location}</div>
        </div>
        <div className="sm:col-span-2 md:col-span-1 md:space-y-1">
          <span className="font-semibold">Programmiersprachen</span>
          <div>{profile.skills.join(", ")}</div>
        </div>
      </div>

      {/* Description */}
      <div className="text-sm mb-5 md:mb-10 md:space-y-2 min-w-[280px] sm:min-w-[320px] md:min-w-[400px] lg:min-w-[500px]">
        <span className="font-semibold">Description</span>

        {/* Invisible text to maintain width */}
        <div className="invisible h-0 overflow-hidden mt-1 md:mt-3 md:leading-relaxed" aria-hidden="true">
          {profile.description}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-1 md:mt-3 md:leading-relaxed"
            >
              {profile.description}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mt-1 text-primary font-medium text-sm md:text-base"
        >
          {isOpen ? "Show less" : "Read more"}
        </button>
      </div>



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

