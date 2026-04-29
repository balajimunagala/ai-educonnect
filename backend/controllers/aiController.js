const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

const generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;
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
    const cleaned = text.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(cleaned);
    res.json({ success: true, questions });
  } catch (error) {
    console.log('Quiz generation error:', error.message);
    res.status(500).json({ message: 'Failed to generate quiz', error: error.message });
  }
};

const chatWithTutor = async (req, res) => {
  try {
    const { message, courseTitle, chatHistory } = req.body;
    const history = chatHistory?.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })) || [];
    const chat = model.startChat({
      history,
      generationConfig: { maxOutputTokens: 300 }
    });
    const contextualMessage = `
      You are a friendly AI tutor helping a student with "${courseTitle || 'their studies'}".
      Keep answers short, clear and encouraging. Max 3 sentences.
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

const generateLearningPath = async (req, res) => {
  try {
    const { goal, currentLevel, availableHours } = req.body;
    const prompt = `
      You are an expert learning coach. Create a personalized learning path.
      Goal: ${goal}
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

const generateLearningPathChat = async (req, res) => {
  try {
    const { topic, type, chatHistory } = req.body;
    const history = chatHistory
      ?.filter(msg => msg.role === 'user' || msg.role === 'assistant')
      ?.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })) || [];
    const chat = model.startChat({ history });
    const prompt = `
      You are an expert learning coach and curriculum designer.
      The student wants to learn: "${topic}"
      Course type preference: ${type === 'free' ? 'FREE resources only (YouTube, free websites)' : 'PAID courses (Udemy, Coursera, etc.)'}
      Create a detailed, beginner-friendly learning path with clear phases.
      Return ONLY a valid JSON object, no markdown, no backticks:
      {
        "title": "Complete path title",
        "totalWeeks": number,
        "difficulty": "beginner/intermediate/advanced",
        "overview": "2 sentence overview of what they will learn",
        "phases": [
          {
            "phase": 1,
            "title": "Phase title",
            "duration": "1-2 weeks",
            "goal": "What student achieves in this phase",
            "topics": ["topic1", "topic2", "topic3"],
            "resources": [
              {
                "title": "Resource title",
                "channel": "Channel or platform name",
                "url": "https://youtube.com/watch?v=qz0aGYrrlhU",
                "type": "${type}",
                "platform": "YouTube",
                "duration": "X hours",
                "why": "One sentence why this is the best resource"
              }
            ]
          }
        ],
        "tips": ["tip1", "tip2", "tip3"],
        "totalResources": number
      }
      ${type === 'free'
        ? 'Use real YouTube channels like freeCodeCamp, Traversy Media, Fireship, Kevin Powell, Web Dev Simplified, Net Ninja. Give real YouTube URLs.'
        : 'Use real Udemy or Coursera courses. Give real course URLs.'}
    `;
    const result = await chat.sendMessage(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, '').trim();
    const learningPath = JSON.parse(cleaned);
    res.json({ success: true, learningPath });

  } catch (error) {
    console.log('Learning path error — using mock data:', error.message);
    const mockPath = {
      title: `Complete ${req.body.topic} Learning Path`,
      totalWeeks: 12,
      difficulty: "beginner",
      overview: `A complete beginner-friendly path to master ${req.body.topic} from scratch. You will go through structured phases with the best ${req.body.type} resources available.`,
      phases: [
        {
          phase: 1,
          title: "The Foundations",
          duration: "2 weeks",
          goal: `Understand the basics of ${req.body.topic} and set up your environment`,
          topics: ["Introduction & Setup", "Core Concepts", "Basic Syntax", "First Project"],
          resources: [
            {
              title: `${req.body.topic} Full Course for Beginners`,
              channel: "freeCodeCamp.org",
              url: "https://www.youtube.com/watch?v=zJSY8tbf_ys",
              type: req.body.type,
              platform: "YouTube",
              duration: "4 hours",
              why: "Most comprehensive free beginner course with hands-on projects"
            },
            {
              title: `${req.body.topic} Crash Course`,
              channel: "Traversy Media",
              url: "https://www.youtube.com/watch?v=qz0aGYrrlhU",
              type: req.body.type,
              platform: "YouTube",
              duration: "1.5 hours",
              why: "Perfect quick overview to understand the big picture first"
            }
          ]
        },
        {
          phase: 2,
          title: "Core Skills",
          duration: "3 weeks",
          goal: "Build real confidence by mastering the core skills",
          topics: ["Intermediate Concepts", "Best Practices", "Common Patterns", "Mini Projects"],
          resources: [
            {
              title: `${req.body.topic} Tutorial Full Playlist`,
              channel: "The Net Ninja",
              url: "https://www.youtube.com/c/TheNetNinja",
              type: req.body.type,
              platform: "YouTube",
              duration: "6 hours",
              why: "Best structured playlist that builds concepts step by step"
            },
            {
              title: `${req.body.topic} Projects for Beginners`,
              channel: "Web Dev Simplified",
              url: "https://www.youtube.com/c/WebDevSimplified",
              type: req.body.type,
              platform: "YouTube",
              duration: "3 hours",
              why: "Learn by building real projects the fastest way to improve"
            }
          ]
        },
        {
          phase: 3,
          title: "Advanced Concepts",
          duration: "3 weeks",
          goal: "Master advanced topics and build professional-level projects",
          topics: ["Advanced Patterns", "Performance", "Testing", "Real World Projects"],
          resources: [
            {
              title: `Advanced ${req.body.topic} Concepts`,
              channel: "Fireship",
              url: "https://www.youtube.com/c/Fireship",
              type: req.body.type,
              platform: "YouTube",
              duration: "2 hours",
              why: "Fast-paced and modern covers exactly what professionals use"
            }
          ]
        },
        {
          phase: 4,
          title: "Build and Deploy Projects",
          duration: "4 weeks",
          goal: "Build 3 portfolio-worthy projects and deploy them live",
          topics: ["Project Planning", "Building", "Deployment", "Portfolio"],
          resources: [
            {
              title: `Build and Deploy ${req.body.topic} Projects`,
              channel: "JavaScript Mastery",
              url: "https://www.youtube.com/c/JavaScriptMastery",
              type: req.body.type,
              platform: "YouTube",
              duration: "8 hours",
              why: "Best channel for building real impressive portfolio projects"
            }
          ]
        }
      ],
      tips: [
        "Code every single day even 30 minutes is better than nothing",
        "Do not just watch tutorials pause and build along with the instructor",
        "After each phase build a small project from scratch without following any tutorial",
        "Join communities like Discord servers or Reddit to ask questions",
        "Track your progress it keeps you motivated when things get hard"
      ],
      totalResources: 6
    };
    res.json({ success: true, learningPath: mockPath });
  }
};

const learningPathFollowup = async (req, res) => {
  try {
    const { message, chatHistory, currentPath } = req.body;
    const history = chatHistory
      ?.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })) || [];
    const chat = model.startChat({ history });
    const prompt = `
      Student follow-up: "${message}"
      Current path: ${JSON.stringify(currentPath)}
      Modify and return the COMPLETE updated path in the exact same JSON format. No markdown, no backticks.
    `;
    const result = await chat.sendMessage(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, '').trim();
    const updatedPath = JSON.parse(cleaned);
    res.json({ success: true, learningPath: updatedPath });
  } catch (error) {
    console.log('Followup error — using modified mock:', error.message);
    const currentPath = req.body.currentPath;
    const message = req.body.message.toLowerCase();
    let updatedPath = { ...currentPath };
    if (message.includes('short') || message.includes('4 week')) {
      updatedPath.totalWeeks = 4;
      updatedPath.phases = currentPath.phases?.slice(0, 2);
      updatedPath.overview = `Shortened version: ${currentPath.overview}`;
    } else if (message.includes('advanced')) {
      updatedPath.difficulty = 'advanced';
      updatedPath.overview = `Advanced version: ${currentPath.overview}`;
    } else if (message.includes('1 hour')) {
      updatedPath.totalWeeks = currentPath.totalWeeks + 4;
      updatedPath.overview = `Adjusted for 1 hour/day: ${currentPath.overview}`;
    }
    res.json({ success: true, learningPath: updatedPath });
  }
};

const saveLearningPath = async (req, res) => {
  try {
    const { currentPath } = req.body;
    let finalPath = currentPath;

    try {
      const prompt = `
        Create ONE final clean structured learning path based on:
        Current path: ${JSON.stringify(currentPath)}
        Return ONLY valid JSON in same format. No markdown, no backticks.
      `;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json|```/g, '').trim();
      finalPath = JSON.parse(cleaned);
    } catch (aiError) {
      console.log('AI refine failed — saving current path as is');
      finalPath = currentPath;
    }

    const Course = require('../models/Course');
    const User = require('../models/User');

    const modules = finalPath.phases?.map((phase, i) => ({
      title: `Phase ${phase.phase}: ${phase.title}`,
      content: `Goal: ${phase.goal}\n\nTopics: ${phase.topics?.join(', ')}\n\nDuration: ${phase.duration}\n\nResources:\n${
        phase.resources?.map(r => `- ${r.title} by ${r.channel}\n  Link: ${r.url}\n  Why: ${r.why}`).join('\n\n')
      }`,
      order: i + 1
    })) || [];

    const course = await Course.create({
      title: finalPath.title,
      description: finalPath.overview || `AI-generated learning path for ${finalPath.title}`,
      teacher: req.user._id,
      category: 'AI Generated',
      difficulty: finalPath.difficulty || 'beginner',
      modules,
      isPublished: true,
      enrolledStudents: [req.user._id]
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { enrolledCourses: course._id }
    });

    res.json({ success: true, course, finalPath });
  } catch (error) {
    console.log('Save path error:', error.message);
    res.status(500).json({ message: 'Failed to save path', error: error.message });
  }
};

module.exports = {
  generateQuiz,
  chatWithTutor,
  generateLearningPath,
  explainConcept,
  generateLearningPathChat,
  learningPathFollowup,
  saveLearningPath
};