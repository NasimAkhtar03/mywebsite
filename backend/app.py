"""
Alternative: Flask API for Chatbot
Deploy this to Render, Railway, or any Python hosting service
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Resume context
RESUME_INFO = {
    'name': 'SK Nasim Akhtar',
    'role': 'AI/ML Engineer',
    'location': 'Noida, India',
    'email': 'sknasimakhtar1997@gmail.com',
    'phone': '+91-8599849565',
    'skills': ['Python', 'LLMs', 'RAG', 'LangChain', 'Deep Learning', 'NLP', 'Computer Vision'],
    'current_role': 'Assistant Manager - Generative AI Chatbot (RAG Platform) at Cube Highways',
    'experience': '4+ years in AI/ML',
    'education': 'M.Tech from IIT Kanpur'
}


@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    """Chat endpoint"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        data = request.json
        user_message = data.get('message', '')
        conversation_history = data.get('conversation_history', [])
        
        # Generate response
        response = generate_response(user_message, conversation_history)
        
        return jsonify({
            'response': response,
            'timestamp': datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def generate_response(user_message, conversation_history):
    """Generate AI response"""
    message_lower = user_message.lower()
    
    # Simple rule-based (replace with LLM API call)
    if any(word in message_lower for word in ['hi', 'hello', 'hey']):
        return f"Hello! I'm {RESUME_INFO['name']}'s AI assistant. How can I help you learn more about his background and experience?"
    
    elif any(word in message_lower for word in ['skill', 'technology', 'tech']):
        return f"{RESUME_INFO['name']} specializes in {', '.join(RESUME_INFO['skills'][:5])} and more. He has expertise in Generative AI, RAG systems, LLM fine-tuning, and MLOps."
    
    elif any(word in message_lower for word in ['experience', 'work', 'job', 'role']):
        return f"{RESUME_INFO['name']} currently works as {RESUME_INFO['current_role']}. He has {RESUME_INFO['experience']} of experience building production AI systems."
    
    elif any(word in message_lower for word in ['contact', 'email', 'reach', 'connect']):
        return f"You can reach {RESUME_INFO['name']} at {RESUME_INFO['email']} or {RESUME_INFO['phone']}. You can also connect on LinkedIn!"
    
    else:
        return f"Thanks for your question! {RESUME_INFO['name']} is an AI/ML Engineer specializing in Generative AI, NLP, and Computer Vision. Feel free to ask about his skills, experience, or projects."


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

