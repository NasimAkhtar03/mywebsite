// ChatGPT-style Top Interface Chatbot
// Tries Netlify Functions first; if unavailable, falls back to local (free) responses.
class Chatbot {
    constructor() {
        this.messages = [];
        // Netlify Functions endpoint (absolute path; folder moves do NOT change this)
        this.apiEndpoint = '/.netlify/functions/chatbot';
        this.fallbackApiEndpoint = '/chat';
        this.isOpen = false;
        // Alternative: external API
        // this.apiEndpoint = 'https://your-api-url.com/chat';
    }

    initializeTopInterface() {
        this.panel = document.getElementById('chatbot-panel');
        this.toggleBtn = document.getElementById('chatbot-toggle');
        this.closeBtn = document.getElementById('chatbot-close');
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('chatbot-send');
        if (!this.panel || !this.toggleBtn || !this.closeBtn || !this.messagesContainer || !this.input || !this.sendBtn) return;

        this.messagesContainer.setAttribute('aria-busy', 'false');
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    attachEventListeners() {
        this.toggleBtn.addEventListener('click', () => this.openChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });

        const suggestionChips = document.querySelectorAll('.suggestion-chip');
        suggestionChips.forEach((chip) => {
            chip.addEventListener('click', () => {
                const prompt = chip.getAttribute('data-prompt');
                if (!prompt) return;
                this.openChat();
                this.input.value = prompt;
                this.sendMessage();
            });
        });
    }

    openChat() {
        if (!this.panel || !this.input) return;
        this.panel.classList.add('open');
        this.panel.setAttribute('aria-hidden', 'false');
        this.isOpen = true;
        this.input.focus();
    }

    closeChat() {
        if (!this.panel) return;
        this.panel.classList.remove('open');
        this.panel.setAttribute('aria-hidden', 'true');
        this.isOpen = false;
    }

    askQuestion(question) {
        if (!question) return;
        this.openChat();
        this.input.value = question;
        this.sendMessage();
    }

    addWelcomeMessage() {
        this.addMessage('bot', "Hello! Ask me anything about Nasim's skills, experience, projects, or contact details.");
    }

    addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'chatbot-message-content';
        contentDiv.textContent = text;

        messageDiv.appendChild(contentDiv);
        this.messagesContainer.appendChild(messageDiv);

        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        this.messages.push({ sender, text, timestamp: new Date() });
    }

    showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot';
        typingDiv.id = 'typing-indicator';
        typingDiv.setAttribute('role', 'status');
        typingDiv.setAttribute('aria-label', 'Assistant is typing');

        const typingContent = document.createElement('div');
        typingContent.className = 'chatbot-typing';
        typingContent.innerHTML = `
            <div class="chatbot-typing-dot"></div>
            <div class="chatbot-typing-dot"></div>
            <div class="chatbot-typing-dot"></div>
        `;

        typingDiv.appendChild(typingContent);
        this.messagesContainer.appendChild(typingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) typingIndicator.remove();
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        this.addMessage('user', message);
        this.input.value = '';
        this.sendBtn.disabled = true;
        this.sendBtn.setAttribute('aria-disabled', 'true');
        this.messagesContainer.setAttribute('aria-busy', 'true');
        this.showTyping();

        try {
            const payload = JSON.stringify({
                message,
                conversation_history: this.messages.slice(-6)
            });
            let response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload
            });

            // Optional backend hook: if Netlify function is unavailable, try /chat.
            if (!response.ok) {
                response = await fetch(this.fallbackApiEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: payload
                });
            }

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            this.hideTyping();
            this.addMessage('bot', data.response || data.answer || 'Sorry, I could not generate a response.');
        } catch (error) {
            console.error('Chatbot API error:', error);
            this.hideTyping();
            // Fallback: local inference (always free)
            this.addMessage('bot', this.generateLocalResponse(message));
        } finally {
            this.sendBtn.disabled = false;
            this.sendBtn.setAttribute('aria-disabled', 'false');
            this.messagesContainer.setAttribute('aria-busy', 'false');
            this.input.focus();
        }
    }

    generateLocalResponse(userMessage) {
        const messageLower = userMessage.toLowerCase();

        // Minimal info only
        const info = {
            name: 'SK Nasim Akhtar',
            role: 'AI/ML Engineer',
            location: 'Noida, India',
            email: 'sknasimakhtar1997@gmail.com',
            phone: '+91-8599849565',
            skills: 'Python, LLMs, RAG, LangChain, Deep Learning, NLP, Computer Vision',
            currentRole: 'Assistant Manager - Generative AI Chatbot (RAG Platform) at Cube Highways',
            experience: '4+ years',
            education: 'M.Tech from IIT Kanpur',
            projects: [
                'Enterprise RAG chatbot platform for business workflows',
                'Document intelligence pipeline for extraction and summarization',
                'Computer vision automation systems for production use-cases'
            ]
        };

        if (messageLower.includes('hi') || messageLower.includes('hello') || messageLower.includes('hey')) {
            return `Hello! I'm ${info.name}'s AI assistant. What would you like to know?`;
        }

        if (messageLower.includes('skill') || messageLower.includes('technology') || messageLower.includes('tech') || messageLower.includes('expertise')) {
            return `${info.name} specializes in ${info.skills}.`;
        }

        if (messageLower.includes('experience') || messageLower.includes('work') || messageLower.includes('job') || messageLower.includes('role') || messageLower.includes('current')) {
            return `${info.name} currently works as ${info.currentRole} and has ${info.experience} of experience.`;
        }

        if (messageLower.includes('contact') || messageLower.includes('email') || messageLower.includes('reach') || messageLower.includes('connect') || messageLower.includes('phone')) {
            return `You can reach ${info.name} at ${info.email} or ${info.phone}.`;
        }

        if (messageLower.includes('education') || messageLower.includes('degree') || messageLower.includes('university') || messageLower.includes('iit')) {
            return `${info.name} holds an ${info.education}.`;
        }

        if (messageLower.includes('location') || messageLower.includes('where') || messageLower.includes('based')) {
            return `${info.name} is based in ${info.location}.`;
        }

        if (messageLower.includes('project') || messageLower.includes('portfolio') || messageLower.includes('delivered') || messageLower.includes('built')) {
            return `${info.name}'s recent work includes: ${info.projects.join('; ')}.`;
        }

        if (messageLower.includes('hire') || messageLower.includes('opportunity') || messageLower.includes('available') || messageLower.includes('open to')) {
            return `${info.name} is open to high-impact AI/ML opportunities. Reach out at ${info.email} or on LinkedIn: linkedin.com/in/sknasimakhtar`;
        }

        return `I can answer about ${info.name}'s skills, experience, projects, education, location, and contact. Try asking “What AI projects has Nasim delivered?”`;
    }
}

// Initialize when DOM is loaded (top interface)
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new Chatbot();
    chatbot.initializeTopInterface();
    window.portfolioChatbot = chatbot;
});

