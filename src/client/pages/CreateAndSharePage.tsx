import { CustomGridMaker, GameButton, GameOptionsHeader } from '../components';
import { cn } from '../util';
import { useState } from 'react';
import useSound from '../hooks/useSound';
import { Snoo4x4, Snoo5x5, Snoo6x6, Snoo7x7 } from '../assets/assets';
import { CellColor } from '../components/CustomGridMaker';
import { context } from '@devvit/web/client';

export type GridOption = {
  size: number;
  className?: string;
  image?: string;
};

const GRID_OPTIONS: GridOption[] = [
  {
    size: 4,
    className: 'bg-game-green text-game-dark',
    image: Snoo4x4,
  },
  {
    size: 5,
    className: 'bg-game-sky text-game-dark',
    image: Snoo5x5,
  },
  {
    size: 6,
    className: 'bg-game-peach text-game-dark',
    image: Snoo6x6,
  },
  {
    size: 7,
    className: 'bg-game-bright-yellow text-game-dark',
    image: Snoo7x7,
  },
];

// Grid selection component
function GridOptionComponent({
  option,
  isActive,
  onClick,
}: {
  option: GridOption;
  isActive: boolean;
  onClick: () => void;
}) {
  const { playButtonClickSound } = useSound();
  return (
    <button
      className={cn(
        'group relative min-h-0 game-button-border shadow-game-button flex items-center overflow-clip p-4 2xs:p-2',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-game-dark focus-visible:ring-offset-2 focus-visible:ring-offset-game-cream',
        'transition duration-75 ease-linear cursor-pointer',
        'active:scale-95 active:translate-y-1 active:translate-x-3 active:shadow-none',
        option.className,
        isActive && 'ring-4 ring-game-orange ring-offset-2 ring-offset-game-cream z-10 shadow-none'
      )}
      aria-pressed={isActive}
      onClick={() => {
        void playButtonClickSound();
        onClick();
      }}
      type="button"
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
          <span className="inline-block w-3 h-3 rounded-full bg-game-orange border-2 border-game-dark shadow"></span>
          <span className="text-xs font-bold text-game-dark">Selected</span>
        </div>
      )}

      {/* Level image */}
      <div className="rounded-lg border-4 border-game-dark shadow-md w-1/3 2xs:w-1/2 h-full overflow-clip aspect-square">
        {option.image && (
          <img
            src={option.image}
            alt={option.size.toString()}
            className="object-cover h-full w-full "
          />
        )}
      </div>
      {/* Level details */}
      <div className="w-1/2 h-full flex flex-col justify-center items-center ">
        <div className="flex flex-col">
          <span className="text-xs font-medium font-game-ibm tracking-widest">Grid Size</span>
          <div className="text-2xl font-semibold font-game-inter tracking-wide">
            {option.size} x {option.size}
          </div>
        </div>
      </div>
    </button>
  );
}

function CreateAndSharePage() {
  // By default, none is selected
  const [selectedGridIndex, setSelectedGridIndex] = useState<number | null>(null);
  // Track what step the user is on
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  // Track if all cells are filled
  const [isAllCellsFilled, setIsAllCellsFilled] = useState(false);
  const [cellColors, setCellColors] = useState<CellColor[][]>(() => {
    const size = selectedGridIndex ?? 0;
    return Array.from({ length: size }, () => Array.from({ length: size }, () => null));
  });

  // When a grid is selected, trigger the animation to new content
  const handleGridSelect = (idx: number) => {
    setSelectedGridIndex(idx);
    return;
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-game-cream p-0 m-0 z-10 rounded-lg polka-dot-dark">
      <GameOptionsHeader
        showHomeButton={true}
        showBackButton={currentStepIndex > 0}
        onBackButtonClick={() => setCurrentStepIndex(currentStepIndex - 1)}
        className="flex-row 2xs:flex-col"
      />

      {/* Snoo Character */}
      {/* <AnimatePresence>
        <SnooExperimentingImage />
      </AnimatePresence> */}

      {/* Main content */}
      <div className="flex-1 w-full flex flex-col items-center gap-4 p-4 sm:p-8 overflow-y-auto scrollable-stable ">
        {/* Fixed Title */}
        {currentStepIndex === 0 && (
          <div className="text-center p-2 rounded-md game-button-border text-2xl xs:text-3xl font-bold text-game-black bg-game-pale-yellow font-game-ibm tracking-wide mt-4 flex-shrink-0">
            Create And Share
          </div>
        )}

        {/* Scrollable Grid Options Container */}
        <div className="w-full max-w-2xs mx-auto 2xs:max-w-xl md:max-w-2xl flex-1 flex flex-col min-h-0">
          {currentStepIndex === 0 ? (
            <div className="flex h-full  justify-center items-start lg:items-center flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 2xs:gap-4 p-3 w-full">
                {GRID_OPTIONS.map((option, idx) => (
                  <GridOptionComponent
                    key={option.size}
                    option={option}
                    isActive={selectedGridIndex === idx}
                    onClick={() => handleGridSelect(idx)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <CustomGridMaker
              isAllCellsFilled={isAllCellsFilled}
              setIsAllCellsFilled={setIsAllCellsFilled}
              selectedGridIndex={GRID_OPTIONS[selectedGridIndex ?? -1]}
              setCurrentStepIndex={setCurrentStepIndex}
              cellColors={cellColors}
              setCellColors={setCellColors}
            />
          )}
        </div>

        {currentStepIndex === 0 && (
          <GameButton
            text="Next"
            // disabled={currentStepIndex !== 0 || selectedGridIndex === null}
            disabled={selectedGridIndex === null}
            onClick={() => {
              setCurrentStepIndex(currentStepIndex + 1);
            }}
            // className="rounded-r-3xl"
            className="w-full bg-game-cream hover:bg-game-cream/85 disabled:hover:bg-game-cream"
          />
        )}
        {currentStepIndex !== 0 && (
          <GameButton
            text="Share Grid"
            // disabled={!isAllCellsFilled}
            onClick={async () => {
              console.log('Sharing the grid');
              console.log(cellColors);
              return;
              const response = await fetch('/api/post/create/custom', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              type CustomPostResponse =
                | { success: true; navigateTo: string }
                | { success: false; message: string };

              const data: CustomPostResponse = await response.json();

              if (data.success) {
                window.location.href = data.navigateTo;
              } else {
                console.log('Failed to create custom post');
                console.log(data.message);
              }
              console.log('Response from share grid custom repsonse');
              console.log(data);
            }}
            // className="rounded-r-3xl"
            className="w-full bg-game-cream hover:bg-game-cream/85 disabled:hover:bg-game-cream"
          />
        )}
        {/* </div> */}
      </div>
    </div>
  );
}

export default CreateAndSharePage;
