import React from "react";

export default function About() {

    // ========= DATA =========
    const topic = {
        title: "SignSpeak",

        definition:
            "Smart Sign Language Recognition Glove using ESP32 with Wi-Fi and Bluetooth Connectivity",

        problem:
            "Communication between speech/hearing-impaired individuals and normal speakers is often difficult in daily life. Sign language is effective among trained users, but most people do not understand it, which creates a communication gap. Existing solutions such as interpreters or camera-based recognition systems are either costly, non-portable, or dependent on external infrastructure. Therefore, there is a need for a low-cost, portable, real-time, and user-friendly system that can translate hand gestures into readable text or speech without requiring special equipment or human assistance.This project addresses this need by developing a wearable smart glove that automatically converts sign language gestures into digital output using embedded sensors and wireless communication",

        working: [
            "The system consists of flex sensors mounted on each finger of a glove. These sensors behave as variable resistors and change their resistance based on the bending of the fingers. When the user performs a gesture: Flex sensors detect finger bending.Analog signals are generated corresponding to each finger’s position.The ESP32 microcontroller reads these signals using its ADC pins.The sensor data is processed and compared with predefined gesture patterns.The identified gesture is converted into text or speech output.The result is transmitted wirelessly:Via Bluetooth to nearby mobile devices Via Wi- Fi to a web-based dashboardThe web application displays live data, recognized gestures, and allows monitoring and control of the system."
        ],

        features: [
            "1. Real-time gesture recognition",
            "2. Flex sensor-based finger movement detection",
            "3. ESP32 microcontroller processing",
            "4. Built -in Bluetooth communication",
            "5. Wi - Fi enabled web dashboard",
            "6. Live sensor value monitoring",
            "7. Text output of detected gestures",
            "8. Expandable for speech output",
            "9. Portable and wearable design",
            "10.Low- cost hardware implementation",

        ],

        advantages: [
            "1. Portable and lightweight wearable system",
            "2. Low power consumption",
            "3. No camera or external infrastructure required",
            "4. Real-time response",
            "5. Wireless communication (Bluetooth + Wi-Fi)",
            "6. Easy integration with mobile phones and websites",
            "7. Cost-effective compared to vision-based systems",
            "8. Suitable for IoT and smart healthcare applications",
            "9. User-friendly interface through web dashboard",
        ],

        limitations: [
            "Limited native access",
            "iOS support issues"
        ],

        conclusion:
            "still building"
    };


    // ========= UI =========
    return (
        <div className="container my-5">
            <div className="card p-4 shadow">

                <h2 className="text-primary mb-4">{topic.title}</h2>
                <a href="TODO" className="p-4 flex flex-wrap items-center justify-center"
                    download>TODO</a>

                <Section title="Definition" content={topic.definition} />
                <Section title="Problem / Need" content={topic.problem} />
                <Section title="How it Works" list={topic.working} />
                <Section title="Features" list={topic.features} />
                <Section title="Advantages" list={topic.advantages} />
                <Section title="Limitations" list={topic.limitations} />
                <Section title="Conclusion" content={topic.conclusion} />

            </div>
        </div>
    );
}



function Section({ title, content, list }) {
    return (
        <div className="mb-3">

            <h5 className="fw-bold">{title}</h5>

            {content && <p>{content}</p>}

            {list && (
                <ul>
                    {list.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            )}

        </div>
    );
}

