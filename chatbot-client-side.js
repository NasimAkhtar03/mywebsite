// ChatGPT-style Top Interface Chatbot (Client-Side Only - FREE)
class Chatbot {
    constructor() {
        this.messages = [];
    }

    initializeTopInterface() {
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('chatbot-send');
        
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    attachEventListeners() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    addWelcomeMessage() {
        const welcomeText = "Hello! I'm Nasim's AI assistant. Ask me about his skills, experience, projects, or how to contact him.";
        this.addMessage('bot', welcomeText);
    }

    addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'chatbot-message-content';
        contentDiv.textContent = text;
        
        messageDiv.appendChild(contentDiv);
        this.messagesContainer.appendChild(messageDiv);
        
        // Auto-scroll to bottom
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

        this.addMessage('user', message);
        this.input.value = '';
        this.sendBtn.disabled = true;
        this.showTyping();

        // Simulate thinking delay
        setTimeout(() => {
            const response = this.generateLocalResponse(message);
            this.hideTyping();
            this.addMessage('bot', response);
            this.sendBtn.disabled = false;
            this.input.focus();
        }, 800);
    }

    generateLocalResponse(userMessage) {
        const messageLower = userMessage.toLowerCase();
        
        // Basic information (minimalistic)
        const info = {
            name: 'SK Nasim Akhtar',
            role: 'AI/ML Engineer',
            location: 'Noida, India',
            email: 'sknasimakhtar1997@gmail.com',
            phone: '+91-8599849565',
            skills: 'Python, LLMs, RAG, LangChain, Deep Learning, NLP, Computer Vision',
            currentRole: 'Assistant Manager - Generative AI Chatbot (RAG Platform) at Cube Highways',
            experience: '4+ years',
            education: 'M.Tech from IIT Kanpur'
        };

        // Question patterns and responses
        if (messageLower.includes('hi') || messageLower.includes('hello') || messageLower.includes('hey')) {
            return `Hello! I'm ${info.name}'s AI assistant. How can I help you learn more about his background, skills, or experience?`;
        }
        
        else if (messageLower.includes('skill') || messageLower.includes('technology') || messageLower.includes('tech') || messageLower.includes('expertise')) {
            return `${info.name} specializes in ${info.skills}. He has expertise in Generative AI, RAG systems, LLM fine-tuning, and MLOps.`;
        }
        
        else if (messageLower.includes('experience') || messageLower.includes('work') || messageLower.includes('job') || messageLower.includes('role') || messageLower.includes('current')) {
            return `${info.name} currently works as ${info.currentRole}. He has ${info.experience} of experience building production AI systems.`;
        }
        
        else if (messageLower.includes('contact') || messageLower.includes('email') || messageLower.includes('reach') || messageLower.includes('connect') || messageLower.includes('phone')) {
            return `You can reach ${info.name} at ${info.email} or ${info.phone}. Feel free to connect on LinkedIn!`;
        }
        
        else if (messageLower.includes('education') || messageLower.includes('degree') || messageLower.includes('university') || messageLower.includes('iit')) {
            return `${info.name} holds an ${info.education} and a B.Tech degree. He has a strong academic foundation in AI/ML.`;
        }
        
        else if (messageLower.includes('project') || messageLower.includes('built') || messageLower.includes('created')) {
            return `${info.name} has built production AI systems including RAG-based chatbots, large-scale ANPR systems, and vision-language models.`;
        }
        
        else if (messageLower.includes('location') || messageLower.includes('where') || messageLower.includes('based')) {
            return `${info.name} is based in ${info.location}.`;
        }
        
        else if (messageLower.includes('help') || messageLower.includes('what can')) {
            return `I can help you learn about ${info.name}'s skills, experience, projects, education, and contact information. What would you like to know?`;
        }
        
        else {
            return `Thanks for your question! ${info.name} is an AI/ML Engineer specializing in Generative AI, NLP, and Computer Vision. He has ${info.experience} of experience. Feel free to ask about his skills, experience, or how to contact him.`;
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new Chatbot();
    chatbot.initializeTopInterface();
});
