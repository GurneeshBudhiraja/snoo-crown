import { useEffect, useState, useRef } from 'react';
import GameCell, { CellState } from './GameCell';
import { CellColor } from './CustomGridMaker';
import { ValidationResult, getViolationCells } from '../utils/queenGameValidator';

type GameGridProps = {
  gridSize: number;
  cellColors: CellColor[][];
  onCellClick: (row: number, col: number) => void;
  validationResult: ValidationResult | undefined;
  onValidationRequest: (snooPositions: number[][]) => void;
};

export default function GameGrid({
  gridSize,
  cellColors,
  onCellClick,
  validationResult,
  onValidationRequest,
}: GameGridProps) {
  // Tracks the state of each cell. 0 = blank, 1 = Cross marker, 2 = Snoo icon
  const [cellStates, setCellStates] = useState<CellState[][]>(() =>
    Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => 0))
  );

  const gridRef = useRef<HTMLDivElement>(null);

  // If gridSize changes, reset cellStates
  useEffect(() => {
    setCellStates(
      Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => 0))
    );
  }, [gridSize]);

  const handleCellClick = (rowIdx: number, colIdx: number) => {
    setCellStates((prev) => {
      const newStates = prev.map((row) => [...row]);
      // Defensive: ensure row exists
      if (!newStates[rowIdx]) newStates[rowIdx] = [];
      const current = newStates[rowIdx][colIdx] ?? 0;
      if (current === 0) {
        // Show X marker
        newStates[rowIdx][colIdx] = 1;
      } else if (current === 1) {
        // Show Snoo icon
        newStates[rowIdx][colIdx] = 2;
      } else {
        // Back to blank
        newStates[rowIdx][colIdx] = 0;
      }
      return newStates;
    });
    onCellClick(rowIdx, colIdx);
  };

  // Get current Snoo positions and validate whenever cell states change
  useEffect(() => {
    const snooPositions: number[][] = [];
    cellStates.forEach((row, rowIdx) => {
      row.forEach((cellState, colIdx) => {
        if (cellState === 2) {
          // Snoo icon
          snooPositions.push([rowIdx, colIdx]);
        }
      });
    });

    if (onValidationRequest) {
      onValidationRequest(snooPositions);
    }
  }, [cellStates, onValidationRequest]);

  // Get violation cells for visual feedback
  const violationCells = validationResult
    ? getViolationCells(gridSize, validationResult.violations)
    : [];

  return (
    <div className="relative">
      <div
        ref={gridRef}
        className="grid bg-transparent"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: gridSize }).map((_, rowIdx) =>
          Array.from({ length: gridSize }).map((_, colIdx) => {
            const color = cellColors?.[rowIdx]?.[colIdx];
            const cellState = cellStates?.[rowIdx]?.[colIdx] ?? 0;
            const hasViolation = violationCells.some(
              ([vRow, vCol]) => vRow === rowIdx && vCol === colIdx
            );

            return (
              <GameCell
                key={`${rowIdx}-${colIdx}`}
                rowIdx={rowIdx}
                colIdx={colIdx}
                gridSize={gridSize}
                cellState={cellState}
                cellColor={color ?? 'cream'}
                hasViolation={hasViolation}
                onClick={handleCellClick}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
