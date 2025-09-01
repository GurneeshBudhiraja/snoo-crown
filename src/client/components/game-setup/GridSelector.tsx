import React from 'react';
import { GRID_OPTIONS } from '../../constants';

function GridSelector({
  setStep,
  setGridSelection,
}: {
  setStep: (step: number) => void;
  setGridSelection: (gridSelection: string) => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 rounded-2xl shadow-2xl p-8 border-4 border-blue-300 max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg tracking-wide text-center">
        Select Your Grid
      </h2>
      <p className="text-blue-100 text-lg mb-8 text-center">
        Choose a grid size and difficulty to start your game!
      </p>
      <div className="flex flex-col gap-5 w-full">
        {GRID_OPTIONS.map((option, idx) => (
          <button
            key={`${option.size}-${option.difficulty}-${idx}`}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all flex flex-col items-center border-2 border-blue-200 hover:border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            onClick={() => {
              setStep(1);
              setGridSelection(option.size);
            }}
            type="button"
          >
            <span className="text-2xl font-extrabold tracking-wider mb-1 drop-shadow">
              {option.size}x{option.size}
            </span>
            <span className="text-base text-yellow-200 font-medium tracking-tight">
              {option.difficulty}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default GridSelector;
