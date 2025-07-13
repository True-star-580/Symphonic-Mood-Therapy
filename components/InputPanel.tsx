import React, { useState } from 'react';
import { CameraIcon, PhotoIcon, XCircleIcon } from './Icon';
import Spinner from './Spinner';

interface InputPanelProps {
  onGenerate: (text: string) => void;
  isLoading: boolean;
  onOpenCamera: () => void;
  capturedImage: string | null;
  onRemoveImage: () => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
  onGenerate,
  isLoading,
  onOpenCamera,
  capturedImage,
  onRemoveImage,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onGenerate(text);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 shadow-lg border border-slate-700/50 flex flex-col h-full backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-slate-100 mb-4 font-serif">Your Emotional Canvas</h2>
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <div className="flex-grow flex flex-col">
          <label htmlFor="emotion-text" className="text-slate-400 mb-2">
            How are you feeling right now? Describe in detail.
          </label>
          <textarea
            id="emotion-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., 'I feel overwhelmed by work and a bit nostalgic for simpler times...'"
            className="w-full flex-grow p-4 bg-slate-900/70 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all duration-300 min-h-[200px]"
            rows={8}
            disabled={isLoading}
          />
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center">
            {capturedImage ? (
                <div className="relative group">
                    <img src={capturedImage} alt="Captured emotion" className="w-20 h-20 rounded-lg object-cover" />
                    <button 
                        onClick={onRemoveImage}
                        type="button" 
                        className="absolute -top-2 -right-2 bg-slate-700 rounded-full text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image">
                        <XCircleIcon className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 mt-1">
                        <PhotoIcon className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-slate-400">Visual context added.</span>
                    </div>
                </div>
            ) : (
                <button
                type="button"
                onClick={onOpenCamera}
                disabled={isLoading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-slate-200 rounded-lg transition-colors duration-300"
                >
                <CameraIcon className="w-5 h-5" />
                <span>Add Visual Context (Optional)</span>
                </button>
            )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="w-full mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-violet-500/30"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span>Composing...</span>
            </>
          ) : (
            'Generate My Symphony'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputPanel;
