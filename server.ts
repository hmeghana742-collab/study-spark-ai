import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory cache for sub-millisecond instant responses on repeated topics
const memoryCache = new Map<string, any>();
const CACHE_LIMIT = 100;

const getCacheKey = (prefix: string, ...args: string[]) => {
  return `${prefix}:${args.map((a) => (a || '').trim().toLowerCase()).join('|')}`;
};

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const getLevelDescription = (level: string): string => {
  switch (level) {
    case 'eli5':
      return "Explain Like I'm 10: extremely simple vocabulary, fun imagery, everyday toys/family/animals analogies, no technical jargon.";
    case 'middle_school':
      return 'Middle School (ages 11-14): engaging, relatable, curious tone with intuitive science/life connections.';
    case 'high_school':
      return 'High School (ages 15-18): clear conceptual clarity, exam-ready explanations, balance of intuition and formal terms.';
    case 'college':
      return 'College / Undergrad: intellectually thorough, addresses nuances, underlying mechanisms, and real-world domain applications.';
    case 'curious_adult':
      return 'Curious Adult / Professional: practical, first-principles logic, zero fluff, real-world utility and industry relevance.';
    default:
      return 'Adaptive, clear, and beginner-friendly.';
  }
};

const getStyleDescription = (style: string): string => {
  switch (style) {
    case 'analogy':
      return 'Focus heavily on vivid, clever real-world analogies (e.g. comparing algorithms to cooking recipes, quantum states to spinning coins).';
    case 'step_by_step':
      return 'Deconstruct into numbered sequential stages, emphasizing logical flow from cause to effect.';
    case 'story':
      return 'Frame the core ideas inside an illustrative narrative or historical journey where characters solve a problem.';
    case 'socratic':
      return 'Guide the student with thoughtful rhetorical questions, guided discovery, and mental checkpoints.';
    case 'cheat_sheet':
      return 'Crisp summaries, bullet points, rule-of-thumb heuristics, and quick-reference mental models.';
    default:
      return 'Balanced explanations with analogies and clear examples.';
  }
};

// POST /api/learn - Core personalized learning generator (optimized for all students, professors, and researchers)
app.post('/api/learn', async (req: Request, res: Response) => {
  try {
    const {
      topic,
      userRole = 'student',
      learnerLevel = 'high_school',
      learningStyle = 'analogy',
      userBackground = '',
      language = 'English',
    } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'Please provide a valid topic or question.' });
    }

    const cacheKey = getCacheKey('learn', topic, userRole, learnerLevel, learningStyle, userBackground, language);
    if (memoryCache.has(cacheKey)) {
      return res.json({
        success: true,
        data: memoryCache.get(cacheKey),
        cached: true,
      });
    }

    const ai = getAiClient();

    const systemInstruction = `You are StudySpark AI, an elite universal educational platform serving ALL types of learners: K-12 students, college undergraduates, PhD researchers, and university professors/educators.
User Role: ${userRole.toUpperCase()} (Adjust language, rigor, and pedagogical tools accordingly)
Target Level: ${learnerLevel} (${getLevelDescription(learnerLevel)})
Learning Modality: ${learningStyle} (${getStyleDescription(learningStyle)})
Language: ${language} (CRITICAL: Output all titles, explanations, stories, flashcards, and questions fluently in ${language})
${userBackground ? `User Background & Interests: ${userBackground}` : ''}

Key Guidelines:
1. directSolution: Provide the direct final answer or core principle immediately.
2. oneLiner: Punchy 1-sentence essence.
3. bigPicture: Lucid, comprehensive explanation balancing intuition and theoretical accuracy.
4. analogy: A memorable everyday metaphor making the concept click.
5. keySteps: 3-5 numbered sequential derivation/mechanism steps.
6. realWorldExamples: 2-3 genuine applications in industry, nature, or technology.
7. commonMistakes: 2 common misconceptions and why people fall for them.
8. cheatSheet: Core formulas, rules of thumb, and essential terminology.
9. flashcards: 4 high-yield active recall flashcards.
10. quiz: EXACTLY 5 multiple-choice questions. Each question must test a distinct sub-concept of the topic and provide a conceptTag indicating the specific tested principle (e.g. "Nyquist Criterion", "Aliasing Effect", "Reconstruction Filter").
11. educatorKit: FOR PROFESSORS & TEACHERS: 4 learning objectives (Bloom's taxonomy), 45-min lecture outline with timeline, 2 Socratic discussion prompts, 1 in-class group activity, and a 3-criteria grading rubric.
12. scholarDepth: FOR RESEARCHERS & ADVANCED SCHOLARS: formal theoretical framework, mathematical derivation, and 3 open research frontiers.`;

    const prompt = `Solve and thoroughly explain this question or topic for the student: "${topic.trim()}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            oneLiner: { type: Type.STRING },
            directSolution: {
              type: Type.STRING,
              description: 'The direct final answer or solution to the user’s question or equation.',
            },
            questionType: {
              type: Type.STRING,
              description: 'Type of question: concept, problem_solving, math, code, how_to, or general.',
            },
            bigPicture: { type: Type.STRING },
            analogy: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                story: { type: Type.STRING },
                keyTakeaway: { type: Type.STRING },
              },
              required: ['title', 'story', 'keyTakeaway'],
            },
            keySteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  keyInsight: { type: Type.STRING },
                },
                required: ['stepNumber', 'title', 'explanation', 'keyInsight'],
              },
            },
            realWorldExamples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  scenario: { type: Type.STRING },
                  application: { type: Type.STRING },
                },
                required: ['title', 'scenario', 'application'],
              },
            },
            commonMistakes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  myth: { type: Type.STRING },
                  reality: { type: Type.STRING },
                  whyItConfusesPeople: { type: Type.STRING },
                },
                required: ['myth', 'reality', 'whyItConfusesPeople'],
              },
            },
            cheatSheet: {
              type: Type.OBJECT,
              properties: {
                keyTerms: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      term: { type: Type.STRING },
                      definition: { type: Type.STRING },
                    },
                    required: ['term', 'definition'],
                  },
                },
                formulaOrRule: { type: Type.STRING },
                goldenRule: { type: Type.STRING },
              },
              required: ['keyTerms', 'goldenRule'],
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ['front', 'back', 'category'],
              },
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  conceptTag: {
                    type: Type.STRING,
                    description: 'Specific sub-concept tested by this question (e.g. Nyquist Rate, Aliasing, Sinc Filter)',
                  },
                },
                required: ['question', 'options', 'correctIndex', 'explanation', 'conceptTag'],
              },
            },
            suggestedFollowUps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            educatorKit: {
              type: Type.OBJECT,
              properties: {
                learningObjectives: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                lectureOutline: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      timeMinutes: { type: Type.STRING },
                      activity: { type: Type.STRING },
                      keyPoints: { type: Type.STRING },
                    },
                    required: ['timeMinutes', 'activity', 'keyPoints'],
                  },
                },
                discussionPrompts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      targetInsight: { type: Type.STRING },
                    },
                    required: ['question', 'targetInsight'],
                  },
                },
                classroomActivity: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    instructions: { type: Type.STRING },
                    deliverable: { type: Type.STRING },
                  },
                  required: ['title', 'instructions', 'deliverable'],
                },
                examRubric: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      criteria: { type: Type.STRING },
                      points: { type: Type.STRING },
                      guidance: { type: Type.STRING },
                    },
                    required: ['criteria', 'points', 'guidance'],
                  },
                },
              },
            },
            scholarDepth: {
              type: Type.OBJECT,
              properties: {
                formalDerivation: { type: Type.STRING },
                theoreticalFramework: { type: Type.STRING },
                researchFrontiers: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
            },
          },
          required: [
            'title',
            'oneLiner',
            'directSolution',
            'bigPicture',
            'analogy',
            'keySteps',
            'realWorldExamples',
            'commonMistakes',
            'cheatSheet',
            'flashcards',
            'quiz',
            'suggestedFollowUps',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      return res.status(502).json({ error: 'Did not receive valid explanation from Gemini.' });
    }

    const parsed = JSON.parse(text);
    const resultData = {
      ...parsed,
      topic,
      userRole,
      learnerLevel,
      learningStyle,
      createdAt: new Date().toISOString(),
    };

    // Store in cache
    if (memoryCache.size >= CACHE_LIMIT) {
      const firstKey = memoryCache.keys().next().value;
      if (firstKey) memoryCache.delete(firstKey);
    }
    memoryCache.set(cacheKey, resultData);

    return res.json({
      success: true,
      data: resultData,
    });
  } catch (error: any) {
    console.error('Error generating learning breakdown:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate explanation. Please try again.',
    });
  }
});

// POST /api/follow-up - Ask a follow-up question (optimized for fast response)
app.post('/api/follow-up', async (req: Request, res: Response) => {
  try {
    const { topic, question, learnerLevel = 'high_school', learningStyle = 'analogy', context = '' } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const cacheKey = getCacheKey('followup', topic, question, learnerLevel);
    if (memoryCache.has(cacheKey)) {
      return res.json({ success: true, answer: memoryCache.get(cacheKey), cached: true });
    }

    const ai = getAiClient();

    const systemInstruction = `You are StudySpark AI, an interactive educational tutor.
The student is learning about: "${topic}". Level: ${learnerLevel}. Style: ${learningStyle}.
Context: ${context.substring(0, 1000)}

Guidelines:
1. Answer directly and concisely (under 3-4 sentences).
2. Include a vivid micro-analogy or quick example.
3. Be friendly and supportive.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.6,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const answer = response.text || 'I could not generate an answer right now.';
    memoryCache.set(cacheKey, answer);
    return res.json({ success: true, answer });
  } catch (error: any) {
    console.error('Error in follow-up API:', error);
    return res.status(500).json({ error: error?.message || 'Failed to process follow-up question.' });
  }
});

// POST /api/simplify-further - Quick request to simplify or provide a new analogy
app.post('/api/simplify-further', async (req: Request, res: Response) => {
  try {
    const { topic, type = 'simpler_analogy' } = req.body;

    const ai = getAiClient();
    const prompt =
      type === 'simpler_analogy'
        ? `Give me a fresh, completely different, ultra-simple everyday analogy for "${topic}" that a 10-year-old would immediately smile and understand. Include: 1) What is the everyday object or situation, 2) How it matches the topic, 3) The "aha!" moment.`
        : `Explain "${topic}" in just 3 bullet points using the simplest words possible, with zero technical jargon.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are StudySpark AI. Provide brief, wonderfully intuitive insights.',
        temperature: 0.8,
      },
    });

    return res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error('Error simplifying topic:', error);
    return res.status(500).json({ error: error?.message || 'Failed to simplify.' });
  }
});

// POST /api/tts - High-fidelity AI speech synthesis with gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Kore' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS.' });
    }

    const ai = getAiClient();
    // Trim to 1000 chars per clip for latency and speed
    const cleanText = text.replace(/[*_#`]/g, '').trim().slice(0, 1200);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Warm, clear, and encouraging educational tutor speaking directly to a student',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName as 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio generated.' });
    }

    return res.json({ success: true, audioBase64: base64Audio });
  } catch (error: any) {
    console.error('Error in TTS endpoint:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate speech.' });
  }
});

// POST /api/generate-quiz - Dedicated 5-question MCQ generator with concept tags
app.post('/api/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { topic, learnerLevel = 'college', language = 'English', focusConcept = '' } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'Please provide a valid topic.' });
    }

    const cacheKey = getCacheKey('quiz', topic, learnerLevel, language, focusConcept);
    if (memoryCache.has(cacheKey)) {
      return res.json({ success: true, questions: memoryCache.get(cacheKey), cached: true });
    }

    const ai = getAiClient();
    const systemInstruction = `You are StudySpark AI Assessment Engine.
Generate EXACTLY 5 high-quality, conceptually sound multiple-choice questions for:
Topic: "${topic}"
Level: ${learnerLevel}
Language: ${language}
${focusConcept ? `Special Focus / Weak Concept: "${focusConcept}"` : ''}

Rules:
1. Each question must test a distinct, meaningful sub-concept.
2. Provide 4 plausible options with exactly ONE unambiguously correct answer.
3. Include an insightful, educational explanation clarifying why the correct answer is right and why distractors fail.
4. Include a concise 'conceptTag' categorizing the tested sub-concept (e.g., "Nyquist Rate", "Aliasing", "Reconstruction Filter").`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Create a 5-question diagnostic multiple choice quiz on "${topic}".`,
      config: {
        systemInstruction,
        temperature: 0.5,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              conceptTag: { type: Type.STRING },
            },
            required: ['question', 'options', 'correctIndex', 'explanation', 'conceptTag'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    memoryCache.set(cacheKey, parsed);
    return res.json({ success: true, questions: parsed });
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate quiz questions.' });
  }
});

// POST /api/adaptive-recommendations - Analyzes actual quiz performance to recommend revision topics & practice
app.post('/api/adaptive-recommendations', async (req: Request, res: Response) => {
  try {
    const {
      topic,
      score,
      total,
      weakConcepts = [],
      learnerLevel = 'college',
      language = 'English',
    } = req.body;

    const cacheKey = getCacheKey('adaptive', topic, String(score), String(total), JSON.stringify(weakConcepts), language);
    if (memoryCache.has(cacheKey)) {
      return res.json({ success: true, recommendations: memoryCache.get(cacheKey), cached: true });
    }

    const ai = getAiClient();
    const missedConceptNames = (weakConcepts as Array<{ concept?: string }>).map((w) => w.concept || '').filter(Boolean);

    const systemInstruction = `You are StudySpark AI Adaptive Learning Engine.
A student scored ${score}/${total} on the topic "${topic}".
Identified weak / missed concepts: ${missedConceptNames.length > 0 ? missedConceptNames.join(', ') : 'None - near perfect mastery'}.
Level: ${learnerLevel}.
Language: ${language}.

Your task:
1. Provide 2-3 targeted, prioritized revision topics with clear pedagogic reasoning explaining WHY each was recommended based on what they missed.
2. Provide a 1-question targeted follow-up practice challenge specifically to verify if they have mastered the weakest concept.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Analyze the student's performance on "${topic}" and generate targeted adaptive recommendations.`,
      config: {
        systemInstruction,
        temperature: 0.5,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallAssessment: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  reason: {
                    type: Type.STRING,
                    description: 'Explicit explanation of why this recommendation was triggered (e.g. "Because you missed Question 2 on Aliasing...")',
                  },
                  missedConcept: { type: Type.STRING },
                  difficulty: {
                    type: Type.STRING,
                    description: 'Review, Targeted Practice, or Mastery Challenge',
                  },
                  priority: { type: Type.STRING, description: 'high, medium, or low' },
                  actionPrompt: { type: Type.STRING },
                },
                required: ['id', 'topic', 'reason', 'missedConcept', 'difficulty', 'priority', 'actionPrompt'],
              },
            },
            followUpPracticeQuestion: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                conceptTag: { type: Type.STRING },
              },
              required: ['question', 'options', 'correctIndex', 'explanation', 'conceptTag'],
            },
          },
          required: ['overallAssessment', 'recommendations', 'followUpPracticeQuestion'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    memoryCache.set(cacheKey, parsed);
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Error in adaptive recommendations:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate recommendations.' });
  }
});

// POST /api/generate-study-plan - Generates personalized study schedule prioritizing exams and weak topics
app.post('/api/generate-study-plan', async (req: Request, res: Response) => {
  try {
    const {
      subject,
      examDate,
      syllabusTopics = [],
      dailyHours = 2,
      learnerLevel = 'college',
      weakAreas = [],
    } = req.body;

    if (!subject || !examDate) {
      return res.status(400).json({ error: 'Subject and Exam Date are required.' });
    }

    const ai = getAiClient();
    const systemInstruction = `You are StudySpark AI Smart Study Planner.
Generate a realistic, balanced, high-impact study plan for:
Subject: ${subject}
Exam Date: ${examDate}
Syllabus Topics: ${syllabusTopics.length > 0 ? syllabusTopics.join(', ') : 'Comprehensive core curriculum'}
Available Study Hours per Day: ${dailyHours}
Level: ${learnerLevel}
Known Weak Areas to Prioritize: ${weakAreas.length > 0 ? weakAreas.join(', ') : 'None specified'}

Guidelines:
1. Break down preparation into 5-8 sequential, achievable study sessions leading up to the exam.
2. Front-load difficult/weak topics first, followed by synthesis and mock test review.
3. Assign realistic time estimates (e.g. 1.5 - 2.5 hours).
4. Mark priority as 'urgent', 'high', or 'medium'.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Create a structured study task schedule for ${subject} with exam on ${examDate}.`,
      config: {
        systemInstruction,
        temperature: 0.5,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            studySummary: { type: Type.STRING },
            totalRecommendedHours: { type: Type.NUMBER },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  examDate: { type: Type.STRING },
                  scheduledDate: { type: Type.STRING },
                  estimatedHours: { type: Type.NUMBER },
                  difficulty: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  notes: { type: Type.STRING },
                },
                required: [
                  'id',
                  'subject',
                  'topic',
                  'examDate',
                  'scheduledDate',
                  'estimatedHours',
                  'difficulty',
                  'priority',
                  'notes',
                ],
              },
            },
          },
          required: ['studySummary', 'totalRecommendedHours', 'tasks'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Error generating study plan:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate study plan.' });
  }
});

async function main() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudySpark AI server is listening on port ${PORT}`);
  });
}

// Only launch standalone dev server if not in Vercel serverless runtime
if (!process.env.VERCEL) {
  main().catch((err) => {
    console.error('Server startup error:', err);
    process.exit(1);
  });
}

export default app;
