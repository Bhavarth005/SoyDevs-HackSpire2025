import { ArrowRight } from "lucide-react";
import { useState } from "react";

type Props = {
  onNext: () => void; 
  setField: (field: string, value: any) => void;
};

export default function SuicidalThoughtsForm({ onNext, setField }: Props) {
  const [thoughts, setThoughts] = useState("");

  return (
    <>
      <h1 className="title">Have you been having any suicidal thoughts?</h1>
      <h2 className="subtitle">Provide, if any</h2>

      <input 
        type="text"
        placeholder="Therapy name"
        value={thoughts}
        onChange={(e) => setThoughts(e.target.value)}
      />

      <button
        onClick={
            () => {
                if(thoughts.length > 0) setField("past_therapys", thoughts);

                onNext();
            }
        }
      >
        Continue
        <ArrowRight />
      </button>
    </>
  );
}
