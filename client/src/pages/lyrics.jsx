import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/lyrics.css";
import ConjugationTable from "../components/conjugationTable";
import Practice from "../components/practice";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabaseClient";

export const Lyrics = () => {
  const { user } = useAuth();
  const [songID, setSongID] = useState();
  const [lyrics, setLyrics] = useState([]);
  const [translation, setTranslation] = useState([]);
  const [title, setTitle] = useState();
  const [artist, setArtist] = useState([]);
  const [albumTitle, setAlbumTitle] = useState();
  const [albumCoverLink, setAlbumCoverLink] = useState();
  const [userInput, setUserInput] = useState("");
  const [userTranslation, setUserTranslation] = useState([]);
  // Scores is an array of line by line similarity scores for a user's translation
  const [scores, setScores] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loadingScores, setLoadingScores] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [wordAnalysis, setWordAnalysis] = useState({});
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("results");

  const handleSubmit = async (event) => {
    event.preventDefault();
    //supabase.com/dashboard/project/dyiemdfcuxphvqryspxg/editor
    https: setSearching(true);
    setSearchMessage("Searching...");

    await axios
      .get("http://localhost:3001/api/lyrics", { params: { userInput } })
      .then((res) => {
        if (!res.data.rows || res.data.rows.length === 0) {
          setSearchMessage("Song not found.");
          return;
        }
        const song = res.data.rows[0];
        setSongID(song.id);
        setArtist(song.artist);
        setTitle(song.title);
        setLyrics(song.lyrics);
        setTranslation(song.translation);
        setAlbumTitle(song.albumtitle);
        setAlbumCoverLink(song.albumcoverlink);
        setShowResults(false);
        setScores([]);
        setSearchMessage("");
        setActiveTab("results");
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

  const insertStats = async (finalScores) => {
    if (!user) return;

    const overall = Math.round(
      (finalScores.reduce((a, b) => a + b, 0) / finalScores.length) * 100,
    );

    const overallScore = finalScores.length
      ? Math.round((finalScores.reduce((a, b) => a + b, 0) / finalScores.length) * 100)
      : 0;

    const { error } = await supabase.from("lyric_attempts").insert({
      user_id: user.id,
      song_id: songID,
      overall_score: overallScore,
      line_scores: finalScores,
    });

    if (error) console.error("Failed to save stats:", error);
  };

  /*
   * This is the function that runs after the user hits the "check translation" button
   */
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
      insertStats(adjustedScores);
      setShowResults(true);
      setActiveTab("results");
      analyzeLines(lyrics, translation, userInputArray);
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
    setWordAnalysis({});
    setActiveTab("results");
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

  const analyzeLines = async (
    lyricsArr,
    translationArr,
    userTranslationArr,
  ) => {
    setAnalysisLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/analyze-song",
        {
          lyrics: lyricsArr,
          correctTranslations: translationArr,
          userTranslations: userTranslationArr,
        },
      );
      setWordAnalysis(response.data.analysis);
    } catch (err) {
      console.error("Analysis error:", err);
      setWordAnalysis({});
    } finally {
      setAnalysisLoading(false);
    }
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
              {/* Score card */}
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

              {/* Toggle */}
              <div className="results-practice-toggle">
                <button
                  className={`toggle-btn ${activeTab === "results" ? "toggle-active" : ""}`}
                  onClick={() => setActiveTab("results")}
                >
                  Results
                </button>
                <button
                  className={`toggle-btn ${activeTab === "practice" ? "toggle-active" : ""}`}
                  onClick={() => setActiveTab("practice")}
                  disabled={analysisLoading}
                >
                  {analysisLoading ? "Analyzing..." : "Practice"}
                </button>
              </div>

              {/* Content */}
              {activeTab === "results" ? (
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
                          {analysisLoading
                            ? line
                            : line.split(" ").map((word, wi) => {
                                const cleanWord = word.replace(
                                  /[¿?¡!.,;:'"]/g,
                                  "",
                                );
                                const analysis =
                                  wordAnalysis[String(index)] || [];
                                const match = analysis.find(
                                  (w) =>
                                    w.word.toLowerCase() ===
                                    cleanWord.toLowerCase(),
                                );
                                return match ? (
                                  <span key={wi} className="word-hint-wrapper">
                                    <span className="underlined-word">
                                      {word}
                                    </span>
                                    <div className="word-hint-card">
                                      <p className="hint-word">
                                        {match.word}
                                        {match.isVerb && match.infinitive && (
                                          <span
                                            style={{
                                              fontSize: "14px",
                                              fontWeight: 400,
                                              color: "#838383",
                                              marginLeft: "6px",
                                            }}
                                          >
                                            ({match.infinitive})
                                          </span>
                                        )}
                                      </p>
                                      <p className="hint-definition">
                                        {match.definition}
                                      </p>
                                      {match.isVerb && match.infinitive && (
                                        <ConjugationTable
                                          infinitive={match.infinitive}
                                        />
                                      )}
                                    </div>
                                  </span>
                                ) : (
                                  <span key={wi}>{word} </span>
                                );
                              })}
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
              ) : (
                <Practice wordAnalysis={wordAnalysis} />
              )}
            </div>
          )}
        </div>
      ) : (
        <h1 className="no-song">No song selected</h1>
      )}
    </div>
  );
};
