import { ArrowRight } from "lucide-react";
import { useState } from "react";

type Props = {
  onNext: () => void;  // onNext no longer takes any arguments
  setField: (field: string, value: any) => void;  // setField takes the two arguments
};

export default function NameForm({ onNext, setField }: Props) {
  const [name, setName] = useState("");

  return (
    <>
      <h1 className="title">Enter your name</h1>
      <h2 className="subtitle">Pleasseeee</h2>

      <input 
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        onClick={() => {
          if (name.length > 0) {
            setField("name", name);  // Passing the arguments to setField
            onNext();  // Call onNext without arguments
          } else {
            alert("Please enter a name");
          }
        }}
      >
        Continue
        <ArrowRight />
      </button>
    </>
  );
}
