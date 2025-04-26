import { ArrowRight } from "lucide-react";
import { useState } from "react";

type Props = {
  onNext: () => void;  // onNext no longer takes any arguments
  setField: (field: string, value: any) => void;  // setField takes the two arguments
};

export default function BasicDetailsForm({ onNext, setField }: Props) {
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState('');

  const handleChange = (e: any) => {
    setGender(e.target.value);
  };

  return (
    <>
      <h1 className="title">Tell us a little about yourself</h1>
      <h2 className="subtitle">Please enter the following details</h2>

      <input 
        type="number"
        placeholder="Enter your age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <select id="gender" value={gender} onChange={handleChange}>
        <option value="">Select</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <button
        onClick={
            () => {
              if(age.length > 0) setField("age", age);
              else return alert("Please enter an age");

              if(gender.length > 0) setField("gender", gender);
              else return alert("Please select gender");

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
