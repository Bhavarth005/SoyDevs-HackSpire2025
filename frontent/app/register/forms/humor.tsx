import { ArrowRight } from "lucide-react";
import { useState } from "react";

type Props = {
  onNext: () => void; 
  setField: (field: string, value: any) => void;
};

export default function HumorLevelForm({ onNext, setField }: Props) {
  const [humorLevel, setHumorLevel] = useState(5); // Initial value set to 5

  return (
    <>
      <h1 className="title">What is your preferred humor level?</h1>
      <h2 className="subtitle">Provide your humor level (1-10)</h2>

      <label htmlFor="comfortLevel">Humot Level: {humorLevel}</label>
      <input 
        id="comfortLevel"
        type="range"
        min="1"
        max="10"
        value={humorLevel}
        onChange={(e) => setHumorLevel(Number(e.target.value))}
      />

      <button
        onClick={() => {
          setField("humor_level", humorLevel); // Save comfort level value
          onNext(); // Continue to the next step
        }}
      >
        Continue
        <ArrowRight />
      </button>
    </>
  );
}
