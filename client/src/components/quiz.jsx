import React, { useState, useEffect } from "react";
import "../styles/quiz.css";

const Quiz = ({ words, allMissedWords }) => {
  const [queue, setQueue] = useState([...words]);
  const [current, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [choices, setChoices] = useState([]);
  const [done, setDone] = useState(false);

  const normalize = (str) =>
    str.toLowerCase().trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const generateChoices = (correctWord, pool) => {
    const wrong = pool
      .filter((w) => normalize(w.word) !== normalize(correctWord.word))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.word);
    return [...wrong, correctWord.word].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (queue.length > 0) {
      setChoices(generateChoices(queue[current % queue.length], allMissedWords));
    }
  }, [current, queue]);

  const handleSubmit = () => {
    const word = queue[current % queue.length];
    const correct = normalize(userAnswer) === normalize(word.word);
    setFeedback(correct ? "correct" : "incorrect");
    setTotalAttempted((t) => t + 1);
    if (correct) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    const word = queue[current % queue.length];
    const correct = normalize(userAnswer) === normalize(word.word);

    if (correct) {
      const newQueue = queue.filter((_, i) => i !== current % queue.length);
      if (newQueue.length === 0) {
        setDone(true);
        return;
      }
      setQueue(newQueue);
      setCurrent((c) => c % newQueue.length);
    } else {
      setCurrent((c) => (c + 1) % queue.length);
    }
    setUserAnswer("");
    setFeedback(null);
  };

  const handleChoiceSelect = (choice) => {
    setUserAnswer(choice);
  };

  if (done) {
    return (
      <div className="quiz-done">
        <h2>Practice complete!</h2>
        <p className="quiz-score-text">
          You answered {correctCount} out of {totalAttempted} correctly.
        </p>
        <p className="quiz-score-text" style={{ color: "#838383", fontSize: "15px" }}>
          Keep listening to the song — it'll all stick soon!
        </p>
      </div>
    );
  }

  const word = queue[current % queue.length];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <p className="practice-progress">
          {queue.length} word{queue.length !== 1 ? "s" : ""} remaining
        </p>
        <button
          className="mc-toggle"
          onClick={() => {
            setIsMultipleChoice(!isMultipleChoice);
            setUserAnswer("");
            setFeedback(null);
          }}
        >
          {isMultipleChoice ? "Switch to fill in blank" : "Switch to multiple choice"}
        </button>
      </div>

      <div className="quiz-card">
        <p className="quiz-definition">{word.definition}</p>
        {word.isVerb && (
          <p className="quiz-hint">Enter the conjugated Spanish form</p>
        )}

        {isMultipleChoice ? (
          <div className="mc-choices">
            {choices.map((choice, i) => (
              <button
                key={i}
                className={`mc-choice ${userAnswer === choice ? "selected" : ""} ${
                  feedback && choice === word.word ? "correct-choice" : ""
                } ${
                  feedback === "incorrect" && userAnswer === choice ? "incorrect-choice" : ""
                }`}
                onClick={() => !feedback && handleChoiceSelect(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        ) : (
          <input
            type="text"
            className="quiz-input"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !feedback && userAnswer.trim() && handleSubmit()}
            placeholder="Type the Spanish word..."
            disabled={!!feedback}
            autoFocus
          />
        )}

        {feedback && (
          <div className={`quiz-feedback ${feedback}`}>
            {feedback === "correct"
              ? "Correct!"
              : `Not quite — the answer is "${word.word}"`}
          </div>
        )}

        <div className="quiz-btn-row">
          {!feedback ? (
            <button
              className="translation-submit"
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
            >
              Check
            </button>
          ) : (
            <button className="translation-submit" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;