import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/freewrite.css";

const FreeWriteFeedback = ({
  prompt,
  userText,
  feedback,
  setFeedback,
  onTryAgain,
  onNewPrompt,
}) => {
  const [loading, setLoading] = useState(false);
  const [hoveredFlag, setHoveredFlag] = useState(null);

  useEffect(() => {
    if (!feedback) {
      fetchFeedback();
    }
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3001/api/freewrite-feedback",
        {
          prompt: prompt.prompt_en,
          userText,
        },
      );
      setFeedback(res.data);
    } catch (err) {
      console.error("Feedback error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderHighlightedText = () => {
    if (!feedback || !feedback.flags || feedback.flags.length === 0) {
      return <p className="fw-user-text">{userText}</p>;
    }

    let remaining = userText;
    const parts = [];
    let key = 0;

    // Sort flags by position in text
    const sortedFlags = [...feedback.flags].sort((a, b) => {
      return remaining.indexOf(a.original) - remaining.indexOf(b.original);
    });

    for (const flag of sortedFlags) {
      const idx = remaining.indexOf(flag.original);
      if (idx === -1) continue;

      if (idx > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
      }

      parts.push(
        <span
          key={key++}
          className="fw-flagged-word"
          onMouseEnter={() => setHoveredFlag(flag)}
          onMouseLeave={() => setHoveredFlag(null)}
        >
          {flag.original}
          {hoveredFlag === flag && (
            <div className="fw-flag-tooltip">
              <p className="fw-tooltip-suggestion">{flag.suggestion}</p>
              <p className="fw-tooltip-reason">{flag.reason}</p>
            </div>
          )}
        </span>,
      );

      remaining = remaining.slice(idx + flag.original.length);
    }

    if (remaining) {
      parts.push(<span key={key++}>{remaining}</span>);
    }

    return <p className="fw-user-text">{parts}</p>;
  };

  if (loading) {
    return (
      <div className="fw-feedback-container">
        <p className="fw-loading">Analyzing your writing...</p>
      </div>
    );
  }

  return (
    <div className="fw-feedback-container">
      <div className="fw-prompt-reminder-bar">
        <span className="fw-prompt-label">Prompt:</span> {prompt.prompt_es}
      </div>

      {feedback && (
        <>
          <div className="fw-scores">
            <div className="fw-score-card">
              <span className="fw-score-label">On topic</span>
              <span className="fw-score-number">{feedback.onTopicScore}%</span>
              <div className="fw-score-bar-bg">
                <div
                  className="fw-score-bar-fill"
                  style={{ width: `${feedback.onTopicScore}%` }}
                />
              </div>
              <p className="fw-score-feedback">{feedback.onTopicFeedback}</p>
            </div>
            <div className="fw-score-card">
              <span className="fw-score-label">Spanish quality</span>
              <span className="fw-score-number">{feedback.qualityScore}%</span>
              <div className="fw-score-bar-bg">
                <div
                  className="fw-score-bar-fill"
                  style={{ width: `${feedback.qualityScore}%` }}
                />
              </div>
              <p className="fw-score-feedback">{feedback.qualityFeedback}</p>
            </div>
            <div className="fw-score-card fw-word-count-card">
              <span className="fw-score-label">Words written</span>
              <span className="fw-score-number">{feedback.wordCount}</span>
            </div>
          </div>

          <div className="fw-text-review">
            <h3 className="fw-review-label">Your writing</h3>
            <p className="fw-review-hint">
              Hover over underlined text to see suggestions
            </p>
            <div className="fw-text-box">{renderHighlightedText()}</div>
          </div>

          <div className="fw-action-buttons">
            <button className="fw-action-btn" onClick={onTryAgain}>
              Try again
            </button>
            <button
              className="fw-action-btn fw-action-primary"
              onClick={onNewPrompt}
            >
              New prompt
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FreeWriteFeedback;
