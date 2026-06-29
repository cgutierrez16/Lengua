const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const pool = require("./db");
const fetchLyrics = require("./scrape");
const FormatTitle = require("./helperFunctions");
const Anthropic = require("@anthropic-ai/sdk");
const SpanishVerbs = require("spanish-verbs");
const SearchAndScrape = require("./scrape");
const axios = require("axios"); // for Hugging Face API requests
//const fetch = require("node-fetch"); // for Hugging Face API requests
require("dotenv").config(); // load .env variables

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES

app.get("/api/lyrics", async (req, res) => {
  try {
    const userInput = req.query.userInput;
    const formattedUserInput = FormatTitle(userInput);

    const song = await pool.query(
      "SELECT * FROM songs WHERE formattitle = $1",
      [formattedUserInput]
    );

    if (song.rows.length > 0) {
      res.send(song);
    } else {
      const [artist, title, spanishLyrics, englishLyrics, albumName, imageLink] =
        await SearchAndScrape(userInput);
      const formattedTitle = FormatTitle(title);

      await pool.query(
        `INSERT INTO songs (title, artist, lyrics, formattitle, translation, albumtitle, albumcoverlink) 
         VALUES($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (formattitle) DO NOTHING`,
        [title, artist, spanishLyrics, formattedTitle, englishLyrics, albumName, imageLink]
      );

      const newSong = await pool.query(
        "SELECT * FROM songs WHERE formattitle = $1",
        [formattedTitle]
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

//Route for word analysis feature
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
app.post("/api/analyze-song", async (req, res) => {
  try {
    const { lyrics, correctTranslations, userTranslations } = req.body;

    const lines = lyrics
      .map(
        (line, i) =>
          `Line ${i}: "${line}" | Correct: "${correctTranslations[i]}" | Student: "${userTranslations[i] || ""}"`,
      )
      .join("\n");

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `You are a Spanish language teacher analyzing a student's song translation.

Here are all the lines with the correct translation and the student's attempt:
${lines}

For each line, identify Spanish verbs or nouns the student clearly did not know.
A word should ONLY be flagged if its meaning is completely absent from the student's translation or was translated with a clearly wrong meaning. Consider synonyms and paraphrases as correct — for example "understood" and "understood you" are the same meaning. Do not flag a word if the student captured the correct meaning even with slightly different phrasing or word order.
Also flag a word if the student left it untranslated — meaning they wrote the Spanish word directly in their English translation instead of providing the English equivalent.
Do NOT flag a word if the student conveyed its meaning correctly, even if they used different phrasing or word order.
Do NOT include small function words like que, de, a, en, y, o, un, una, el, la, los, las, se, me, te, le, no, si, con, por, para, su, sus.
Do flag short but meaningful verbs like sé, soy, fue, fui, etc. if the student got them wrong.
For the infinitive, always return the base infinitive without reflexive pronouns (e.g. "quedar" not "quedarse", "mirar" not "mirarse").
The definition should be only the English meaning of the word. Do not include grammar notes, tense info, context, or any explanation of what the student wrote.

Return ONLY a valid JSON object where each key is the line index as a string.
If a line was correct or had no missed key words, use an empty array.
Return ONLY valid JSON, no markdown, no explanation.

Format:
{
  "0": [],
  "1": [
    {
      "word": "Spanish word as it appears in the line",
      "infinitive": "infinitive form of the verb, or null if noun",
      "definition": "English definition",
      "isVerb": true or false
    }
  ]
}`,
        },
      ],
    });

    const text = message.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(clean);
    console.log("Claude analysis:", JSON.stringify(analysis, null, 2));
    res.json({ analysis });
  } catch (err) {
    console.error("Claude error:", err.message);
    res.status(500).json({ error: "Failed to analyze song", analysis: {} });
  }
});

app.get("/api/conjugate", async (req, res) => {
  try {
    const { verb } = req.query;

    const tenseMap = {
      present: "INDICATIVE_PRESENT",
      imperfect: "INDICATIVE_IMPERFECT",
      preterite: "INDICATIVE_PRETERITE",
      future: "INDICATIVE_FUTURE",
    };

    const personMap = [
      { label: "yo", index: 0 },
      { label: "tú", index: 1 },
      { label: "él/ella", index: 2 },
      { label: "nosotros", index: 3 },
      { label: "vosotros", index: 4 },
      { label: "ellos/ellas", index: 5 },
    ];

    const result = {};
    for (const [tenseKey, tenseValue] of Object.entries(tenseMap)) {
      result[tenseKey] = {};
      for (const p of personMap) {
        try {
          const form = SpanishVerbs.getConjugation(verb, tenseValue, p.index);
          result[tenseKey][p.label] = form || "";
        } catch {
          result[tenseKey][p.label] = "";
        }
      }
    }

    res.json({ conjugations: result });
  } catch (err) {
    console.error("Conjugation error:", err.message);
    res.status(500).json({ error: "Failed to conjugate verb" });
  }
});

app.post("/api/freewrite-feedback", async (req, res) => {
  try {
    const { prompt, userText } = req.body;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a Spanish language teacher evaluating a student's free write exercise.

          The student was given this prompt in English: "${prompt}"
          The student wrote the following in Spanish:
          "${userText}"

          Evaluate the writing and return ONLY valid JSON, no markdown, no explanation.

          Return this exact format:
          {
            "onTopicScore": <number 0-100>,
            "qualityScore": <number 0-100>,
            "wordCount": <number>,
            "onTopicFeedback": "<one sentence explaining the on-topic score>",
            "qualityFeedback": "<one sentence explaining the quality score>",
            "flags": [
              {
                "original": "<exact text from the student's writing that has an issue>",
                "suggestion": "<corrected version>",
                "reason": "<brief explanation of the issue, e.g. wrong gender agreement, incorrect verb tense>"
              }
            ]
          }

          For flags:
          - Flag grammar errors like wrong gender agreement (la dia → el día), incorrect verb conjugations, wrong tense usage
          - Flag unnatural phrasing that a native speaker would not use
          - Flag spelling errors but ignore missing or incorrect accent marks entirely — do not flag "dia" instead of "día", "tu" instead of "tú", "el" instead of "él", etc.
          - The "original" field must be the exact substring as it appears in the student's text so it can be highlighted
          - Only flag real errors, not stylistic choices
          - If the student wrote nothing or very little, return empty flags array and low scores
          - Word count should be the actual number of Spanish words written`,
        },
      ],
    });

    const text = message.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();
    const feedback = JSON.parse(clean);

    res.json(feedback);
  } catch (err) {
    console.error("Freewrite feedback error:", err.message);
    res.status(500).json({ error: "Failed to generate feedback" });
  }
});

app.get("/api/prompts/random", async (req, res) => {
  try {
    const excludeId = req.query.excludeId;
    let query = "SELECT * FROM prompts ORDER BY RANDOM() LIMIT 1";
    let params = [];

    if (excludeId) {
      query = "SELECT * FROM prompts WHERE id != $1 ORDER BY RANDOM() LIMIT 1";
      params = [excludeId];
    }

    const result = await pool.query(query, params);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch prompt" });
  }
});

// LISTEN

app.listen(3001, () => {
  console.log("Listening on port 3001");
});
