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

// POST /api/learn - Core personalized learning generator (optimized for high speed)
app.post('/api/learn', async (req: Request, res: Response) => {
  try {
    const { topic, learnerLevel = 'high_school', learningStyle = 'analogy', userBackground = '' } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'Please provide a valid topic or question.' });
    }

    const cacheKey = getCacheKey('learn', topic, learnerLevel, learningStyle, userBackground);
    if (memoryCache.has(cacheKey)) {
      return res.json({
        success: true,
        data: memoryCache.get(cacheKey),
        cached: true,
      });
    }

    const ai = getAiClient();

    const systemInstruction = `You are StudySpark AI, an elite educational mentor.
Your job is to provide direct, intuitive, memorable explanations as quickly and clearly as possible.
Be concise, clear, and friendly. Avoid filler words.

Learner Level: ${learnerLevel} (${getLevelDescription(learnerLevel)})
Learning Modality: ${learningStyle} (${getStyleDescription(learningStyle)})
${userBackground ? `Student Background & Interests: ${userBackground}` : ''}

Key Guidelines:
1. bigPicture: 2 punchy, vivid paragraphs explaining what it is, why it exists, and why it matters.
2. analogy: 1 clear everyday metaphor with the core "aha!" takeaway.
3. keySteps: 3-4 numbered steps without logical jumps.
4. realWorldExamples: 2-3 concrete applications in nature, technology, or daily life.
5. commonMistakes: 2 frequent misconceptions vs reality.
6. cheatSheet: 3-4 essential terms + 1 golden rule.
7. flashcards: 4 active recall flashcards.
8. quiz: 3 multiple-choice questions with 4 options each and explanations.
9. suggestedFollowUps: 3 natural follow-up questions.`;

    const prompt = `Explain: "${topic.trim()}" in simple, intuitive terms.`;

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
                },
                required: ['question', 'options', 'correctIndex', 'explanation'],
              },
            },
            suggestedFollowUps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'title',
            'oneLiner',
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
