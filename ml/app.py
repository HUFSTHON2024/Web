from flask import Flask, request, jsonify
from flask_cors import CORS
from model.classifier import NumberClassifier

app = Flask(__name__)
CORS(app)

classifier = NumberClassifier()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        features = data.get('features', [])
        
        if not features or len(features) != 4:
            return jsonify({
                "error": "4개의 특성값이 필요합니다"
            }), 400
            
        result = classifier.predict(features)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000) 