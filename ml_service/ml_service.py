# To run the development server, use the commands:
# source venv/bin/activate
# python ml_service.py
# Close server with Ctrl+C

from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
model = SentenceTransformer("sentence-transformers/paraphrase-xlm-r-multilingual-v1")

@app.route("/similarity", methods=["POST"])
def similarity():
    data = request.get_json()
    realTranslation = data.get("arr1", [])
    userTranslation = data.get("arr2", [])

    if len(realTranslation) != len(userTranslation):
        return jsonify({"error": "Arrays must have the same length"}), 400

    embeddings1 = model.encode(realTranslation, convert_to_tensor=True)
    embeddings2 = model.encode(userTranslation, convert_to_tensor=True)

    similarities = [
        util.cos_sim(embeddings1[i], embeddings2[i]).item()
        for i in range(len(realTranslation))
    ]

    return jsonify({"scores": similarities})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
