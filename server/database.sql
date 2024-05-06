CREATE DATABASE music;

CREATE TABLE songs(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    artist VARCHAR(255),
    lyrics TEXT[]
)