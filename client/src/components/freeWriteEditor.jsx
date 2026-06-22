import React, { useState, useEffect, useRef } from "react";
import "../styles/freewrite.css";

const FreeWriteEditor = ({ prompt, minutes, onTimeUp }) => {
  const [text, setText] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const intervalRef = useRef(null);

  // Need text in the interval callback — use a ref to keep it current
  const textRef = useRef(text);
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          onTimeUp(textRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isLowTime = secondsLeft <= 30;

  return (
    <div className="fw-editor-container">
      <div className="fw-editor-header">
        <p className="fw-prompt-reminder">{prompt.prompt_es}</p>
        <span className={`fw-timer ${isLowTime ? "fw-timer-low" : ""}`}>
          {formatTime(secondsLeft)}
        </span>
      </div>
      <textarea
        className="fw-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Empieza a escribir en español..."
        autoFocus
      />
      <p className="fw-word-count">
        {text.trim() === "" ? 0 : text.trim().split(/\s+/).length} words
      </p>
    </div>
  );
};

export default FreeWriteEditor;
