require("dotenv").config();
const Anthropic = require("@anthropic-ai/sdk");
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const fetchLyrics = async (searchQuery) => {
  const searchRes = await fetch(
    `https://lrclib.net/api/search?q=${encodeURIComponent(searchQuery)}`,
    { headers: { "User-Agent": "Lengua/1.0" } },
  );
  const results = await searchRes.json();

  if (!results || results.length === 0) {
    throw new Error("Song not found on LRCLIB");
  }

  const song = findBestMatch(results, searchQuery);
  const title = song.trackName;
  const artist = [song.artistName];
  const albumName = song.albumName;
  const plainLyrics = song.plainLyrics;

  if (!plainLyrics) {
    throw new Error("No lyrics found for this song");
  }

  const spanishArray = plainLyrics
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const englishArray = await Translate(spanishArray);

  // Use LRCLIB's artist + title to query iTunes for a consistent match
  const imageLink = await getAlbumArt(song.artistName, song.trackName);

  return [artist, title, spanishArray, englishArray, albumName, imageLink];
};

const deepl = require("deepl-node");

const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

const Translate = async (lyricsArray) => {
  const numberedLines = lyricsArray
    .map((line, i) => `${i}: ${line}`)
    .join("\n");

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Translate these Spanish song lyrics to natural, idiomatic English. Consider the full context of the song when translating each line, including slang, idioms, and ambiguous phrasing.

${numberedLines}

Return ONLY a valid JSON array of strings, one per line, in the same order and same number of lines as the input. No markdown, no explanation, just the JSON array.`,
      },
    ],
  });

  const text = message.content[0].text;
  const clean = text.replace(/```json|```/g, "").trim();
  const translations = JSON.parse(clean);

  return translations;
};

const getAlbumArt = async (artist, title) => {
  try {
    const query = encodeURIComponent(`${artist} ${title}`);
    const res = await fetch(
      `https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=1`,
    );
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      // artworkUrl100 is 100x100, replace with 600x600 for better quality
      return data.results[0].artworkUrl100.replace("100x100bb", "600x600bb");
    }
    return null;
  } catch (err) {
    console.error("Failed to fetch album art:", err);
    return null;
  }
};

const findBestMatch = (results, searchQuery) => {
  const query = searchQuery.toLowerCase();

  // If only one result, use it
  if (results.length === 1) return results[0];

  // Try to find a result where the artist name appears in the search query
  const artistMatch = results.find(
    (r) => r.artistName && query.includes(r.artistName.toLowerCase()),
  );
  if (artistMatch) return artistMatch;

  // Try to find a result where the track name appears in the search query
  const titleMatch = results.find(
    (r) => r.trackName && query.includes(r.trackName.toLowerCase()),
  );
  if (titleMatch) return titleMatch;

  // Fall back to first result
  return results[0];
};

module.exports = fetchLyrics;
