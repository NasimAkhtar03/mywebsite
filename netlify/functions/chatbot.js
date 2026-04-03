/**
 * Netlify Function (Node/JS) for chatbot responses.
 * Endpoint: /.netlify/functions/chatbot
 *
 * Note: This returns minimal info only.
 */

function json(statusCode, bodyObj) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
    body: JSON.stringify(bodyObj),
  };
}

function generateSimpleResponse(userMessage) {
  const msg = (userMessage || "").toLowerCase();

  const info = {
    name: "SK Nasim Akhtar",
    role: "AI/ML Engineer",
    location: "Noida, India",
    email: "sknasimakhtar1997@gmail.com",
    phone: "+91-8599849565",
    skills: "Python, LLMs, RAG, LangChain, Deep Learning, NLP, Computer Vision",
    currentRole: "Assistant Manager - Generative AI Chatbot (RAG Platform) at Cube Highways",
    experience: "4+ years",
    education: "M.Tech from IIT Kanpur",
    projects: [
      "Enterprise RAG chatbot platform for business workflows",
      "Document intelligence pipeline for extraction and summarization",
      "Computer vision automation systems for production use-cases",
    ],
  };

  if (["hi", "hello", "hey"].some((w) => msg.includes(w))) {
    return `Hello! I'm ${info.name}'s AI assistant. What would you like to know?`;
  }
  if (["skill", "technology", "tech", "expertise"].some((w) => msg.includes(w))) {
    return `${info.name} specializes in ${info.skills}.`;
  }
  if (["experience", "work", "job", "role", "current"].some((w) => msg.includes(w))) {
    return `${info.name} currently works as ${info.currentRole} and has ${info.experience} of experience.`;
  }
  if (["contact", "email", "reach", "connect", "phone"].some((w) => msg.includes(w))) {
    return `You can reach ${info.name} at ${info.email} or ${info.phone}.`;
  }
  if (["education", "degree", "university", "iit"].some((w) => msg.includes(w))) {
    return `${info.name} holds an ${info.education}.`;
  }
  if (["location", "where", "based"].some((w) => msg.includes(w))) {
    return `${info.name} is based in ${info.location}.`;
  }
  if (["project", "portfolio", "delivered", "built"].some((w) => msg.includes(w))) {
    return `${info.name}'s recent work includes: ${info.projects.join("; ")}.`;
  }
  if (["hire", "opportunity", "available", "open to"].some((w) => msg.includes(w))) {
    return `${info.name} is open to high-impact AI/ML opportunities. Reach out at ${info.email} or on LinkedIn: linkedin.com/in/sknasimakhtar`;
  }

  return `I can answer about ${info.name}'s skills, experience, projects, education, location, and contact. Try asking “What AI projects has Nasim delivered?”`;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return json(200, {});
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const message = body.message || "";
    const response = generateSimpleResponse(message);
    return json(200, { response, ts: new Date().toISOString() });
  } catch (e) {
    return json(500, { error: String(e && e.message ? e.message : e) });
  }
};


