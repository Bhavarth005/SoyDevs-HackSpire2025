import { ArrowRight } from "lucide-react";
import { useState } from "react";

type Props = {
  onNext: () => void; 
  setField: (field: string, value: any) => void;
};

export default function MedicationForm({ onNext, setField }: Props) {
  const [medication, setMedication] = useState("");

  return (
    <>
      <h1 className="title">Are you taking any medications right now?</h1>
      <h2 className="subtitle">Provide names, if any</h2>

      <input 
        type="text"
        placeholder="Medication name"
        value={medication}
        onChange={(e) => setMedication(e.target.value)}
      />

      <button
        onClick={
            () => {
                if(medication.length > 0) setField("ongoing_medication", medication);

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
