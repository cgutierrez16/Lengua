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
        <div className="row mt-5 primary-card">
          <div className="col-sm-12 text-start ps-3">
            <h1>Y Yo Sin Ti</h1>
            <h2>Calibre 50</h2>
          </div>
        </div>
        <div className="row justify-content-evenly mt-5">
          <div
            className="col-sm-6 text-start ps-3"
            style={{ fontSize: "22px", borderRight: "solid 2px black" }}
          >
            <p>No te imaginas</p>
            <p>Como me la estoy passando</p>
            <p>Lo dificil que es hablar sin convencer</p>
            <p>Que cuanto se puede amar a una mujer</p>
            <p>No te imaginas</p>
            <p>Como son mis madrugadas</p>
          </div>
          <div
            className="col-sm-6 text-start ps-3"
            style={{ fontSize: "22px" }}
          >
            <p className="ps-3">You have no idea</p>
            <p className="ps-3">How I've been spending my time</p>
            <p className="ps-3">How difficult it is to speak without convincing</p>
            <p className="ps-3">How much can you love a woman?</p>
            <p className="ps-3">You have no idea</p>
            <p className="ps-3">How are my early mornings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// <h1>{title}</h1>;
// {
//   artist.map((string, index) => <h2 key={index}>{string}</h2>);
// }
// {
//   translation.map((string, index) => (
//     <p key={index} style={{ fontSize: "22px" }}>
//       {string}
//     </p>
//   ));
// }

/* No te imaginas

Como me la estoy pasando

Lo difícil que es hablar sin convencer

Que cuanto se puede amar a una mujer

No te imaginas

Como son mis madrugadas

Como ansío que llegue el amanecer

Para dejar de pensar en tu querer

Como

Como todo mi mundo sin ti se ha tornado obsoleto

Como es cierto que alguien sin amor no es un alguien completo

Y yo sin ti, cariño

Nunca

Nunca antes sentí lo profundo de una mirada

Nunca nadie le dio tanto fuego a mi fría morada

Y hoy no queda nada

Calibre 50

Como

Como todo mi mundo sin ti se ha tornado obsoleto

Como es cierto que alguien sin amor no es un alguien completo

Y yo sin ti, cariño

Nunca

Nunca antes sentí lo profundo de una mirada

Nunca nadie le dio tanto fuego a mi fría morada

Y hoy no queda nada

No te imaginas

Todo lo que estoy sintiendo

Estas cosas poco entiendo, pero sé

Que ya no te olvidaré

*/

/*
You have no idea

How am I spending it?

How difficult it is to speak without convincing

How much can you love a woman?

You have no idea

How are my early mornings

How I long for the dawn to come

To stop thinking about your love

As

How my whole world without you has become obsolete?

How is it true that someone without love is not a complete someone?

And me without you, darling

Never

I never felt the depth of a look before

No one ever gave so much fire to my cold dwelling

And today there is nothing left

Calibre 50

As

How my whole world without you has become obsolete?

How is it true that someone without love is not a complete someone?

And me without you, darling

Never

I never felt the depth of a look before

No one ever gave so much fire to my cold dwelling

And today there is nothing left

You have no idea

All i'm feeling

These things I understand little, but I know

That I will not forget you
*/
