import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { LyricTypingInput } from "../components/lyricTypingInput";

export const Lyrics = () => {
  const [lyrics, setLyrics] = useState([]);
  const [translation, setTranslation] = useState([]);
  const [title, setTitle] = useState();
  const [formattedTitle, setFormattedTitle] = useState();
  const [artist, setArtist] = useState([]);
  const [userInput, setUserInput] = useState();
  const lyricRefs = useRef([]); // Store refs for lyrics

  useEffect(() => {
    console.log("Translation updated:", translation);
  }, [translation]);

  useEffect(() => {
    // Measure the height of each lyric after render
    const heights = lyricRefs.current.map((ref) => ref?.offsetHeight || 0);
    console.log("Lyric Heights:", heights);
  }, [lyrics]);

  /**
   * Function used to add a song to database if it does not exist
   */
  const addLyrics = async () => {
    axios
      .post("/lyrics")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  /**
   * Handles the search query from user. Strips all white space and toLowerCase the userInput state. Then makes a request to /lyrics route and returns the song
   * @param {event} event The event of a submission being recognized
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios
      .get("/api/lyrics", {
        params: { userInput: userInput },
      })
      .then((res) => {
        console.log(res.data.rows[0]);
        setArtist(res.data.rows[0].artist);
        setTitle(res.data.rows[0].title);
        setFormattedTitle(res.data.rows[0].formattitle);
        setLyrics(res.data.rows[0].lyrics);
        setTranslation(res.data.rows[0].translation);
        console.log(title);
      })
      .catch((err) => {
        console.error("Error:", err); // Handle errors
      });

    setUserInput("");
  };

  /**
   * Any time changes are made to form box (i.e. A single letter being typed) this function will    trigger and update the userInput React state accordingly. Binded to the onChange attribute of form tag
   * @param {event} event  The event of changes being made to the form text box
   */
  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <div>
      <div className="container pb-5 mb-5">
        <div className="row justify-content-center mt-5">
          <div className="col-sm-6">
            <form onChange={handleChange} onSubmit={handleSubmit}>
              <div class="input-group input-group-lg">
                <span class="input-group-text" id="inputGroup-sizing-lg">
                  <button id="lyric-search-button">
                    <i class="fa fa-search"></i>
                  </button>
                </span>
                <input
                  type="text"
                  class="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-lg"
                  autocomplete="off"
                  placeholder="Search..."
                  value={userInput}
                  id="lyric-search-input"
                />
              </div>
            </form>
            <button onClick={addLyrics}>Add Lyrics to Database</button>
          </div>
        </div>

        {title ? (
          <div>
            <div className="row mt-5 justify-content-center">
              <div className="col-sm-8 d-flex justify-content-evenly ">
                <div className="col-sm-4 ms-5 ps-5">
                  <img
                    src={`/song-covers/${formattedTitle}.jpg`}
                    alt="album cover"
                    className="album-cover"
                  />
                </div>
                <div className="col-sm-5 text-start pt-2">
                  {title ? <h1>{title}</h1> : <h1>Search for song name</h1>}
                  {artist.length > 0 ? (
                    <div
                      className="text-truncate"
                      style={{
                        maxWidth: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <h2
                        className="grey"
                        style={{ display: "inline", fontSize: "1.50rem" }}
                      >
                        {artist.join(", ")}
                      </h2>
                    </div>
                  ) : (
                    <h2> </h2>
                  )}
                </div>
              </div>
            </div>
            <div className="row justify-content-evenly mt-5 py-5 lyrics-border">
              <div
                className="col-sm-6 text-start ps-3"
                style={{
                  fontSize: "22px",
                  borderRight: "solid 2px #5ae4a7",                  
                }}
              >
                {lyrics.length > 0 ? (
                  lyrics.map((line, index) => (
                    <p
                      key={index}
                      className="lyrics-align test"
                      ref={(el) => (lyricRefs.current[index] = el)} // Store ref for measurement
                    >
                      {line}
                    </p>
                  ))
                ) : (
                  <p> </p>
                )}
              </div>
              <div
                className="col-sm-6 text-start ps-3"
                style={{ fontSize: "22px" }}
              >
                <LyricTypingInput lines={translation} lyricRefs={lyricRefs}/>
              </div>
            </div>
          </div>
        ) : (
          <h1>No song selected</h1>
        )}
      </div>
    </div>
  );
};