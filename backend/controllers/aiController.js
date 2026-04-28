const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });// Generates quiz questions using Gemini AI
// -----------------------------------------------
const generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;

    // This is the instruction we send to Gemini
    const prompt = `
      You are an expert educator. Generate ${count || 5} multiple choice questions about "${topic}" 
      at ${difficulty || 'easy'} difficulty level.
      
      Return ONLY a valid JSON array with no extra text, no markdown, no backticks.
      Each object must have exactly these fields:
      {
        "question": "the question text",
        "options": ["option A", "option B", "option C", "option D"],
        "answer": "the correct option exactly as written in options",
        "explanation": "why this answer is correct"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean the response and parse JSON
    const cleaned = text.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(cleaned);

    res.json({ success: true, questions });
  } catch (error) {
    console.log('Quiz generation error:', error.message);
    res.status(500).json({ message: 'Failed to generate quiz', error: error.message });
  }
};

// -----------------------------------------------
// @POST /api/ai/chat
// AI Tutor chatbot - answers student questions
// -----------------------------------------------
const chatWithTutor = async (req, res) => {
  try {
    const { message, courseTitle, chatHistory } = req.body;

    // Build conversation history for Gemini
    const history = chatHistory?.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })) || [];

    // Start a chat session with history
    const chat = model.startChat({
      history,
      generationConfig: { maxOutputTokens: 500 }
    });

    // System context so Gemini knows its role
    const contextualMessage = `
      You are an AI tutor helping a student learn about "${courseTitle || 'this course'}".
      Answer clearly and simply. If the question is not related to the course, 
      politely redirect them back to the topic.
      
      Student question: ${message}
    `;

    const result = await chat.sendMessage(contextualMessage);
    const reply = result.response.text();

    res.json({ success: true, reply });
  } catch (error) {
    console.log('Chat error:', error.message);
    res.status(500).json({ message: 'AI tutor failed', error: error.message });
  }
};

// -----------------------------------------------
// @POST /api/ai/learning-path
// Suggests a personalized learning path
// -----------------------------------------------
const generateLearningPath = async (req, res) => {
  try {
    const { goal, currentLevel, availableHours } = req.body;

    const prompt = `
      You are an expert learning coach. Create a personalized learning path for a student.
      
      Their goal: ${goal}
      Current level: ${currentLevel || 'beginner'}
      Hours available per week: ${availableHours || 5}
      
      Return ONLY a valid JSON object with no extra text, no markdown, no backticks:
      {
        "title": "Learning path title",
        "totalWeeks": number,
        "weeklyPlan": [
          {
            "week": 1,
            "topic": "topic name",
            "tasks": ["task 1", "task 2", "task 3"],
            "goal": "what student will achieve this week"
          }
        ],
        "tips": ["tip 1", "tip 2", "tip 3"]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, '').trim();
    const learningPath = JSON.parse(cleaned);

    res.json({ success: true, learningPath });
  } catch (error) {
    console.log('Learning path error:', error.message);
    res.status(500).json({ message: 'Failed to generate learning path', error: error.message });
  }
};

// -----------------------------------------------
// @POST /api/ai/explain
// Explains a concept in simple words
// -----------------------------------------------
const explainConcept = async (req, res) => {
  try {
    const { concept, level } = req.body;

    const prompt = `
      Explain "${concept}" in simple, easy to understand language 
      for a ${level || 'beginner'} student.
      Keep it under 150 words.
      Use a real life example to make it clear.
      Do not use markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text();

    res.json({ success: true, explanation });
  } catch (error) {
    console.log('Explain error:', error.message);
    res.status(500).json({ message: 'Failed to explain concept', error: error.message });
  }
};

module.exports = { generateQuiz, chatWithTutor, generateLearningPath, explainConcept };