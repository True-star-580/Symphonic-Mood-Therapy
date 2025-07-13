const { GoogleGenAI } = require('@google/genai');

const systemInstruction = `You are a world-renowned AI Music Therapist and Composer named 'Aura'. Your purpose is to create personalized symphonic compositions to help users navigate their emotional states. You are an expert in music therapy principles.

Analyze the user's emotional state from their text and,if provided, their visual expression. Then, generate a detailed description of a therapeutic symphony.

The 'moodAndGoal' field should be a descriptive sentence.
The 'primaryMoodKeyword' field MUST be a very short, simple, 1-2 word phrase describing the core emotion, ideal for a music API search (e.g., 'calm piano', 'uplifting pop', 'sad ambient'). This is crucial for finding a real track.

For 'instrumentation' and 'therapeuticElements', provide a single, comma-separated string. For example: "Piano, Cello, Violin".

Respond ONLY with a single, valid JSON object that strictly adheres to the following schema. Do not add any explanatory text, markdown formatting like \`\`\`json, or any other content outside of the JSON object.

Example of a valid response:
{
  "title": "Whispers of a Hopeful Dawn",
  "moodAndGoal": "To provide a sense of calm and gentle optimism",
  "instrumentation": "Piano, String Quartet, Flute",
  "compositionalStyle": "Minimalist ambient with neo-classical influences",
  "therapeuticElements": "432Hz tuning, Gradual tempo deceleration, Binaural beats (alpha wave)",
  "primaryMoodKeyword": "calm optimistic"
}
`;

module.exports = async (req, res) => {
  console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set');
    return res.status(500).json({ error: 'A server error occurred: API key not configured.' });
  }

  const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Missing input in request body' });
  }

  const contentParts = [{ text: input.text }];

  if (input.imageBase64) {
    const base64Data = input.imageBase64.split(',')[1];
    contentParts.unshift({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data,
      },
    });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: {
        parts: [{ text: systemInstruction }],
        role: "model"
      },
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.8,
        topP: 0.95,
      }
    });

    const result = await model.generateContent({
      contents: [{ parts: contentParts, role: "user" }],
    });

    const response = await result.response;
    let jsonStr = response.text();

    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }

    let rawData;
    try {
      rawData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON from Gemini API response:", jsonStr);
      throw new Error("The AI returned a response that was not valid JSON.");
    }

    const parsedData = {
      title: rawData.title || 'Untitled Symphony',
      moodAndGoal: rawData.moodAndGoal || 'A neutral, calming mood',
      compositionalStyle: rawData.compositionalStyle || 'Ambient',
      primaryMoodKeyword: rawData.primaryMoodKeyword || 'calm ambient',
      instrumentation: (rawData.instrumentation || '').split(',').map(item => item.trim()).filter(Boolean),
      therapeuticElements: (rawData.therapeuticElements || '').split(',').map(item => item.trim()).filter(Boolean),
    };

    if (parsedData.instrumentation.length === 0) parsedData.instrumentation.push('Mixed Ensemble');
    if (parsedData.therapeuticElements.length === 0) parsedData.therapeuticElements.push('Soothing Rhythms');

    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    res.status(500).json({ error: `An error occurred while communicating with the AI: ${message}` });
  }
};
