import React, { useState } from 'react';
import GridSelector from '../components/game-setup/GridSelector';
import GridDesign from '../components/game-setup/GridDesign';
import { Button } from '../components/Button';
import { ApplicationPage } from '../App';

type GameSetupProps = {
  onNavigate: (page: ApplicationPage) => void;
};

function GameSetup({ onNavigate }: GameSetupProps) {
  const [step, setStep] = useState(0);
  const [gridSelection, setGridSelection] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-game-peach)] via-white to-[var(--color-game-sky)] flex flex-col items-center justify-center p-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 w-full max-w-md">
        <div className="mb-6">
          <Button
            onClick={() => onNavigate('home')}
            variant="secondary"
            className="text-sm py-2 px-4"
          >
            ← Back to Home
          </Button>
        </div>

        {step === 0 && <GridSelector setStep={setStep} setGridSelection={setGridSelection} />}
        {step === 1 && <GridDesign gridSelection={gridSelection} />}
      </div>
    </div>
  );
}

export default GameSetup;
