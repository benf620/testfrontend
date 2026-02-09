export default function ProfileCard() {
  return (
    <div className="max-w-md p-5 border border-border rounded-2xl shadow-lg bg-card scale-90 sm:scale-100 origin-top">
      {/* Header: Bild + Name */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
        <img
          src="https://i.pravatar.cc/150?img=12"
          alt="Profile"
          className="w-24 h-24 sm:w-20 sm:h-20 rounded-full object-cover border"
        />
        <div className="text-center sm:text-left">
          <div className="text-xl font-bold">Max Mustermann</div>
          <div className="text-xs text-muted-foreground mt-1 sm:mt-0">
            2006 (19 Jahre)
          </div>
          <div className="text-xs text-muted-foreground break-all">
            max.mustermann@telekom.de
          </div>
        </div>
      </div>

      {/* Grid für Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
        <div>
          <span className="font-semibold">Studiengang</span>
          <div>Informatik</div>
        </div>
        <div>
          <span className="font-semibold">Standort</span>
          <div>Winterfeldtstraße 21</div>
        </div>
        <div className="sm:col-span-2">
          <span className="font-semibold">Programmiersprachen</span>
          <div>React, Next, Tailwind</div>
        </div>
      </div>

      {/* Description */}
      <div className="text-sm mb-5">
        <span className="font-semibold">Description</span>
        <div className="mt-1">
          IT-Spezialist mit Fokus auf Softwareentwicklung, Systemadministration und Cloud-Lösungen. Leidenschaft für effiziente IT-Prozesse, Automatisierung und innovative Technologien. Erfahrung in Programmierung, Netzwerken und Support.
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex-1 bg-primary text-white py-2 rounded-lg hover:opacity-90 transition">
          Connect
        </button>
        <button className="flex-1 border border-border py-2 rounded-lg hover:bg-muted transition">
          Skip
        </button>
      </div>
    </div>
  );
}

