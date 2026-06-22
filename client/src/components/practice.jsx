import React, { useState, useEffect } from "react";
import Flashcard from "./flashcard";
import Quiz from "./quiz";
import "../styles/practice.css";

const Practice = ({ wordAnalysis }) => {
  const [phase, setPhase] = useState("flashcards");
  const [cardIndex, setCardIndex] = useState(0);
  const [stillLearning, setStillLearning] = useState(null);
  const [deck, setDeck] = useState([]);

  const allMissedWords = Object.values(wordAnalysis)
    .flat()
    .reduce((acc, word) => {
      if (!acc.find((w) => w.word.toLowerCase() === word.word.toLowerCase())) {
        acc.push(word);
      }
      return acc;
    }, []);

  useEffect(() => {
    setDeck(allMissedWords);
    setStillLearning(allMissedWords);
  }, []);

  if (!allMissedWords.length) {
    return (
      <div className="practice-empty">
        <p>No missed words to practice — great job!</p>
      </div>
    );
  }

  if (phase === "flashcards") {
    if (deck.length === 0) {
      return (
        <div className="flashcard-container">
          <p className="practice-progress">Flashcards complete!</p>
          <p style={{ color: "#838383", marginBottom: "1.5rem" }}>
            You've reviewed all {allMissedWords.length} words. Time to test yourself.
          </p>
          <button
            className="translation-submit"
            onClick={() => setPhase("quiz")}
          >
            Start quiz
          </button>
        </div>
      );
    }

    const currentWord = deck[0];

    return (
      <Flashcard
        word={currentWord}
        current={allMissedWords.length - deck.length + 1}
        total={allMissedWords.length}
        onGotIt={() => {
          // Remove from deck entirely
          setStillLearning((prev) =>
            prev.filter((w) => w.word.toLowerCase() !== currentWord.word.toLowerCase())
          );
          setDeck((prev) => prev.slice(1));
        }}
        onStillLearning={() => {
          // Move current word to the end of the deck
          setDeck((prev) => [...prev.slice(1), prev[0]]);
        }}
      />
    );
  }

  return (
    <Quiz
      words={stillLearning && stillLearning.length > 0 ? stillLearning : allMissedWords}
      allMissedWords={allMissedWords}
    />
  );
};

export default Practice;