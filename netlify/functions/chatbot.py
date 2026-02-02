"""
Netlify Function for Chatbot Backend
This runs as a serverless function on Netlify
"""

import json
import os
from datetime import datetime

# For LLM integration, you can use:
# - OpenAI API
# - Hugging Face Inference API
# - Anthropic Claude API
# - Or your own model

def handler(event, context):
    """
    Netlify serverless function handler
    """
    # Parse request
    if event.get('httpMethod') != 'POST':
        return {
            'statusCode': 405,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        user_message = body.get('message', '')
        conversation_history = body.get('conversation_history', [])
        
        # Generate response using AI/LLM
        # Option 1: Use Hugging Face FREE API (uncomment to use)
        # response = generate_hf_response(user_message, conversation_history)
        
        # Option 2: Simple rule-based (FREE - no API needed)
        response = generate_simple_response(user_message)
        
        # Option 3: Use OpenAI API (paid - uncomment if you have API key)
        # response = generate_openai_response(user_message, conversation_history)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'response': response,
                'timestamp': datetime.now().isoformat()
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


def generate_simple_response(user_message):
    """
    Simple rule-based response (replace with LLM API call)
    """
    message_lower = user_message.lower()
    
    # Resume context
    resume_info = {
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
    
    # Simple keyword matching (replace with LLM)
    if any(word in message_lower for word in ['hi', 'hello', 'hey']):
        return f"Hello! I'm {resume_info['name']}'s AI assistant. How can I help you learn more about his background and experience?"
    
    elif any(word in message_lower for word in ['skill', 'technology', 'tech']):
        return f"{resume_info['name']} specializes in {', '.join(resume_info['skills'][:5])} and more. He has expertise in Generative AI, RAG systems, LLM fine-tuning, and MLOps."
    
    elif any(word in message_lower for word in ['experience', 'work', 'job', 'role']):
        return f"{resume_info['name']} currently works as {resume_info['current_role']}. He has {resume_info['experience']} of experience building production AI systems."
    
    elif any(word in message_lower for word in ['contact', 'email', 'reach', 'connect']):
        return f"You can reach {resume_info['name']} at {resume_info['email']} or {resume_info['phone']}. You can also connect on LinkedIn!"
    
    elif any(word in message_lower for word in ['education', 'degree', 'university', 'college']):
        return f"{resume_info['name']} holds an {resume_info['education']} and a B.Tech degree. He has a strong academic foundation in AI/ML."
    
    elif any(word in message_lower for word in ['project', 'built', 'created', 'developed']):
        return f"{resume_info['name']} has built several production AI systems including RAG-based chatbots, large-scale ANPR systems, and vision-language validation systems. He specializes in end-to-end ML pipeline development."
    
    else:
        return f"Thanks for your question! {resume_info['name']} is an AI/ML Engineer specializing in Generative AI, NLP, and Computer Vision. Feel free to ask about his skills, experience, or projects. You can also contact him directly at {resume_info['email']}."


def generate_openai_response(user_message, conversation_history):
    """
    Example: Generate response using OpenAI API
    Requires: pip install openai
    Set environment variable: OPENAI_API_KEY
    """
    try:
        import openai
        
        # Get API key from environment
        openai.api_key = os.environ.get('OPENAI_API_KEY')
        
        # Build context from resume
        system_prompt = """You are an AI assistant representing SK Nasim Akhtar, an AI/ML Engineer specializing in Generative AI, NLP, and Computer Vision.

Key Information:
- Current Role: Assistant Manager - Generative AI Chatbot (RAG Platform) at Cube Highways
- Experience: 4+ years in AI/ML
- Education: M.Tech from IIT Kanpur, B.Tech
- Skills: Python, LLMs, RAG, LangChain, Deep Learning, NLP, OCR, Computer Vision, PyTorch, TensorFlow, Docker, MLOps
- Location: Noida, India
- Email: sknasimakhtar1997@gmail.com

Answer questions about Nasim's background, skills, experience, and projects. Be professional, concise, and helpful."""
        
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history
        for msg in conversation_history[-5:]:  # Last 5 messages
            role = "user" if msg.get('sender') == 'user' else "assistant"
            messages.append({"role": role, "content": msg.get('text', '')})
        
        # Add current message
        messages.append({"role": "user", "content": user_message})
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # or "gpt-4"
            messages=messages,
            max_tokens=200,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        return f"I apologize, but I'm having trouble processing your request. Please try again or contact Nasim directly."


def generate_hf_response(user_message, conversation_history):
    """
    Generate response using Hugging Face Inference API (FREE TIER)
    FREE: 1,000 requests/month
    Requires: pip install requests
    Set environment variable: HF_API_KEY
    Get free API key: https://huggingface.co/settings/tokens
    """
    try:
        import requests
        
        api_key = os.environ.get('HF_API_KEY')
        if not api_key:
            # Fallback to simple response if no API key
            return generate_simple_response(user_message)
        
        # Using a free, fast model
        api_url = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
        
        headers = {"Authorization": f"Bearer {api_key}"}
        
        # Build context with resume information
        context = """You are an AI assistant representing SK Nasim Akhtar, an AI/ML Engineer specializing in Generative AI, NLP, and Computer Vision.

Key Information:
- Current Role: Assistant Manager - Generative AI Chatbot (RAG Platform) at Cube Highways
- Experience: 4+ years in AI/ML
- Education: M.Tech from IIT Kanpur
- Skills: Python, LLMs, RAG, LangChain, Deep Learning, NLP, OCR, Computer Vision
- Location: Noida, India
- Email: sknasimakhtar1997@gmail.com

Answer questions about Nasim's background, skills, experience, and projects professionally and concisely."""
        
        prompt = f"{context}\n\nUser: {user_message}\nAssistant:"
        
        response = requests.post(
            api_url,
            headers=headers,
            json={"inputs": prompt},
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            generated_text = result.get('generated_text', '')
            # Extract assistant response
            if 'Assistant:' in generated_text:
                return generated_text.split('Assistant:')[-1].strip()
            return generated_text or generate_simple_response(user_message)
        elif response.status_code == 503:
            # Model is loading, use fallback
            return generate_simple_response(user_message)
        else:
            # Fallback to simple response
            return generate_simple_response(user_message)
    
    except Exception as e:
        # Always fallback to simple response on error
        return generate_simple_response(user_message)

