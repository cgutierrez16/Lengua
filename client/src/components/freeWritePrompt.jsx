import React, { useState } from "react";
import "../styles/freewrite.css";

const FreeWritePrompt = ({ prompt, onStart, onRandomize }) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  if (!prompt) return <p style={{ color: "#838383", textAlign: "center" }}>Loading prompt...</p>;

  return (
    <div className="fw-prompt-container">
      <h2 className="fw-section-label">Your prompt</h2>
      <div className="fw-prompt-card">
        <p className="fw-prompt-text">{prompt.prompt_es}</p>
        <div className="fw-prompt-actions">
          <button
            className="fw-reveal-btn"
            onClick={() => setShowTranslation(!showTranslation)}
          >
            {showTranslation ? "Hide translation" : "Reveal translation"}
          </button>
          <button
            className="fw-reveal-btn"
            onClick={() => {
              setShowTranslation(false);
              onRandomize();
            }}
          >
            Different prompt
          </button>
        </div>
        {showTranslation && (
          <p className="fw-prompt-translation">{prompt.prompt_en}</p>
        )}
      </div>

      <h2 className="fw-section-label">Choose your time</h2>
      <div className="fw-time-options">
        {[1, 3, 5].map((mins) => (
          <button
            key={mins}
            className={`fw-time-btn ${selectedTime === mins ? "fw-time-selected" : ""}`}
            onClick={() => setSelectedTime(mins)}
          >
            {mins} min
          </button>
        ))}
      </div>

      <button
        className="translation-submit"
        onClick={() => onStart(selectedTime)}
        disabled={!selectedTime}
      >
        Start writing
      </button>
    </div>
  );
};

export default FreeWritePrompt;