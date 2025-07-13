import { EmotionInput, Symphony } from '../types';

export const generateSymphony = async (input: EmotionInput): Promise<Symphony> => {
  try {
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const data: Symphony = await response.json();
    return data;

  } catch (error) {
    console.error("Error calling backend API:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate symphony: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the backend.");
  }
};