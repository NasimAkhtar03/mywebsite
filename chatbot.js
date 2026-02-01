// Chatbot JavaScript
class Chatbot {
    constructor() {
        this.messages = [];
        this.apiEndpoint = '/.netlify/functions/chatbot'; // Netlify Functions endpoint
        // Alternative: Use external API
        // this.apiEndpoint = 'https://your-api-url.com/chat';
        
        this.initializeElements();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    initializeElements() {
        this.toggleBtn = document.getElementById('chatbot-toggle');
        this.window = document.getElementById('chatbot-window');
        this.closeBtn = document.getElementById('chatbot-close');
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('chatbot-send');
    }

    attachEventListeners() {
        this.toggleBtn.addEventListener('click', () => this.toggleChatbot());
        this.closeBtn.addEventListener('click', () => this.toggleChatbot());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    toggleChatbot() {
        this.window.classList.toggle('active');
        this.toggleBtn.classList.toggle('hidden');
        if (this.window.classList.contains('active')) {
            this.input.focus();
        }
    }

    addWelcomeMessage() {
        const welcomeText = "Hi! I'm Nasim's AI assistant. Ask me anything about his background, skills, or experience!";
        this.addMessage('bot', welcomeText);
    }

    addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'chatbot-message-content';
        contentDiv.textContent = text;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'chatbot-message-time';
        timeDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        this.messagesContainer.appendChild(messageDiv);
        
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        this.messages.push({ sender, text, timestamp: new Date() });
    }

    showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot';
        typingDiv.id = 'typing-indicator';
        
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
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage('user', message);
        this.input.value = '';
        this.sendBtn.disabled = true;

        // Show typing indicator
        this.showTyping();

        try {
            // Call backend API
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversation_history: this.messages.slice(-5) // Last 5 messages for context
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            this.hideTyping();
            this.addMessage('bot', data.response || data.answer || 'Sorry, I encountered an error.');
        } catch (error) {
            console.error('Error:', error);
            this.hideTyping();
            // Fallback response if API fails
            this.addMessage('bot', 'I apologize, but I\'m having trouble connecting right now. Please try again later or contact Nasim directly at sknasimakhtar1997@gmail.com');
        } finally {
            this.sendBtn.disabled = false;
            this.input.focus();
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});

