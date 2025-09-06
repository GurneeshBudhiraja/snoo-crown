import React from 'react';
import { GameButton, GameOptionsHeader, SnooLeaderboardImage, SnooRulesImage } from '../components';
import { SnooFaceSVG } from '../assets/assets';
import useApplicationContext from '../hooks/useApplicationContext';
import { AnimatePresence } from 'motion/react';

const SnooFaceIcon = () => (
  <img
    src={SnooFaceSVG}
    alt="Snoo Face"
    className="inline w-5 aspect-square object-cover mb-2"
    draggable={false}
    style={{ display: 'inline', verticalAlign: 'middle' }}
  />
);

const rules: React.ReactNode[] = [
  <>
    <span>1.</span> Place exactly one <SnooFaceIcon /> in every row, column, and color region.
  </>,
  <>
    <span>2.</span> Tap once to place an X, and tap twice to place a <SnooFaceIcon />. Use X to mark
    where a <SnooFaceIcon /> cannot go.
  </>,
  <>
    <span>3.</span> No two <SnooFaceIcon />s can touch each other, not even diagonally.
  </>,
];

const RulesPage = () => {
  const { setCurrentPage } = useApplicationContext();
  return (
    <div className="fixed inset-0 flex flex-col bg-game-cream p-0 m-0 z-10 rounded-lg overflow-clip">
      <AnimatePresence>
        <SnooRulesImage />
      </AnimatePresence>
      <GameOptionsHeader showHomeButton={true} />
      <div className="flex-1 w-full flex flex-col items-center justify-start sm:justify-center overflow-y-auto gap-8 p-4 sm:p-8">
        <div className="text-center p-2 rounded-md game-button-border text-3xl font-bold text-game-black bg-game-pale-yellow font-game-ibm tracking-wide mt-4 sm:mt-0">
          How To Play
        </div>
        <div className="max-w-lg w-full space-y-2 2xs:space-y-6 text-game-black font-game-inter font-medium">
          {rules.map((rule, idx) => (
            <div className="text-left" key={idx}>
              <p className="text-lg leading-relaxed">{rule}</p>
            </div>
          ))}
        </div>
        <div className="w-full flex justify-center mb-4 sm:mb-0">
          <GameButton
            text="Back to Home"
            className="bg-game-peach hover:bg-game-peach/85 text-game-dark max-w-xs"
            onClick={() => setCurrentPage('home')}
          />
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
