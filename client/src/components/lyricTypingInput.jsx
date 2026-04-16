import React, { useEffect, useRef } from "react";

export const LyricTypingInput = ({ lines, lyricRefs }) => {
  const textareaRefs = useRef([]);

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

  const autoResize = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  useEffect(() => {
    textareaRefs.current.forEach((el) => autoResize(el));
  }, [lines]);

  return (
    <div style={{ position: "relative" }}>
      {lines.map((line, lineIndex) => {
        const lyricEl = lyricRefs.current?.[lineIndex];
        const lyricTop = lyricEl ? lyricEl.offsetTop : null;

        return (
          <div
            key={lineIndex}
            style={{
              position: lyricTop !== null ? "absolute" : "relative",
              top: lyricTop !== null ? lyricTop : undefined,
              width: "100%",
            }}
          >
            <textarea
              ref={(el) => (textareaRefs.current[lineIndex] = el)}
              rows={1}
              className="userTranslationInput"
              onChange={(e) => autoResize(e.target)}
              style={{
                width: "100%",
                resize: "none",
                overflow: "hidden",
                border: "none",
                borderBottom: "2px solid #000",
                outline: "none",
                backgroundColor: "transparent",
                padding: "2px 0",
                fontSize: "22px",
                fontFamily: "inherit",
                lineHeight: "2.0",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};