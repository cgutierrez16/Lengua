import React, { useEffect, useState } from "react";
import axios from "axios";

export const Hugging = ({ userTranslation, realTranslation }) => {
  const [sentenceSimilarityRes, setSentenceSimilarityRes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clicked, setClicked] = useState(false);

  const checkTranslation = async () => {
    setLoading(true);
    setClicked(true);
    try {
      const response = await axios.post("http://localhost:3001/api/compare", {
        arr1: realTranslation,
        arr2: userTranslation,
      });

      const result = response.data.scores;
      setSentenceSimilarityRes(result);
    } catch (error) {
      console.error("Error fetching sentence similarity:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkTranslation();
  }, []);

  return (
    <div>
      {loading && clicked ? (
        <p>Loading...</p>
      ) : sentenceSimilarityRes ? (
        <ul>
          {sentenceSimilarityRes.map((similarity, index) => (
            <li key={index}>Similarity score: {similarity}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
