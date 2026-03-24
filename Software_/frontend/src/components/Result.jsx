import React, { useState, useEffect } from "react";
import "../index.css";
import SpeakerButton from "./SpeakerB";

import { useContext } from "react";
import { LanguageContext } from "../Context/LanguageContext";
import languages from "../language";


export default function Result({ fingers }) {
    const [history, setHistory] = useState(["I NEADD TWATEER TO CLLAAN"]);
    const [corrected, setCorrected] = useState("");

    const { lang } = useContext(LanguageContext);
    const t = languages[lang];
    // Store incoming gestures
    useEffect(() => {
        if (fingers?.gesture && fingers.gesture !== "neutral") {
            setHistory(prev => {
                const updated = [...prev, fingers.gesture];
                return updated.slice(-250);
            });
        }
    }, [fingers?.gesture]);

    // Trigger AI when history hits button
    const handleUpload = () => {
        if (history.length === 0) return;

        const word = history.join("");
        sendToBackend(word);
    };

    const sendToBackend = async (word) => {
        try {
            const res = await fetch("http://10.130.188.92:5000/correct", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ word })
            });

            const data = await res.json();
            setCorrected(data.corrected);

        } catch (err) {
            console.error("AI call failed:", err);
        }
    };

    const labels = ["Thumb", "Index", "Middle", "Ring", "Little"];
    const keys = ["thumb", "index", "middle", "ring", "little"];

    return (
        <div className="container mt-4 text-center p-2">

            <h2 className="mb-4">{t.fingerReadings}</h2>

            <div className="row justify-content-center">
                {keys.map((key, i) => (
                    <div key={key} className="col-6 col-md-2 m-2 p-2 box">
                        <h6>{labels[i]}</h6>
                        <p className="value">{fingers?.[key] ?? 0}</p>
                    </div>
                ))}
            </div>

            <div className=" h-16  md:h-20 m-1 p-1 bg-gray-100 rounded-md shadow-sm justify-center items-centermt-4">
                <h5>{t.liveGesture}</h5>
                <p className="result">
                    {fingers?.gesture || "no connection!"}
                </p>
            </div>

            <div className="final-result mt-4">
                <h4>{t.rawOutput}</h4>
                <p className="result">
                    {history}
                </p>
            </div>
            <button
                className="btn btn-primary m-1"
                onClick={handleUpload}
                disabled={history.length === 0}
            >
               {t.sendToAI}
            </button>
            <div className="final-result mt-4">
                <h4>{t.correctedOutput}</h4>
                <p className="result">
                    {corrected}
                </p>
            </div>

            <SpeakerButton text={corrected} />
            <div className="mt-3">

            </div>
        </div>
    );
}