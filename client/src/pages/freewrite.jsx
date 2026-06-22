import React, { useState, useEffect } from "react";
import axios from "axios";
import FreeWritePrompt from "../components/freeWritePrompt";
import FreeWriteEditor from "../components/freeWriteEditor";
import FreeWriteFeedback from "../components/freeWriteFeedback";
import "../styles/freewrite.css";

export const Freewrite = () => {
  const [prompt, setPrompt] = useState(null);
  const [phase, setPhase] = useState("prompt");
  const [selectedTime, setSelectedTime] = useState(null);
  const [userText, setUserText] = useState("");
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchPrompt();
  }, []);

  const fetchPrompt = async (excludeId = null) => {
    try {
      const res = await axios.get("http://localhost:3001/api/prompts/random", {
        params: excludeId ? { excludeId } : {},
      });
      setPrompt(res.data);
    } catch (err) {
      console.error("Failed to fetch prompt:", err);
    }
  };

  const handleStart = (minutes) => {
    setSelectedTime(minutes);
    setPhase("writing");
  };

  const handleTimeUp = (text) => {
    setUserText(text);
    setPhase("feedback");
  };

  const handleTryAgain = () => {
    setUserText("");
    setFeedback(null);
    setPhase("writing");
  };

  const handleNewPrompt = () => {
    fetchPrompt(prompt?.id);
    setUserText("");
    setFeedback(null);
    setSelectedTime(null);
    setPhase("prompt");
  };

  if (!prompt)
    return (
      <div className="freewrite-page">
        <p style={{ color: "#838383" }}>Loading...</p>
      </div>
    );

  return (
    <div className="freewrite-page">
      {phase === "prompt" && (
        <FreeWritePrompt
          prompt={prompt}
          onStart={handleStart}
          onRandomize={() => fetchPrompt(prompt?.id)}
        />
      )}
      {phase === "writing" && (
        <FreeWriteEditor
          prompt={prompt}
          minutes={selectedTime}
          onTimeUp={handleTimeUp}
        />
      )}
      {phase === "feedback" && (
        <FreeWriteFeedback
          prompt={prompt}
          userText={userText}
          feedback={feedback}
          setFeedback={setFeedback}
          onTryAgain={handleTryAgain}
          onNewPrompt={handleNewPrompt}
        />
      )}
    </div>
  );
};
