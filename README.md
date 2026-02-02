# Deployment Folder

This folder contains the full website, including a **ChatGPT-style top chat interface**.

## Files Included

- ✅ `index.html` - Minimal website + top chat UI
- ✅ `chatbot.js` - Chat (uses Netlify function if available, otherwise local fallback)
- ✅ `chatbot.css` - Chat UI styling
- ✅ `styles.css` - Minimal styling
- ✅ `netlify.toml` - Netlify configuration (includes functions directory)
- ✅ `netlify/functions/chatbot.js` - Netlify Function (JS) backend for chat (optional)
- ✅ `backend/` - Flask backend example (optional; separate hosting)

## How to Deploy

### Method 1: Drag & Drop (Easiest)

1. Go to [netlify.com](https://www.netlify.com) and sign up/login
2. In the Netlify dashboard, find the drag & drop area
3. **Drag this entire `website` folder** into Netlify
4. Wait 10-30 seconds
5. ✅ Your site is live!

**Note:** Drag & drop deploys the static site. The chat will still work because `chatbot.js` has a local fallback.

### Method 2: Git Integration

1. Push this folder to GitHub
2. Connect GitHub repository to Netlify
3. Netlify will automatically deploy on every push

**Tip:** If you want the Netlify Function backend (`netlify/functions/chatbot.js`) to run, use Git integration or Netlify CLI.

## What's NOT Included

This folder intentionally excludes:
- ❌ Documentation files (.md files)
- ❌ Example websites
- ❌ Local server files
- ❌ Other guides and setup files

This keeps your deployment clean and minimal!

## Next Steps

After deploying, add your custom domain `mynasim.in`:
1. In Netlify: Domain settings → Add custom domain
2. Configure DNS at Hostinger
3. Wait for DNS propagation (24-48 hours)

See `../netlify-deployment-guide.md` for detailed instructions.

