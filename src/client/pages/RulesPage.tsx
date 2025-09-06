import React from 'react';
import { ApplicationPage } from '../App';
import { GameButton } from '../components';
import { SnooFaceSVG } from '../assets/assets';
type RulesPageProps = {
  onNavigate: (page: ApplicationPage) => void;
};

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

const RulesPage: React.FC<RulesPageProps> = ({ onNavigate }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-game-cream relative rounded-md gap-8 overflow-y-scroll">
    <div className="text-center p-2 rounded-md game-button-border text-3xl font-bold text-game-black bg-game-green font-game-ibm tracking-wide">
      How to play
    </div>
    <div className="max-w-lg w-full space-y-6 text-game-black font-game-inter font-medium">
      {rules.map((rule, idx) => (
        <div className="text-left" key={idx}>
          <p className="text-lg leading-relaxed">{rule}</p>
        </div>
      ))}
    </div>
    <div>
      <GameButton
        text="Back to Home"
        className="bg-game-peach hover:bg-game-peach/85 text-game-dark"
        onClick={() => onNavigate('home')}
      />
    </div>
  </div>
);

export default RulesPage;
