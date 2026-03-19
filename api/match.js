// Vercel Serverless Function - Groq API Proxy
// This keeps the API key secure on the server side

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Get API key from environment variable
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    console.error('GROQ_API_KEY not found in environment variables');
    return res.status(500).json({ error: 'Server configuration error. API key not set.' });
  }

  try {
    // Extract data from request body
    const { mbtiType, openQ1, openQ2, openQ3, userName, userAge, userGender } = req.body;

    // Validate required fields
    if (!mbtiType) {
      return res.status(400).json({ error: 'Missing required field: mbtiType' });
    }

    const safeOpenQ1 = (openQ1 || 'Not provided').toString().trim() || 'Not provided';
    const safeOpenQ2 = (openQ2 || 'Not provided').toString().trim() || 'Not provided';
    const safeOpenQ3 = (openQ3 || 'Not provided').toString().trim() || 'Not provided';

    // Build the prompt for Groq AI
    const prompt = buildPrompt(mbtiType, safeOpenQ1, safeOpenQ2, safeOpenQ3, userName, userAge, userGender);

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 600,
        temperature: 0.8,
        messages: [
          {
            role: 'system',
            content: 'You are an expert in anime psychology and MBTI personality matching. Always respond with valid JSON only. No markdown, no extra text.'
          },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Groq API error:', errData);
      return res.status(response.status).json({ 
        error: errData?.error?.message || `Groq API error: ${response.status}` 
      });
    }

    const data = await response.json();
    
    // Return the response to the frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Failed to process your request. Please try again.' 
    });
  }
}

// Helper function to build the AI prompt
function buildPrompt(mbtiType, openQ1, openQ2, openQ3, userName, userAge, userGender) {
  return `
You are matching a person to an anime character based on their MBTI type and personal answers.

**MBTI Type:** ${mbtiType}
**Name:** ${userName || 'User'}
**Age:** ${userAge || 'Not specified'}
**Gender:** ${userGender || 'Not specified'}

**Personal Answers:**
1. Motivation/Drive: ${openQ1}
2. Challenge Response: ${openQ2}
3. Dream World: ${openQ3}

Based on this information, find the BEST matching anime character. Consider:
- MBTI personality alignment
- Character motivations and values
- How they handle challenges
- Their ideal world/goals
- Character depth and development

Respond with ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "characterName": "Full Character Name",
  "anime": "Anime Series Name",
  "description": "2-3 sentences explaining why this character matches the user's personality, referencing their MBTI traits and personal answers",
  "matchPercentage": 85,
  "traits": ["trait1", "trait2", "trait3", "trait4"]
}

Requirements:
- Choose from popular, well-known anime characters (Naruto, Death Note, Attack on Titan, My Hero Academia, Demon Slayer, Jujutsu Kaisen, One Piece, Hunter x Hunter, Fullmetal Alchemist, etc.)
- matchPercentage should be between 75-95
- traits should be 4 short personality traits (2-3 words each)
- description must reference both MBTI and their personal answers
- Response must be pure JSON only

Respond now:`.trim();
}
