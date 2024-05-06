import React, { useState } from "react";
import axios from "axios";

export const Lyrics = () => {
  const [lyrics, setLyrics] = useState([]);
  const [title, setTitle] = useState();
  const [artist, setArtist] = useState([]);
  const [translation, setTranslation] = useState([]);
  const [userInput, setUserInput] = useState();

  //Routes

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

  //Form handling
  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = userInput.toLowerCase();
    await axios
      .get("/lyrics", { params: { userInput: title } })
      .then((res) => {
        console.log(res.data.rows[0]);
        setArtist(res.data.rows[0].artist);
        setTitle(res.data.rows[0].title);
        setLyrics(res.data.rows[0].lyrics);
        setTranslation(res.data.rows[0].translation);
      })
      .catch((err) => {
        console.error("Error:", err); // Handle errors
      });

    setUserInput("");
  };

  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <div>
      <h1>Balls lol from lyrics</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={handleChange}
          placeholder="Enter your input"
        />
        <button type="submit">Submit</button>
      </form>
      <button onClick={addLyrics}>Add Lyrics to Database</button>

      <div className="container">
        <div className="row justify-content-evenly mt-5">
          <div className="col-sm-6 text-start ps-3">
            <h1>{title}</h1>
            {artist.map((string, index) => (
              <h2 key={index}>{string}</h2>
            ))}
            {lyrics.map((string, index) => (
              <p key={index} style={{ fontSize: "22px" }}>
                {string}
              </p>
            ))}
          </div>
          <div className="col-sm-6 text-start ps-3">
            <h1>{title}</h1>
            {artist.map((string, index) => (
              <h2 key={index}>{string}</h2>
            ))}
            {translation.map((string, index) => (
              <p key={index} style={{ fontSize: "22px" }}>
                {string}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// const getLyrics = async () => {
//   axios
//     .get("/lyrics")
//     .then((res) => {
//       console.log(res.data.rows[0]);
//     })
//     .catch((err) => {
//       console.error("Error:", err); // Handle errors
//     });
// };
