import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { EmotionInput, Symphony } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `You are a world-renowned AI Music Therapist and Composer named 'Aura'. Your purpose is to create personalized symphonic compositions to help users navigate their emotional states. You are an expert in music therapy principles.

Analyze the user's emotional state from their text and, if provided, their visual expression. Then, generate a detailed description of a therapeutic symphony.

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

export const generateSymphony = async (input: EmotionInput): Promise<Symphony> => {
  const contentParts: any[] = [
    { text: input.text },
    { 
      text: `Analyze the provided emotional data. Based on your analysis, compose a description of a therapeutic symphony. Respond ONLY with a valid JSON object following the specified schema.`
    }
  ];
  
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
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: contentParts },
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.8,
          topP: 0.95,
        }
    });

    let jsonStr = response.text.trim();
    
    // In case the model still wraps the response in markdown
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    // Define an interface for the raw response from the AI, where arrays are strings
    interface RawSymphonyResponse {
      title?: string;
      moodAndGoal?: string;
      instrumentation?: string; 
      compositionalStyle?: string;
      therapeuticElements?: string;
      primaryMoodKeyword?: string;
    }
    
    // Parse the JSON object, which might have missing fields
    const rawData: RawSymphonyResponse = JSON.parse(jsonStr);

    // Convert the raw data into a complete Symphony object, providing defaults for any missing fields
    // This makes the function resilient to incomplete AI responses.
    const parsedData: Symphony = {
      title: rawData.title || 'Untitled Symphony',
      moodAndGoal: rawData.moodAndGoal || 'A neutral, calming mood',
      compositionalStyle: rawData.compositionalStyle || 'Ambient',
      primaryMoodKeyword: rawData.primaryMoodKeyword || 'calm ambient',
      instrumentation: (rawData.instrumentation || '').split(',').map(item => item.trim()).filter(Boolean),
      therapeuticElements: (rawData.therapeuticElements || '').split(',').map(item => item.trim()).filter(Boolean),
    };
    
    // Ensure that if arrays are empty, they have at least one default item for display purposes
    if(parsedData.instrumentation.length === 0) parsedData.instrumentation.push('Mixed Ensemble');
    if(parsedData.therapeuticElements.length === 0) parsedData.therapeuticElements.push('Soothing Rhythms');

    return parsedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        let detailedMessage = `Gemini API Error: ${error.message}`;
        if (error instanceof SyntaxError) {
          detailedMessage = `Failed to parse AI response. It may have been malformed. Details: ${error.message}`;
        }
        throw new Error(detailedMessage);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
};