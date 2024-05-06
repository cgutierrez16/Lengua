const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const Musix = require("./scrape");
const FormatTitle = require("./helperFunctions")

// MIDDLEWARE
app.use(cors());
app.use(express.json());


// ROUTES

app.get("/lyrics", async (req, res) => {
  try {
    const userInput = req.query.userInput;
    const formattedUserInput = FormatTitle(userInput)
    //console.log("Input recieved: " + formattedUserInput)

    const song = await pool.query(
      "SELECT * FROM songs WHERE formattitle = $1", [formattedUserInput] 
    );
    res.send(song);
  } catch (err) {
    console.error(err);
  }
});

app.post("/lyrics", async (req, res) => {
  try {
    const [artist, title, spanishLyrics, englishLyrics] = await Musix();
    const formattedTitle = FormatTitle(title)
    //pool.query("INSERT INTO songs (title, artist, lyrics, formattitle, translation) VALUES($1, $2, $3, $4, $5)", [title, artist, spanishLyrics, formattedTitle, englishLyrics])
    res.send("Post request success");
  } catch (error) {
    console.error(error);
  }
});

// LISTEN

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
