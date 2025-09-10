import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GridOption } from '../pages/CreateAndSharePage';
import { cn } from '../util';
import useSound from '../hooks/useSound';
import { Pipette } from 'lucide-react';

// Add shortcutKey to each color for extensibility
const DEFAULT_COLOR_PALETTE = [
  { name: 'Green', value: 'green', shortcutKey: 'G' },
  { name: 'Sky', value: 'sky', shortcutKey: 'S' },
  { name: 'Peach', value: 'peach', shortcutKey: 'P' },
  { name: 'Bright Yellow', value: 'bright-yellow', shortcutKey: 'YP' },
  { name: 'Pale Yellow', value: 'pale-yellow', shortcutKey: 'C' },
  { name: 'Red', value: 'red', shortcutKey: 'R' },
  { name: 'Orange', value: 'orange', shortcutKey: 'O' },
];

export type CellColor = string | null;

type GenerateGridProps = {
  gridSize: number;
  cellColors: CellColor[][];
  onCellClick: (row: number, col: number) => void;
  selectedColor: string;
};

function GenerateGrid({ gridSize, cellColors, onCellClick, selectedColor }: GenerateGridProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div className="relative ">
      <div
        ref={gridRef}
        className="grid bg-transparent"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
          cursor: 'none', // Hide cursor on the grid container
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {Array.from({ length: gridSize }).map((_, rowIdx) =>
          Array.from({ length: gridSize }).map((_, colIdx) => {
            const color = cellColors?.[rowIdx]?.[colIdx];
            return (
              <button
                key={`${rowIdx}-${colIdx}`}
                className={cn(
                  'w-10 sm:w-14 aspect-square border-2 border-game-dark flex items-center justify-center text-game-dark transition-all duration-100 focus:outline-none',
                  [
                    rowIdx === 0 && colIdx === 0 && 'rounded-tl-lg',
                    rowIdx === 0 && colIdx === gridSize - 1 && 'rounded-tr-lg',
                    rowIdx === gridSize - 1 && colIdx === 0 && 'rounded-bl-lg',
                    rowIdx === gridSize - 1 && colIdx === gridSize - 1 && 'rounded-br-lg',
                  ],
                  color ? `bg-game-${color}` : 'bg-game-cream'
                )}
                style={{
                  background: undefined,
                  boxShadow: color ? '0 2px 8px 0 rgba(0,0,0,0.10)' : undefined,
                  cursor: 'none', // Hide default cursor
                }}
                aria-label={`Cell ${rowIdx + 1}, ${colIdx + 1}`}
                onClick={() => onCellClick(rowIdx, colIdx)}
              />
            );
          })
        )}
      </div>

      {/* Custom Pipette Cursor */}
      {isHovering && (
        <div
          className="absolute pointer-events-none z-50 transition-transform duration-75 ease-out"
          style={{
            left: mousePosition.x - 12,
            top: mousePosition.y - 12,
            transform: 'translate(0, 0)',
          }}
        >
          <div className="relative">
            <Pipette
              className="w-6 h-6 text-game-dark drop-shadow-lg"
              style={{
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
              }}
            />
            {/* Color preview dot */}
            <div
              className="absolute w-2 h-2 rounded-full border border-game-dark"
              style={{
                left: '4px',
                top: '4px',
                backgroundColor: `var(--color-game-${selectedColor})`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

type CustomGridMakerProps = {
  selectedGridIndex: GridOption | undefined;
  setCurrentStepIndex: (step: number) => void;
  cellColors: CellColor[][];
  setCellColors: React.Dispatch<React.SetStateAction<CellColor[][]>>;
  isAllCellsFilled: boolean;
  setIsAllCellsFilled: (filled: boolean) => void;
};

function CustomGridMaker({
  selectedGridIndex,
  setCurrentStepIndex,
  cellColors,
  setCellColors,
  isAllCellsFilled,
  setIsAllCellsFilled,
}: CustomGridMakerProps) {
  const { playPingSound, playButtonClickSound } = useSound();
  const palette = DEFAULT_COLOR_PALETTE;
  const [selectedColor, setSelectedColor] = useState<string>(palette[0]?.value ?? '');

  // Map shortcutKey to color value for quick lookup
  const shortcutMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    palette.forEach((color) => {
      map[color.shortcutKey.toUpperCase()] = color.value;
    });
    return map;
  }, [palette]);

  // Keyboard shortcut handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.shiftKey && !e.repeat) {
        const key = e.key.toUpperCase();
        if (shortcutMap[key]) {
          setSelectedColor(shortcutMap[key]);
          void playButtonClickSound();
          e.preventDefault();
        }
      }
    },
    [shortcutMap, setSelectedColor, playButtonClickSound]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset cellColors if grid size changes
  useEffect(() => {
    const size = selectedGridIndex?.size ?? 0;
    setCellColors(Array.from({ length: size }, () => Array.from({ length: size }, () => null)));
  }, [selectedGridIndex?.size, setCellColors]);

  // Check if all cells are filled
  useEffect(() => {
    setIsAllCellsFilled(cellColors.every((row) => row.every((cell) => cell !== null)));
  }, [cellColors, setIsAllCellsFilled]);

  // If no grid is selected, show nothing or a message
  if (!selectedGridIndex || !selectedGridIndex.size) {
    return <div className="text-center text-lg text-game-dark">No grid selected.</div>;
  }

  const gridSize = selectedGridIndex.size;

  // When a cell is clicked, fill it with the selected color
  const handleCellClick = (row: number, col: number) => {
    void playPingSound();
    setCellColors((prev) => {
      if (prev?.[row]?.[col] === selectedColor) return prev;
      const newGrid = prev.map((arr) => arr.slice());
      if (newGrid[row] !== undefined) {
        newGrid[row][col] = selectedColor;
      }
      return newGrid;
    });
  };

  // Color palette button with shortcut display
  function ColorPaletteButton({
    color,
    isSelected,
    onClick,
  }: {
    color: (typeof palette)[number];
    isSelected: boolean;
    onClick: () => void;
  }) {
    return (
      <button
        key={color.value}
        className={cn(
          'w-16 h-8 sm:w-24 md:w-28 2xs:h-10 md:h-12 rounded-md shadow-game-button-sm border-2 border-game-dark flex items-center justify-center transition-all duration-100 focus:outline-none focus-visible:ring-2 ring-game-dark focus-visible:ring-offset-2 focus-visible:ring-offset-game-cream cursor-pointer',
          `bg-game-${color.value}`,
          'active:translate-y-1 active:translate-x-3 active:shadow-none transition-all duration-75 ease-linear',
          isSelected && `ring-2 ring-game-dark ring-offset-2 ring-offset-game-cream shadow-none`
        )}
        onClick={onClick}
        type="button"
        aria-label={`${color.name} (Shift+${color.shortcutKey})`}
        tabIndex={0}
      >
        {isSelected ? (
          <span className="text-xs font-bold text-game-dark">
            <Pipette className="w-5 aspect-square text-game-dark" />
          </span>
        ) : (
          <span
            className="flex flex-col items-center justify-center text-[0.65rem] md:text-sm font-semibold text-game-dark select-none pointer-events-none"
            style={{
              textShadow: '0 1px 2px #fff, 0 0px 2px #0002',
              lineHeight: 1.1,
              letterSpacing: '0.01em',
            }}
          >
            <span className="uppercase font-game-ibm">
              Shift
              <span className="mx-0.5 text-xs font-bold align-middle">+</span>
              {color.shortcutKey}
            </span>
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full overflow-visible scrollable-stable">
      {/* Grid */}
      <GenerateGrid
        gridSize={gridSize}
        cellColors={cellColors}
        onCellClick={handleCellClick}
        selectedColor={selectedColor}
      />

      {/* Color palette selector */}
      <div className="flex flex-wrap 2xs:flex-col justify-center gap-3 2xs:gap-5 2xs:fixed right-10 2xs:right-7 bottom-1/2 translate-y-[45%] ">
        {palette.map((color) => {
          const isSelected = selectedColor === color.value;
          return (
            <ColorPaletteButton
              key={color.value}
              color={color}
              isSelected={isSelected}
              onClick={() => {
                void playButtonClickSound();
                setSelectedColor(color.value);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CustomGridMaker;
