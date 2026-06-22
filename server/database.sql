CREATE DATABASE music;

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

CREATE TABLE prompts (
  id SERIAL PRIMARY KEY,
  prompt_es VARCHAR(255),
  prompt_en VARCHAR(255)
);