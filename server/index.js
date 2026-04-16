const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const pool = require("./db");
const fetchLyrics = require("./scrape");
const FormatTitle = require("./helperFunctions");
const axios = require("axios"); // for Hugging Face API requests
//const fetch = require("node-fetch"); // for Hugging Face API requests
require("dotenv").config(); // load .env variables

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES

app.get("/api/lyrics", async (req, res) => {
  console.log("HIT /api/lyrics", req.query);
  try {
    const userInput = req.query.userInput;
    const formattedUserInput = FormatTitle(userInput);

    const song = await pool.query(
      "SELECT * FROM songs WHERE formattitle = $1",
      [formattedUserInput],
    );

    if (song.rows.length > 0) {
      // Song found in DB, return it
      res.send(song);
    } else {
      // Song not found, scrape it
      const [
        artist,
        title,
        spanishLyrics,
        englishLyrics,
        albumName,
        imageLink,
      ] = await fetchLyrics(userInput);
      const formattedTitle = FormatTitle(title);

      await pool.query(
        "INSERT INTO songs (title, artist, lyrics, formattitle, translation, albumtitle, albumcoverlink) VALUES($1, $2, $3, $4, $5, $6, $7)",
        [
          title,
          artist,
          spanishLyrics,
          formattedTitle,
          englishLyrics,
          albumName,
          imageLink,
        ],
      );

      // Fetch and return the newly inserted song
      const newSong = await pool.query(
        "SELECT * FROM songs WHERE formattitle = $1",
        [formattedTitle],
      );
      res.send(newSong);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch or scrape song" });
  }
});


app.post("/api/huggingface", async (req, res) => {
  try {
    const { model, inputs } = req.body.text;
    console.log(inputs);
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Hugging Face request failed" });
  }
});

// Route to compare two arrays using the Python ML service
app.post("/api/compare", async (req, res) => {
  try {
    const { arr1, arr2 } = req.body;

    const response = await axios.post(
      "http://127.0.0.1:5000/similarity",
      {
        arr1,
        arr2,
      },
      { headers: { "Content-Type": "application/json" } },
    );

    res.json(response.data);
  } catch (err) {
    console.error("Error calling Python service:", err.message);
    res.status(500).json({ error: "Failed to compute similarity" });
  }
});

// LISTEN

app.listen(3001, () => {
  console.log("Listening on port 3001");
});
