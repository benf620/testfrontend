export default function ProfileCard() {
  


  return (
    <div className="max-w-md md:max-w-3xl md:min-h-[600px] lg:min-h-[700px] p-5 md:p-10 lg:p-12 border border-border rounded-2xl shadow-lg bg-card scale-90 sm:scale-100 origin-top w-full flex flex-col">
      {/* Header: Bild + Name */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-8 mb-4 md:mb-10">
        <img
          src="https://i.pravatar.cc/150?img=12"
          alt="Profile"
          className="w-24 h-24 sm:w-20 sm:h-20 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full object-cover border"
        />
        <div className="text-center sm:text-left">
          <div className="text-xl md:text-2xl font-bold md:mb-2">Max Mustermann</div>
          <div className="text-xs md:text-sm text-muted-foreground mt-1 sm:mt-0 md:mt-2 md:mb-1">
            2006 (19 Jahre)
          </div>
          <div className="text-xs md:text-sm text-muted-foreground break-all">
            max.mustermann@telekom.de
          </div>
        </div>
      </div>

      {/* Grid für Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 lg:gap-8 text-sm mb-4 md:mb-10">
        <div className="md:space-y-1">
          <span className="font-semibold">Studiengang</span>
          <div>Informatik</div>
        </div>
        <div className="md:space-y-1">
          <span className="font-semibold">Standort</span>
          <div>Winterfeldtstraße 21</div>
        </div>
        <div className="sm:col-span-2 md:col-span-1 md:space-y-1">
          <span className="font-semibold">Programmiersprachen</span>
          <div>React, Next, Tailwind</div>
        </div>
      </div>

      {/* Description */}
      <div className="text-sm mb-5 md:mb-10 flex-1 md:space-y-2">
        <span className="font-semibold">Description</span>
        <div className="mt-1 md:mt-3 md:leading-relaxed">
          IT-Spezialist mit Fokus auf Softwareentwicklung, Systemadministration und Cloud-Lösungen. Leidenschaft für effiziente IT-Prozesse, Automatisierung und innovative Technologien. Erfahrung in Programmierung, Netzwerken und Support.
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-6 mt-auto">
        <button className="flex-1 bg-primary text-white py-2 md:py-2.5 rounded-lg hover:opacity-90 transition text-sm font-medium">
          Connect
        </button>
        <button className="flex-1 border border-border py-2 md:py-2.5 rounded-lg hover:bg-muted transition text-sm font-medium">
          Skip
        </button>
      </div>
    </div>
  );
}

