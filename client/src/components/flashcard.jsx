import React, { useState, useEffect } from "react";
import "../styles/flashcard.css";

const Flashcard = ({ word, onGotIt, onStillLearning, current, total }) => {
  const [flipped, setFlipped] = useState(false);
  const [displayWord, setDisplayWord] = useState(word);

  useEffect(() => {
    if (flipped) {
      setFlipped(false);
      const timer = setTimeout(() => {
        setDisplayWord(word);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setDisplayWord(word);
    }
  }, [word]);

  return (
    <div className="flashcard-container">
      <p className="practice-progress">{current} / {total}</p>
      <div
        className={`flashcard ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flashcard-front">
          <p className="flashcard-word">{displayWord.word}</p>
          {displayWord.isVerb && displayWord.infinitive && (
            <p className="flashcard-infinitive">({displayWord.infinitive})</p>
          )}
          <p className="flashcard-hint">click to reveal</p>
        </div>
        <div className="flashcard-back">
          <p className="flashcard-definition">{displayWord.definition}</p>
          {displayWord.isVerb && displayWord.infinitive && (
            <p className="flashcard-infinitive">{displayWord.infinitive}</p>
          )}
        </div>
      </div>
      {flipped && (
        <div className="flashcard-buttons">
          <button className="fc-btn fc-still-learning" onClick={onStillLearning}>
            Still learning
          </button>
          <button className="fc-btn fc-got-it" onClick={onGotIt}>
            Got it
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcard;