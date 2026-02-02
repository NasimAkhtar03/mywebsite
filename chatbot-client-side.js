// Client-Side Only Chatbot (No Backend Needed)
// Replace chatbot.js with this file for 100% client-side solution

class Chatbot {
    constructor() {
        this.messages = [];
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
        
        // Resume information
        const info = {
            name: 'SK Nasim Akhtar',
            role: 'AI/ML Engineer',
            location: 'Noida, India',
            email: 'sknasimakhtar1997@gmail.com',
            phone: '+91-8599849565',
            skills: ['Python', 'LLMs', 'RAG', 'LangChain', 'Deep Learning', 'NLP', 'OCR', 'Computer Vision', 'PyTorch', 'TensorFlow', 'Docker', 'MLOps'],
            currentRole: 'Assistant Manager - Generative AI Chatbot (RAG Platform) at Cube Highways',
            experience: '4+ years',
            education: 'M.Tech from IIT Kanpur',
            projects: ['RAG-based Q&A assistant', 'Large-scale ANPR system', 'Vision-language validation system']
        };

        // Question patterns and responses
        if (messageLower.includes('hi') || messageLower.includes('hello') || messageLower.includes('hey')) {
            return `Hello! I'm ${info.name}'s AI assistant. How can I help you learn more about his background, skills, or experience?`;
        }
        
        else if (messageLower.includes('skill') || messageLower.includes('technology') || messageLower.includes('tech') || messageLower.includes('expertise')) {
            return `${info.name} specializes in ${info.skills.slice(0, 5).join(', ')} and more. He has extensive expertise in Generative AI, RAG systems, LLM fine-tuning, Computer Vision, and MLOps.`;
        }
        
        else if (messageLower.includes('experience') || messageLower.includes('work') || messageLower.includes('job') || messageLower.includes('role') || messageLower.includes('current')) {
            return `${info.name} currently works as ${info.currentRole}. He has ${info.experience} of experience building production-scale AI systems, including RAG chatbots, ANPR systems, and vision-language models.`;
        }
        
        else if (messageLower.includes('contact') || messageLower.includes('email') || messageLower.includes('reach') || messageLower.includes('connect') || messageLower.includes('phone')) {
            return `You can reach ${info.name} at ${info.email} or ${info.phone}. Feel free to connect on LinkedIn for professional inquiries!`;
        }
        
        else if (messageLower.includes('education') || messageLower.includes('degree') || messageLower.includes('university') || messageLower.includes('college') || messageLower.includes('iit')) {
            return `${info.name} holds an ${info.education} and a B.Tech degree. He has a strong academic foundation in AI/ML and continues to work on cutting-edge projects.`;
        }
        
        else if (messageLower.includes('project') || messageLower.includes('built') || messageLower.includes('created') || messageLower.includes('developed') || messageLower.includes('work on')) {
            return `${info.name} has built several production AI systems including: ${info.projects.join(', ')}. He specializes in end-to-end ML pipeline development and deployment.`;
        }
        
        else if (messageLower.includes('rag') || messageLower.includes('llm') || messageLower.includes('generative ai') || messageLower.includes('chatbot')) {
            return `${info.name} has extensive experience with RAG systems and LLMs. He built a domain-specific RAG-based Q&A assistant for highway engineering codes, deploying optimized LLaMA-2-7B with ~80% lower inference latency.`;
        }
        
        else if (messageLower.includes('computer vision') || messageLower.includes('cv') || messageLower.includes('ocr') || messageLower.includes('anpr')) {
            return `${info.name} has worked extensively on computer vision projects, including large-scale ANPR systems deployed across 45 plazas and vision-language validation systems using Hugging Face models.`;
        }
        
        else if (messageLower.includes('location') || messageLower.includes('where') || messageLower.includes('based')) {
            return `${info.name} is based in ${info.location}.`;
        }
        
        else if (messageLower.includes('help') || messageLower.includes('what can') || messageLower.includes('tell me')) {
            return `I can help you learn about ${info.name}'s skills, experience, projects, education, and how to contact him. What would you like to know?`;
        }
        
        else {
            return `Thanks for your question! ${info.name} is an AI/ML Engineer specializing in Generative AI, NLP, and Computer Vision. He has ${info.experience} of experience building production AI systems. Feel free to ask about his skills, experience, projects, or how to contact him.`;
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});

