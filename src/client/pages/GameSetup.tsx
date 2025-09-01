import React, { useState } from 'react';
import GridSelector from '../components/game-setup/GridSelector';
import GridDesign from '../components/game-setup/GridDesign';

function GameSetup({
  setCompletePost,
}: {
  setCompletePost: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [step, setStep] = useState(0);
  const [gridSelection, setGridSelection] = useState<string | null>(null);
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center rounded-2xl shadow-2xl p-8 border-4 border-blue-300 max-w-md mx-auto">
      {step === 0 && <GridSelector setStep={setStep} setGridSelection={setGridSelection} />}
      {step === 1 && <GridDesign gridSelection={gridSelection} />}
    </div>
  );
}

export default GameSetup;
