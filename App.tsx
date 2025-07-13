import React, { useState, useCallback } from 'react';
import { EmotionInput, Symphony, Track } from './types';
import { generateSymphony } from './services/geminiService';
import { findSoundtrack } from './services/musicGenerationService';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import CameraView from './components/CameraView';

type TrackStatus = 'idle' | 'loading' | 'success' | 'error';

const App: React.FC = () => {
  const [symphony, setSymphony] = useState<Symphony | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [foundTrack, setFoundTrack] = useState<Track | null>(null);
  const [trackStatus, setTrackStatus] = useState<TrackStatus>('idle');
  const [trackError, setTrackError] = useState<string | null>(null);

  const handleGenerateSymphony = useCallback(async (text: string) => {
    setIsLoading(true);
    setError(null);
    setSymphony(null);
    // Reset track state on new generation
    setFoundTrack(null);
    setTrackError(null);
    setTrackStatus('idle');

    const input: EmotionInput = {
      text,
      imageBase64: capturedImage,
    };

    try {
      const result = await generateSymphony(input);
      setSymphony(result);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Failed to generate symphony. ${e.message}`);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [capturedImage]);

  const handleFindTrack = useCallback(async (symphonyToMatch: Symphony) => {
    if (!symphonyToMatch) return;
    setTrackStatus('loading');
    setTrackError(null);
    setFoundTrack(null);
    try {
        const track = await findSoundtrack(symphonyToMatch);
        setFoundTrack(track);
        setTrackStatus('success');
    } catch (e) {
      if (e instanceof Error) {
        setTrackError(`Could not find a track: ${e.message}`);
      } else {
        setTrackError('An unknown error occurred while finding a soundtrack.');
      }
      setTrackStatus('error');
    }
  }, []);

  const handleCapture = (imageBase64: string) => {
    setCapturedImage(imageBase64);
    setIsCameraOpen(false);
  };

  const handleRemoveImage = () => {
    setCapturedImage(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-7xl flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <InputPanel
          onGenerate={handleGenerateSymphony}
          isLoading={isLoading}
          onOpenCamera={() => setIsCameraOpen(true)}
          capturedImage={capturedImage}
          onRemoveImage={handleRemoveImage}
        />
        <OutputPanel
          symphony={symphony}
          isLoading={isLoading}
          error={error}
          foundTrack={foundTrack}
          trackStatus={trackStatus}
          trackError={trackError}
          onFindTrack={handleFindTrack}
        />
      </main>
      {isCameraOpen && (
        <CameraView
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCapture}
        />
      )}
    </div>
  );
};

export default App;