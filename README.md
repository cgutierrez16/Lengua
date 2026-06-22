# Lengua 🎵

Lengua is a Spanish language learning app that uses music to help vocabulary and phrases stick. The core idea is simple — translating songs you already love is one of the most effective ways to learn a language, because every time you hear that song again, the translation comes back with it.

The main feature is the **Lyric Translator**: search for a Spanish song, translate it line by line, and get scored on your accuracy using a machine learning similarity model.

---

## Features

- **Lyric Translator** — Search for any Spanish song, type your English translation line by line, and receive a similarity score powered by a sentence transformer ML model
- **Automatic song ingestion** — Songs not yet in the database are automatically fetched from LRCLIB, translated via DeepL, and saved for future users
- **Line-by-line scoring** — Each line is scored individually so you can see exactly where your translation was strong and where it needs work
- **Overall score** — A combined accuracy score with a color-coded progress bar
- **Album art** — Pulled automatically from the iTunes Search API

---

## Tech Stack

**Frontend**
- React
- React Router DOM
- Axios
- Custom CSS (no frameworks)

**Backend**
- Node.js / Express
- PostgreSQL
- Axios

**ML Service**
- Python / Flask
- `sentence-transformers` (`paraphrase-xlm-r-multilingual-v1`)

**External APIs**
- [LRCLIB](https://lrclib.net) — Free, no-key lyrics API
- [DeepL API](https://www.deepl.com/en/products/api) — High quality Spanish → English translation
- [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI) — Album art

---

## Project Structure

```
lengua/
├── client/          # React frontend
│   └── src/
│       ├── pages/   # Lyrics, Home, Freewrite pages
│       ├── components/  # Navbar, shared components
│       ├── styles/  # CSS files per page
│       └── images/
├── server/          # Express backend
│   ├── index.js     # API routes
│   ├── scrape.js    # Lyrics fetching & translation pipeline
│   ├── db.js        # PostgreSQL connection
│   └── helperFunctions.js
└── ml_service/      # Python Flask similarity scoring service
    └── ml_service.py
```

---

## Getting Started

### Prerequisites

- Node.js
- Python 3
- PostgreSQL
- A DeepL API key (free tier available at [deepl.com](https://www.deepl.com))

### 1. Clone the repo

```bash
git clone https://github.com/cgutierrez16/Lengua.git
cd Lengua
```

### 2. Set up the database

Create a PostgreSQL database and run the following:

```sql
CREATE DATABASE songs;

CREATE TABLE songs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  artist VARCHAR(255)[],
  lyrics TEXT[],
  formattitle VARCHAR(255),
  translation TEXT[],
  albumtitle VARCHAR(255),
  albumcoverlink VARCHAR(255)
);
```

### 3. Configure environment variables

Create a `.env` file in the `server/` directory:

```
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=songs
DEEPL_API_KEY=your_deepl_api_key
```

### 4. Install dependencies and start the backend

```bash
cd server
npm install
node index.js
```

### 5. Install dependencies and start the frontend

```bash
cd client
npm install
npm start
```

### 6. Start the ML service

```bash
cd ml_service
source venv/bin/activate
pip install flask sentence-transformers
python ml_service.py
```

The app will be running at `http://localhost:3000`.

---

## How It Works

1. User searches for a Spanish song
2. Backend checks the PostgreSQL database for the song
3. If not found, lyrics are fetched from LRCLIB, translated line-by-line via DeepL, and album art is pulled from iTunes — then saved to the database
4. User types their English translation line by line
5. On submission, the user's translations and the stored translations are sent to the Python ML service
6. The ML service uses a multilingual sentence transformer to compute cosine similarity scores for each line
7. Results are displayed with per-line scores and an overall accuracy score

---

## Roadmap

- [ ] Free Write feature — timed, prompted writing exercises to practice forming Spanish sentences
- [ ] User accounts and score history
- [ ] Song library / browse page
- [ ] Mobile responsive design

---

## Author

**Carlos Gutierrez**
[LinkedIn](https://www.linkedin.com/in/carlos-gutierrez-software/)
