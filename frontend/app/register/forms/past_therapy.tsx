import { ArrowRight } from "lucide-react";
import { useState } from "react";

type Props = {
  onNext: () => void; 
  setField: (field: string, value: any) => void;
};

export default function TherapyForm({ onNext, setField }: Props) {
  const [therapy, setTherapy] = useState("");

  return (
    <>
      <h1 className="title">Have you taken any therapy?</h1>
      <h2 className="subtitle">Provide names, if any</h2>

      <input 
        type="text"
        placeholder="Therapy details"
        value={therapy}
        onChange={(e) => setTherapy(e.target.value)}
      />

      <button
        onClick={
            () => {
                if(therapy.length > 0) setField("suicidal_thoughts", therapy);

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
