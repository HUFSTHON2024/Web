from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

load_dotenv()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message', '')
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "당신은 도움이 되는 AI 어시스턴트입니다."},
                {"role": "user", "content": message}
            ],
            temperature=0.7
        )
        
        print("OpenAI Response:", response.choices[0].message.content)
        
        return jsonify({
            "response": response.choices[0].message.content
        })
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000) 