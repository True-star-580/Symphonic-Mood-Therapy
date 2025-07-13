import React from 'react';
import { MusicNoteIcon } from './Icon';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-7xl text-center">
      <div className="flex justify-center items-center gap-4">
        <MusicNoteIcon className="w-10 h-10 text-violet-400" />
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500 font-serif">
          Symphonic Mood Therapy
        </h1>
      </div>
      <p className="mt-4 text-lg text-slate-400">
        Describe your feelings, and let AI compose a therapeutic symphony for your mind.
      </p>
    </header>
  );
};

export default Header;
