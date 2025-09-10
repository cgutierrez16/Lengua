/*
import React, { useEffect, useState } from "react";
import { HfInference } from "@huggingface/inference";

export const Hugging = () => {
  const [sentenceSimilarityRes, setSentenceSimilarityRes] = useState(null);
  const [loading, setLoading] = useState(true); // To handle loading state

  useEffect(() => {
    const fetchData = async () => {
      const hf = new HfInference(process.env.REACT_APP_HUGGING_FACE_TOKEN);
      
      try {
        let result = await hf.sentenceSimilarity({
          model: "sentence-transformers/paraphrase-xlm-r-multilingual-v1",
          inputs: {
            source_sentence: "You have no idea",
            //No te imaginas
            sentences: [
              "You can't imagine",
              "You don't have an idea",
              "You cannot imagine",
              "You have no idea",
            ],
          },
        });
        setSentenceSimilarityRes(result); // Set the result when fetched
      } catch (error) {
        console.error("Error fetching sentence similarity:", error);
      } finally {
        setLoading(false); // Stop loading once the result is fetched
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <div>
      <h2>Sentence Similarity Results</h2>
      {sentenceSimilarityRes ? (
        <ul>
          {sentenceSimilarityRes.map((similarity, index) => (
            <li key={index}>Similarity score: {similarity}</li>
          ))}
        </ul>
      ) : (
        <p>No results available.</p>
      )}
    </div>
    </div>
  );
};
*/

import React, { useEffect, useState } from "react";
import axios from "axios";

export const Hugging = () => {
  const [sentenceSimilarityRes, setSentenceSimilarityRes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call your backend instead of Hugging Face directly
        const response = await axios.post("http://localhost:3001/api/huggingface", {
          text: {
            model: "sentence-transformers/paraphrase-xlm-r-multilingual-v1",
            inputs: {
              source_sentence: "You have no idea",
              sentences: [
                "You can't imagine",
                "You don't have an idea",
                "You cannot imagine",
                "You have no idea",
              ],
            },
          },
        });

        const result = response.data;
        setSentenceSimilarityRes(result);
      } catch (error) {
        console.error("Error fetching sentence similarity:", error);
      } finally {
        setLoading(false);
        console.log(sentenceSimilarityRes);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Sentence Similarity Results</h2>
      {loading ? (
        <p>Loading...</p>
      ) : sentenceSimilarityRes ? (
        
        <ul>
          {sentenceSimilarityRes.map((similarity, index) => (
            <li key={index}>Similarity score: {similarity}</li>
          ))}
        </ul>
        
        //<h1>worked</h1>
      ) : (
        <p>No results available.</p>
      )}
    </div>
  );
};