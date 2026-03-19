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

// =============================================
// CHARACTER DATABASE (selection metadata)
// =============================================
// Keep this server-side so the model can be constrained to the exact
// characters available in the UI and can reason about MBTI/gender.
const CHARACTER_DB = {
  // INTJ
  'Sasuke Uchiha': { gender: 'Male', series: 'Naruto', mbti: 'INTJ' },
  'Mei Mei': { gender: 'Female', series: 'Jujutsu Kaisen', mbti: 'INTJ' },
  // ENTJ
  'Erwin Smith': { gender: 'Male', series: 'Attack on Titan', mbti: 'ENTJ' },
  'Sylvia Sherwood': { gender: 'Female', series: 'Spy x Family', mbti: 'ENTJ' },
  // INTP
  'Kakashi Hatake': { gender: 'Male', series: 'Naruto', mbti: 'INTP' },
  'Frieren': { gender: 'Female', series: "Frieren: Beyond Journey's End", mbti: 'INTP' },
  // ENTP
  'Satoru Gojo': { gender: 'Male', series: 'Jujutsu Kaisen', mbti: 'ENTP' },
  'Nico Robin': { gender: 'Female', series: 'One Piece', mbti: 'ENTP' },
  // INFJ
  'Itachi Uchiha': { gender: 'Male', series: 'Naruto', mbti: 'INFJ' },
  'Tamayo': { gender: 'Female', series: 'Demon Slayer', mbti: 'INFJ' },
  // INFP
  'Gaara': { gender: 'Male', series: 'Naruto', mbti: 'INFP' },
  'Hinata Hyuga': { gender: 'Female', series: 'Naruto', mbti: 'INFP' },
  // ENFJ
  'Tanjiro Kamado': { gender: 'Male', series: 'Demon Slayer', mbti: 'ENFJ' },
  'Tsunade': { gender: 'Female', series: 'Naruto', mbti: 'ENFJ' },
  // ENFP
  'Naruto Uzumaki': { gender: 'Male', series: 'Naruto', mbti: 'ENFP' },
  'Kyoko Hori': { gender: 'Female', series: 'Horimiya', mbti: 'ENFP' },
  // ISTJ
  'Levi Ackerman': { gender: 'Male', series: 'Attack on Titan', mbti: 'ISTJ' },
  'Mikasa Ackerman': { gender: 'Female', series: 'Attack on Titan', mbti: 'ISTJ' },
  // ISFJ
  'Isagi Yoichi': { gender: 'Male', series: 'Blue Lock', mbti: 'ISFJ' },
  'Noelle Silva': { gender: 'Female', series: 'Black Clover', mbti: 'ISFJ' },
  // ESTJ
  'Kunigami Rensuke': { gender: 'Male', series: 'Blue Lock', mbti: 'ESTJ' },
  'Maki Zenin': { gender: 'Female', series: 'Jujutsu Kaisen', mbti: 'ESTJ' },
  // ESFJ
  'Rock Lee': { gender: 'Male', series: 'Naruto', mbti: 'ESFJ' },
  'Sakura Haruno': { gender: 'Female', series: 'Naruto', mbti: 'ESFJ' },
  // ISTP
  'Roronoa Zoro': { gender: 'Male', series: 'One Piece', mbti: 'ISTP' },
  'Mereoleona Vermillion': { gender: 'Female', series: 'Black Clover', mbti: 'ISTP' },
  // ISFP
  'Eren Yeager': { gender: 'Male', series: 'Attack on Titan', mbti: 'ISFP' },
  'Nezuko Kamado': { gender: 'Female', series: 'Demon Slayer', mbti: 'ISFP' },
  // ESTP
  'Inosuke Hashibira': { gender: 'Male', series: 'Demon Slayer', mbti: 'ESTP' },
  'Temari': { gender: 'Female', series: 'Naruto', mbti: 'ESTP' },
  // ESFP
  'Asta': { gender: 'Male', series: 'Black Clover', mbti: 'ESFP' },
  'Kushina Uzumaki': { gender: 'Female', series: 'Naruto', mbti: 'ESFP' }
};

function getFilteredCharacterCandidates(preferredGender) {
  return Object.entries(CHARACTER_DB)
    .filter(([, info]) => {
      if (!preferredGender || preferredGender === 'Other') return true;
      return info.gender === preferredGender;
    })
    .map(([name, info]) => `${name} (${info.series}, ${info.gender}, MBTI: ${info.mbti})`);
}

// Helper function to build the AI prompt
function buildPrompt(mbtiType, openQ1, openQ2, openQ3, userName, userAge, userGender) {
  const candidates = getFilteredCharacterCandidates(userGender);
  const candidateNames = candidates.map((line) => line.split(' (')[0]);
  const candidateList = candidates.length ? candidates.join('\n  - ') : '';

  return `Task: Match the user to the single most compatible anime character from the provided list.

USER PROFILE:
- Name: ${userName || 'User'}
- Age: ${userAge || 'Not specified'}
- Gender Profile: ${userGender || 'Not specified'}
- Primary MBTI (Calculated): ${mbtiType}

PERSONAL ANSWERS:
- Ideal World: "${openQ1}"
- Internal Drive: "${openQ2}"
- External Perception: "${openQ3}"

CHARACTER CANDIDATES (Choose ONLY from this list, use the EXACT name):
  - ${candidateList}

MATCHING LOGIC:
1. MBTI CONGRUENCE: Prioritize characters whose MBTI matches the Primary MBTI (${mbtiType}).
2. PSYCHOLOGICAL ALIGNMENT: Use the personal answers to find deep trait alignment.
3. GENDER CONSISTENCY: If the user selected Male/Female, choose a character with that gender.

EXPECTED JSON RESPONSE (Strictly JSON, no markdown tags):
{
  "characterName": "Exact name from list",
  "anime": "Anime Series Name",
  "matchPercentage": 1,
  "traits": ["Four", "Distinct", "Key", "Traits"],
  "description": "A compelling 2-3 sentence explanation referencing MBTI ${mbtiType} and the user's answers."
}

STRICT REQUIREMENTS:
- characterName MUST be EXACTLY one of: ${candidateNames.join(', ')}
- anime MUST match the selected character's series from the candidate list
- matchPercentage must be between 75-95
- traits must be exactly 4 short traits (2-3 words each)
- Output must be pure JSON only (no markdown, no backticks)
`.trim();
}
