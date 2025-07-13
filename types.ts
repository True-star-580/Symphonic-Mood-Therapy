export interface Symphony {
  title: string;
  moodAndGoal: string;
  instrumentation: string[];
  compositionalStyle: string;
  therapeuticElements: string[];
  primaryMoodKeyword: string;
}

export interface EmotionInput {
  text: string;
  imageBase64: string | null;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  keywords: string[];
}