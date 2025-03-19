import React, { useState, useEffect, useRef } from "react";

export const LyricTypingInput = ({ lines, lyricRefs }) => {
  const [lineHeights, setLineHeights] = useState([]);
  const inputRefs = useRef([]);

  const tempArray = [
    "You have no idea",
    "How I've been spending my time",
    "How difficult it is to speak without convincing",
    "How much can you love a woman",
    "You have no idea",
    "How are my early mornings",
  ];

  if (!lines || !lines.length) {
    lines = tempArray;
  }

  // Initialize state to store user inputs
  const [inputs, setInputs] = useState(
    lines.map((line) => line.split(" ").map(() => ""))
  );


  const handleChange = (e, lineIndex, wordIndex) => {
    const { value } = e.target;
    const newInputs = inputs.map((line, li) =>
      line.map((word, wi) => {
        if (li === lineIndex && wi === wordIndex) {
          return value;
        }
        return word;
      })
    );
    setInputs(newInputs);

    // Move to next input if current input is full
    if (value.length >= e.target.maxLength) {
      const nextInput = inputRefs.current[lineIndex]?.[wordIndex + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  
  // Initialize inputRefs.current as a 2D array
  useEffect(() => {
    inputRefs.current = lines.map(() => []);
  }, [lines]);

  useEffect(() => {
    if (lyricRefs.current) {
      const heights = lyricRefs.current.map((ref) => ref?.offsetHeight || 0);
      setLineHeights(heights);
    }
  }, [lyricRefs]);

  return (
    <div>
      {lines.map((line, lineIndex) => {
        const wordCount = lines[lineIndex]?.split(" ").length || 3; // Fallback to 3 words
        const inputWidth = `${wordCount * 4.25}rem`; // Adjust multiplier as needed

        return (
          <div
            key={lineIndex}
            className="input-lyrics-align test"
            style={{
              marginTop: `${Math.max(0, lineHeights[lineIndex] - 48) + (lineHeights[lineIndex] > 48 ? 10 : 0)}px`,
              marginBottom: "10px",            
            }}
          >
            <input
              type="text"
              key={lineIndex}
              style={{
                width: inputWidth,
                margin: "0 5px",
                textAlign: "left",
                border: "none",
                borderBottom: "2px solid #000",
                outline: "none",
                backgroundColor: "transparent",
                padding: "2px 0",
                paddingRight: "5px",
              }}
              maxLength={wordCount * 6} // Roughly 6 characters per word
            />
          </div>
        );
      })}
    </div>
  );
};
