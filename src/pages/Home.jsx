import { useState } from "react";
import ProfileCard from "../components/ProfileCard";

export default function Home() {
  const [display, setDisplay] = useState(true);

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
        <ProfileCard />
      )}
    </>
  );
}

