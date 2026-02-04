import React from "react";

function SpeakerButton({ text }) {

  const speak = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech not supported in this browser");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;    
    utterance.pitch = 2;  
    utterance.volume = 1;  

    window.speechSynthesis.cancel(); // stop previous speech
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button onClick={speak} style={{ fontSize: "20px", cursor: "pointer" }}>
      🔊 Speak
    </button>
  );
}

export default SpeakerButton;
