import React, { useState, useEffect } from 'react';
import { GridOption } from '../pages/CreateAndSharePage';
import { cn } from '../util';
import useSound from '../hooks/useSound';

const DEFAULT_COLOR_PALETTE = [
  { name: 'Green', value: 'bg-game-green', border: 'border-game-dark', isCustom: false },
  { name: 'Sky', value: 'bg-game-sky', border: 'border-game-dark', isCustom: false },
  { name: 'Peach', value: 'bg-game-peach', border: 'border-game-dark', isCustom: false },
  {
    name: 'Bright Yellow',
    value: 'bg-game-bright-yellow',
    border: 'border-game-dark',
    isCustom: false,
  },
  {
    name: 'Pale Yellow',
    value: 'bg-game-pale-yellow',
    border: 'border-game-dark',
    isCustom: false,
  },
  { name: 'Red', value: 'bg-game-red', border: 'border-game-dark', isCustom: false },
  { name: 'Orange', value: 'bg-game-orange', border: 'border-game-dark', isCustom: false },
];

export type CellColor = string | null;

function GenerateGrid({
  gridSize,
  cellColors,
  onCellClick,
}: {
  gridSize: number;
  cellColors: CellColor[][];
  onCellClick: (row: number, col: number) => void;
}) {
  return (
    <div
      className="grid bg-game-cream "
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: gridSize }).map((_, rowIdx) =>
        Array.from({ length: gridSize }).map((_, colIdx) => (
          <button
            key={`${rowIdx}-${colIdx}`}
            className={cn(
              'w-10 h-10 sm:w-12 sm:h-12 border-2 border-game-dark flex items-center justify-center text-game-dark transition-all duration-100 focus:outline-none',
              cellColors?.[rowIdx]?.[colIdx]?.startsWith('custom-')
                ? ''
                : cellColors?.[rowIdx]?.[colIdx]
                  ? cellColors?.[rowIdx]?.[colIdx]
                  : 'bg-game-cream',
              [
                rowIdx === 0 && colIdx === 0 && 'rounded-tl-lg',
                rowIdx === 0 && colIdx === gridSize - 1 && 'rounded-tr-lg',
                rowIdx === gridSize - 1 && colIdx === 0 && 'rounded-bl-lg',
                rowIdx === gridSize - 1 && colIdx === gridSize - 1 && 'rounded-br-lg',
              ]
            )}
            style={{
              background: cellColors?.[rowIdx]?.[colIdx]?.startsWith('custom-')
                ? cellColors?.[rowIdx]?.[colIdx]?.replace('custom-', '')
                : undefined,
              boxShadow: cellColors?.[rowIdx]?.[colIdx]
                ? '0 2px 8px 0 rgba(0,0,0,0.10)'
                : undefined,
              cursor: 'pointer',
            }}
            aria-label={`Cell ${rowIdx + 1}, ${colIdx + 1}`}
            onClick={() => onCellClick(rowIdx, colIdx)}
          />
        ))
      )}
    </div>
  );
}

function CustomGridMaker({
  selectedGridIndex,
  setCurrentStepIndex,
  cellColors,
  setCellColors,
  isAllCellsFilled,
  setIsAllCellsFilled,
}: {
  selectedGridIndex: GridOption | undefined;
  setCurrentStepIndex: (step: number) => void;
  cellColors: CellColor[][];
  setCellColors: React.Dispatch<React.SetStateAction<CellColor[][]>>;
  isAllCellsFilled: boolean;
  setIsAllCellsFilled: (filled: boolean) => void;
}) {
  const { playPingSound } = useSound();

  // Reset cellColors if grid size changes
  useEffect(() => {
    const size = selectedGridIndex?.size ?? 0;
    setCellColors(Array.from({ length: size }, () => Array.from({ length: size }, () => null)));
  }, [selectedGridIndex?.size]);

  // Palette state
  const palette = DEFAULT_COLOR_PALETTE;

  // Currently selected color from palette
  const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_COLOR_PALETTE[0]?.value ?? '');

  // If no grid is selected, show nothing or a message
  if (!selectedGridIndex || !selectedGridIndex.size) {
    return <div className="text-center text-lg text-game-dark">No grid selected.</div>;
  }

  const gridSize = selectedGridIndex.size;

  // When a cell is clicked, fill it with the selected color
  const handleCellClick = (row: number, col: number) => {
    void playPingSound();
    setCellColors((prev) => {
      if (prev?.[row]?.[col] === selectedColor) return prev; // no change
      const newGrid = prev.map((arr) => arr.slice());
      if (newGrid[row] !== undefined) {
        newGrid[row][col] = selectedColor;
      }
      return newGrid;
    });
  };

  // Check if all cells are filled
  setIsAllCellsFilled(cellColors.every((row) => row.every((cell) => cell !== null)));

  return (
    <div className="flex flex-col items-center justify-center xs:justify-start gap-5 w-full h-full overflow-visible scrollable-stable">
      {/* Grid */}
      <GenerateGrid gridSize={gridSize} cellColors={cellColors} onCellClick={handleCellClick} />

      {/* Color palette selector */}
      <div className="flex flex-wrap justify-center gap-3">
        {palette.map((color) => (
          <button
            key={color.value}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${color.border} flex items-center justify-center transition-all duration-100
              ${selectedColor === color.value ? 'ring-4 ring-game-orange scale-110 z-10' : ''}
              ${color.isCustom ? '' : color.value}
            `}
            onClick={() => setSelectedColor(color.value)}
            type="button"
          >
            {selectedColor === color.value && (
              <span className="text-xs font-bold text-game-dark">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CustomGridMaker;
