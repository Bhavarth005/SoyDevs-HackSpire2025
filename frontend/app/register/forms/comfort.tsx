import { ArrowRight } from "lucide-react";
import { useState } from "react";

type Props = {
  onNext: () => void; 
  setField: (field: string, value: any) => void;
};

export default function ComfortLevelForm({ onNext, setField }: Props) {
  const [comfortLevel, setComfortLevel] = useState(5); // Initial value set to 5

  return (
    <>
      <h1 className="title">How comfortable are you with talking to us?</h1>
      <h2 className="subtitle">Provide your comfort level (1-10)</h2>

      <label htmlFor="comfortLevel">Comfort Level: {comfortLevel}</label>
      <input 
        id="comfortLevel"
        type="range"
        min="1"
        max="10"
        value={comfortLevel}
        onChange={(e) => setComfortLevel(Number(e.target.value))}
      />

      <button
        onClick={() => {
          setField("comfort_level", comfortLevel); // Save comfort level value
          onNext(); // Continue to the next step
        }}
      >
        Continue
        <ArrowRight />
      </button>
    </>
  );
}
