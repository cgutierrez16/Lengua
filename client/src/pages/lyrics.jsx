import React, { useState } from "react";
import axios from "axios";
import "../styles/lyrics.css";

export const Lyrics = () => {
  const [lyrics, setLyrics] = useState([]);
  const [translation, setTranslation] = useState([]);
  const [title, setTitle] = useState();
  const [artist, setArtist] = useState([]);
  const [albumTitle, setAlbumTitle] = useState();
  const [albumCoverLink, setAlbumCoverLink] = useState();
  const [userInput, setUserInput] = useState("");
  const [userTranslation, setUserTranslation] = useState([]);
  const [scores, setScores] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loadingScores, setLoadingScores] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSearching(true);
    setSearchMessage("Searching...");

    await axios
      .get("http://localhost:3001/api/lyrics", { params: { userInput } })
      .then((res) => {
        if (!res.data.rows || res.data.rows.length === 0) {
          setSearchMessage("Song not found.");
          return;
        }
        const song = res.data.rows[0];
        setArtist(song.artist);
        setTitle(song.title);
        setLyrics(song.lyrics);
        setTranslation(song.translation);
        setAlbumTitle(song.albumtitle);
        setAlbumCoverLink(song.albumcoverlink);
        setShowResults(false);
        setScores([]);
        setSearchMessage("");
      })
      .catch((err) => {
        console.error("Error:", err);
        setSearchMessage("Something went wrong. Please try again.");
      });

    setSearching(false);
    setUserInput("");
  };

  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleCheckTranslation = async () => {
    const userInputLines = document.getElementsByClassName(
      "userTranslationInput",
    );
    const userInputArray = Array.from(userInputLines).map(
      (input) => input.value,
    );
    setUserTranslation(userInputArray);
    setLoadingScores(true);

    try {
      const response = await axios.post("http://localhost:3001/api/compare", {
        arr1: translation,
        arr2: userInputArray,
      });

      const adjustedScores = response.data.scores.map((score, index) =>
        userInputArray[index].trim() === "" ? 0 : score,
      );

      setScores(adjustedScores);
      setShowResults(true);
    } catch (err) {
      console.error("Error fetching scores:", err);
    } finally {
      setLoadingScores(false);
    }
  };

  const handleTryAgain = () => {
    setShowResults(false);
    setScores([]);
    setUserTranslation([]);
  };

  const getScoreLevel = (score) => {
    const pct = score * 100;
    if (pct >= 80) return "green";
    if (pct >= 55) return "yellow";
    return "red";
  };

  const overallScore = scores.length
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100)
    : 0;

  const getOverallMessage = (score) => {
    if (score >= 80) return "Great work — you really know this song!";
    if (score >= 55) return "Pretty good — a few lines to work on.";
    return "Keep practicing — you'll get there!";
  };

  return (
    <div className="lyrics-page">
      <div className="search-container">
        <form
          className="search-form"
          onChange={handleChange}
          onSubmit={handleSubmit}
        >
          <div className="search-input-wrapper">
            <button type="submit" id="lyric-search-button">
              <i className="fa fa-search"></i>
            </button>
            <input
              type="text"
              className="search-input"
              autoComplete="off"
              placeholder="Search..."
              value={userInput}
            />
          </div>
        </form>
        {searchMessage && <p className="search-message">{searchMessage}</p>}
      </div>

      {title ? (
        <div>
          <div className="song-info-container">
            <div className="song-info-inner">
              <img
                src={albumCoverLink}
                alt="album cover"
                className="album-cover"
              />
              <div className="song-details">
                <h1 className="song-title">{title}</h1>
                <h3 className="album-title">{albumTitle}</h3>
                {artist.length > 0 && (
                  <h2 className="artist-name">{artist.join(", ")}</h2>
                )}
              </div>
            </div>
          </div>

          {!showResults ? (
            <div className="lyrics-section">
              {lyrics.map((line, index) => (
                <div key={index} className="lyric-row">
                  <p className="lyric-text">{line}</p>
                  <div className="lyric-input-wrapper">
                    <textarea
                      rows={1}
                      className="userTranslationInput"
                      onChange={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="submit-container">
                <button
                  className="translation-submit"
                  onClick={handleCheckTranslation}
                  disabled={loadingScores}
                >
                  {loadingScores ? "Checking..." : "Check Translation"}
                </button>
              </div>
            </div>
          ) : (
            <div className="results-section">
              {/* Overall score card */}
              <div className="overall-score-card">
                <div className="overall-score-left">
                  <span className="overall-score-label">Overall score</span>
                  <span
                    className={`overall-score-number score-color-${getScoreLevel(overallScore / 100)}`}
                  >
                    {overallScore}%
                  </span>
                  <span className="overall-score-message">
                    {getOverallMessage(overallScore)}
                  </span>
                </div>
                <div className="overall-score-bar-wrap">
                  <div className="overall-score-bar-bg">
                    <div
                      className={`overall-score-bar-fill fill-${getScoreLevel(overallScore / 100)}`}
                      style={{ width: `${overallScore}%` }}
                    />
                  </div>
                </div>
                <button className="try-again-btn" onClick={handleTryAgain}>
                  Try again
                </button>
              </div>

              {/* Results table */}
              <div className="results-table">
                <div className="results-table-header">
                  <span className="results-col-header">Spanish</span>
                  <span className="results-col-header">
                    Correct translation
                  </span>
                  <span className="results-col-header">Your translation</span>
                </div>
                {lyrics.map((line, index) => {
                  const score = scores[index] ?? 0;
                  const pct = Math.round(score * 100);
                  const level = getScoreLevel(score);
                  return (
                    <div key={index} className="results-row">
                      <span className="results-cell results-spanish">
                        {line}
                      </span>
                      <span className="results-cell results-correct">
                        {translation[index]}
                      </span>
                      <span className="results-cell results-user">
                        <span>{userTranslation[index]}</span>
                        <span className={`score-pill pill-${level}`}>
                          {pct}%
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <h1 className="no-song">No song selected</h1>
      )}
    </div>
  );
};
