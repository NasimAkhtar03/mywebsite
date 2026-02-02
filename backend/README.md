# Flask Backend for Chatbot

Alternative Python backend if you prefer not to use Netlify Functions.

## Deploy to Render (Free)

1. Push code to GitHub
2. Go to https://render.com
3. New → Web Service
4. Connect GitHub repo
5. Build command: `pip install -r requirements.txt`
6. Start command: `python app.py`
7. Get your API URL

## Deploy to Railway (Free)

1. Push code to GitHub
2. Go to https://railway.app
3. New Project → Deploy from GitHub
4. Select repo
5. Railway auto-detects Python
6. Get your API URL

## Update Frontend

In `chatbot.js`, update:
```javascript
this.apiEndpoint = 'https://your-api-url.com/chat';
```

## Environment Variables

Set these in your hosting platform:
- `OPENAI_API_KEY` (if using OpenAI)
- `HF_API_KEY` (if using Hugging Face)

