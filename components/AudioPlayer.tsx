import React, { useEffect, useRef } from 'react';
import { Track } from '../types';
import { CheckCircleIcon } from './Icon';

interface AudioPlayerProps {
  track: Track;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ track }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // This effect handles loading and playing the audio when the track changes.
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement && track.url) {
      // Programmatically control the audio element to bypass autoplay issues
      audioElement.src = track.url;
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Autoplay was prevented. The user can still press play manually.
          console.log("Audio autoplay was prevented by the browser.", error);
        });
      }
    }
  }, [track]); // Rerun effect when the track object changes

  return (
    <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
        <div>
            <h4 className="font-semibold text-lg text-slate-200">Soundtrack Ready</h4>
            <p className="text-sm text-slate-400">{track.title} - by {track.artist}</p>
        </div>
      </div>
      <audio
        ref={audioRef}
        controls
        crossOrigin="anonymous"
        className="w-full"
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;