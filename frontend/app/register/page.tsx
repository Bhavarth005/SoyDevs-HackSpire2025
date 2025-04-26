"use client"

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import "@/app/styles/register.css"
import NameForm from "./forms/name";
import BasicDetailsForm from "./forms/basic_details";
import HealthConditions from "./forms/health_conditions";
import MedicationForm from "./forms/medications";
import TherapyForm from "./forms/past_therapy";
import SuicidalThoughtsForm from "./forms/suicidal_thoughts";
import ComfortLevelForm from "./forms/comfort";
import HumorLevelForm from "./forms/humor";

export default function Register() {
    const [currentStage, setCurrentStage] = useState(0);
    const [data, setData] = useState<{
        name: string;
        age: number;
        gender: string;
        mental_health_conditions?: string;
        ongoing_medication?: string;
        past_therapy?: string;
        suicidal_thoughts?: string;
        comfort_level: number;
        humor_level: number;
    }>({
        name: "",
        age: 0,
        gender: "",
        comfort_level: 5,
        humor_level: 5,
    });


    const setField = (field: string, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    }

    const handleNext = () => {
        const cleanedData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => value !== undefined)
        );

        if(currentStage == 7) {
            console.log(JSON.stringify(cleanedData));
            
            fetch('http://127.0.0.1:8000/register', {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(cleanedData)
              })
              .then(response => response.json())
              .then(data => {
                if("user_id" in data) {
                    localStorage.setItem("user_id", data.user_id);
                }
              })
              .catch(error => console.error('Error:', error));
        }
        setCurrentStage(prev => prev + 1);
    };

    return <>
        <div className="container">
            {currentStage == 0 && <NameForm setField={setField} onNext={handleNext} />}
            {currentStage == 1 && <BasicDetailsForm setField={setField} onNext={handleNext} />}
            {currentStage == 2 && <HealthConditions setField={setField} onNext={handleNext} />}
            {currentStage == 3 && <MedicationForm setField={setField} onNext={handleNext} />}
            {currentStage == 4 && <TherapyForm setField={setField} onNext={handleNext} />}
            {currentStage == 5 && <SuicidalThoughtsForm setField={setField} onNext={handleNext} />}
            {currentStage == 6 && <ComfortLevelForm setField={setField} onNext={handleNext} />}
            {currentStage == 7 && <HumorLevelForm setField={setField} onNext={handleNext} />}
        </div>
    </>
}