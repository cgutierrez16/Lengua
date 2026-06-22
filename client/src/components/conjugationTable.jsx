import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/conjugation.css";

const ConjugationTable = ({ infinitive }) => {
  const [tense, setTense] = useState("present");
  const [conjugations, setConjugations] = useState(null);
  const persons = ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos/ellas"];

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/conjugate?verb=${infinitive}`)
      .then((res) => setConjugations(res.data.conjugations))
      .catch(() => setConjugations(null));
  }, [infinitive]);

  if (!conjugations)
    return <p style={{ fontSize: "13px", color: "#838383" }}>Loading...</p>;

  return (
    <div className="conjugation-table">
      <div className="conjugation-tense-tabs">
        {["present", "imperfect", "preterite", "future"].map((t) => (
          <button
            key={t}
            className={`tense-tab ${tense === t ? "active" : ""}`}
            onClick={(e) => { e.stopPropagation(); setTense(t); }}
          >
            {t}
          </button>
        ))}
      </div>
      <table>
        <tbody>
          {persons.map((p) => (
            <tr key={p}>
              <td className="person-cell">{p}</td>
              <td className="conjugation-cell">{conjugations[tense]?.[p] || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConjugationTable;