import { ArrowRight } from "lucide-react";
import { useState } from "react";

type Props = {
  onNext: () => void;
  setField: (field: string, value: any) => void;
};

export default function HealthConditions({ onNext, setField }: Props) {
  const [conditions, setConditions] = useState<string[]>([]);
  const [otherCondition, setOtherCondition] = useState<string>("");

  const handleConditionChange = (e: any) => {
    const { value, checked } = e.target;
    if (checked) {
      setConditions([...conditions, value]);
    } else {
      setConditions(conditions.filter((condition) => condition !== value));
    }
  };

  const handleOtherConditionChange = (e: any) => {
    setOtherCondition(e.target.value);
  };

  const handleSubmit = () => {
    if (otherCondition.length > 0) 
      setConditions([...conditions, otherCondition]);
    
    if(conditions.length > 0)
      setField("mental_health_conditions", conditions.join(", "));
    onNext();
  };

  return (
    <>
      <h1 className="title">Tell us a little about yourself</h1>
      <h2 className="subtitle">Please enter the following details</h2>

      <div className="conditions">
            <label>
                <input
                type="checkbox"
                value="Depression"
                checked={conditions.includes("Depression")}
                onChange={handleConditionChange}
                />
                <span>Depression</span>
            </label>
            <label>
                <input
                type="checkbox"
                value="Bipolar"
                checked={conditions.includes("Bipolar")}
                onChange={handleConditionChange}
                />
                <span>Bipolar</span>
            </label>
            <label>
                <input
                type="checkbox"
                value="Panic"
                checked={conditions.includes("Panic")}
                onChange={handleConditionChange}
                />
                <span>Panic</span>
            </label>
            <label>
                <input
                type="checkbox"
                value="Social Anxiety"
                checked={conditions.includes("Social Anxiety")}
                onChange={handleConditionChange}
                />
                <span>Social Anxiety</span>
            </label>
            <label>
                <input
                type="checkbox"
                value="Obsessive-compulsive disorder (OCD)"
                checked={conditions.includes("Obsessive-compulsive disorder (OCD)")}
                onChange={handleConditionChange}
                />
                <span>Obsessive-compulsive disorder (OCD)</span>
            </label>
            <label>
                <input
                type="checkbox"
                value="ptsd"
                checked={conditions.includes("ptsd")}
                onChange={handleConditionChange}
                />
                <span>PTSD</span>
            </label>
            <label>
                <input
                type="checkbox"
                value="ADHD"
                checked={conditions.includes("ADHD")}
                onChange={handleConditionChange}
                />
                <span>ADHD</span>
            </label>
      </div>

      <div className="mb-1 pt-4">
        <label htmlFor="other" className="block text-gray-700 text-sm font-bold mb-2 mt-7">
          Other:
        </label>
        <input
          type="text"
          id="other"
          placeholder="Specify other condition"
          value={otherCondition}
          style={{ marginTop: "0px" }}
          onChange={handleOtherConditionChange}
        />
      </div>

      <button
        onClick={handleSubmit}
      >
        Continue
        <ArrowRight className="inline-block ml-2" />
      </button>
    </>
  );
}