import { useState } from "react";
import ProfileCard from "../components/ProfileCard";

export default function Home() {
  const [display, setDisplay] = useState(true);

  return (
    <>
      {display ? (
        <div className="flex flex-col items-center text-center">
          <div className="text-xl font-bold mb-2 text-primary">
            Welcome to Connect to Grow
          </div>
          <div className="text-muted-foreground max-w-md">
            Start connecting to your BE's
          </div>
          <button
            onClick={() => setDisplay(false)}
            className="shadow-md m-2 bg-card py-0.5 px-1.5 border border-border rounded
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

