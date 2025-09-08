const express = require("express");
const path = require("path");
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
    const [artist, title, spanishLyrics, englishLyrics, albumName, imageLink] = await Musix("https://www.musixmatch.com/lyrics/Eslabon-Armado/Donde-Has-Estado/translation/english");
    const formattedTitle = FormatTitle(title)
    pool.query("INSERT INTO songs (title, artist, lyrics, formattitle, translation, albumtitle, albumcoverlink) VALUES($1, $2, $3, $4, $5, $6, $7)", [title, artist, spanishLyrics, formattedTitle, englishLyrics, albumName, imageLink])
    res.send("Post request success");
  } catch (error) {
    console.error(error);
  }
});


// CONNECTS NODE ROUTING WITH REACT ROUTER DOM. FIXES ISSUE WHERE A REFRESH 
// WOULD BREAK THE SITE IF BOTH REACT DEV SERVER AND BACKEND SERVER WERE 
// RUNNING AT THE SAME TIME

// Serve static files from the React app
// Route all requests to React's index.html. React-router-dom will handle 
// all of the routing with regards to navigating the pages

/*
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
*/

// LISTEN

app.listen(3001, () => {
  console.log("Listening on port 3001");
});
