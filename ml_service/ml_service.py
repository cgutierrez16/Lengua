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
    arr1 = data.get("arr1", [])
    arr2 = data.get("arr2", [])

    if len(arr1) != len(arr2):
        return jsonify({"error": "Arrays must have the same length"}), 400

    embeddings1 = model.encode(arr1, convert_to_tensor=True)
    embeddings2 = model.encode(arr2, convert_to_tensor=True)

    similarities = [
        util.cos_sim(embeddings1[i], embeddings2[i]).item()
        for i in range(len(arr1))
    ]

    return jsonify({"scores": similarities})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
