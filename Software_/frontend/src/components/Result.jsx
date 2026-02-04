import React, { useState, useEffect } from "react";
import "../index.css";
import SpeakerButton from "./SpeakerB";
export default function Result({ fingers }) {

    const [history, setHistory] = useState(["click to listen"]);
    useEffect(() => {
        if (fingers?.gesture) {
            setHistory(prev => {
                const updated = [...prev, fingers.gesture];
                return updated.slice(-250);   // keep last 250
            });
        }

    }, [fingers.gesture]);

    const labels = ["Thumb", "Index", "Middle", "Ring", "Little"];
    const keys = ["thumb", "index", "middle", "ring", "little"];

    return (
        <div className="container mt-4 text-center p-2">

            <h2 className="mb-4">Finger Readings</h2>

            {/* Finger boxes */}
            <div className="row justify-content-center">
                {keys.map((key, i) => (
                    <div key={key} className="col-6 col-md-2 m-2 p-2 box">
                        <h6>{labels[i]}</h6>
                        <p className="value">{fingers[key]}</p>
                    </div>
                ))}
            </div>

            {/* Final result */}
            <div className="final-result mt-4">
                <h4>Final Result</h4>
                <p className="result">
                    {fingers.gesture || "no connection !"}
                </p>
            </div>
            {/* for speaker purpose */}
            <SpeakerButton text={history}/>
            {/* History */}
            <div className="final-result mt-4 p-3">
                <p className="result" style={{ letterSpacing: "2px" }}>
                    {history.join("")}
                </p>

            </div>

        </div>
    );
}
