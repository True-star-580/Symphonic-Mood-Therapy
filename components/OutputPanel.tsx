import React from 'react';
import { Symphony, Track } from '../types';
import Spinner from './Spinner';
import AudioPlayer from './AudioPlayer';
import { MusicNoteIcon, SparklesIcon, SoundWaveIcon } from './Icon';

type TrackStatus = 'idle' | 'loading' | 'success' | 'error';

interface OutputPanelProps {
  symphony: Symphony | null;
  isLoading: boolean;
  error: string | null;
  foundTrack: Track | null;
  trackStatus: TrackStatus;
  trackError: string | null;
  onFindTrack: (symphony: Symphony) => void;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ 
    symphony, 
    isLoading, 
    error,
    foundTrack,
    trackStatus,
    trackError,
    onFindTrack
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
          <Spinner />
          <p className="mt-4 text-lg animate-pulse">Aura is composing your symphony...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-400 p-4">
          <h3 className="text-xl font-bold mb-2">Composition Failed</h3>
          <p className="text-center">{error}</p>
        </div>
      );
    }

    if (symphony) {
      return (
        <div className="p-2 animate-fade-in">
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 mb-4 font-serif">{symphony.title}</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2 border-b border-slate-700 pb-2">Mood & Goal</h3>
              <p className="text-slate-400">{symphony.moodAndGoal}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2 border-b border-slate-700 pb-2">Compositional Style</h3>
              <p className="text-slate-400">{symphony.compositionalStyle}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-300 mb-3">Instrumentation</h3>
              <div className="flex flex-wrap gap-2">
                {symphony.instrumentation.map((instrument, index) => (
                  <span key={index} className="bg-slate-700 text-violet-300 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2">
                    <MusicNoteIcon className="w-4 h-4" />
                    {instrument}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-300 mb-3">Therapeutic Elements</h3>
               <ul className="space-y-2">
                {symphony.therapeuticElements.map((element, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <SparklesIcon className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                        <span className="text-slate-400">{element}</span>
                    </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            {trackStatus === 'success' && foundTrack ? (
                <AudioPlayer track={foundTrack} />
            ) : (
                <div className="text-center">
                    <button
                        onClick={() => onFindTrack(symphony)}
                        disabled={trackStatus === 'loading'}
                        className="bg-green-600 hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 mx-auto shadow-lg hover:shadow-green-500/30"
                    >
                        {trackStatus === 'loading' ? (
                            <>
                                <Spinner />
                                <span>Finding Soundtrack...</span>
                            </>
                        ) : (
                            <>
                                <SoundWaveIcon className="w-6 h-6" />
                                <span>Find My Soundtrack</span>
                            </>
                        )}
                    </button>
                    {trackStatus === 'error' && trackError && <p className="text-red-400 mt-4 text-center">{trackError}</p>}
                </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 p-4">
        <div className="w-24 h-24 border-2 border-dashed border-slate-700 rounded-full flex items-center justify-center mb-4">
           <MusicNoteIcon className="w-12 h-12 text-slate-700"/>
        </div>
        <h3 className="text-xl font-semibold">Your Symphony Awaits</h3>
        <p className="mt-2 text-center">Describe your feelings in the panel on the left to begin.</p>
      </div>
    );
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 shadow-lg border border-slate-700/50 min-h-[600px] backdrop-blur-sm overflow-y-auto">
      {renderContent()}
    </div>
  );
};

export default OutputPanel;