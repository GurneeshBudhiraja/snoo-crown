import { X } from 'lucide-react';
import { SnooFaceSVG } from '../assets/assets';
import { cn } from '../util';
import { CellColor } from './CustomGridMaker';

export type CellState = 0 | 1 | 2; // 0 = blank, 1 = X marker, 2 = Snoo icon

type GameCellProps = {
  rowIdx: number;
  colIdx: number;
  gridSize: number;
  cellState: CellState;
  cellColor: CellColor;
  hasViolation: boolean;
  onClick: (row: number, col: number) => void;
};

export default function GameCell({
  rowIdx,
  colIdx,
  gridSize,
  cellState,
  cellColor,
  hasViolation,
  onClick,
}: GameCellProps) {
  return (
    <button
      key={`${rowIdx}-${colIdx}`}
      className={cn(
        'w-10 sm:w-14 aspect-square border-2 border-game-dark flex items-center justify-center text-game-dark transition-all duration-100 focus:outline-none cursor-pointer relative',
        [
          rowIdx === 0 && colIdx === 0 && 'rounded-tl-lg',
          rowIdx === 0 && colIdx === gridSize - 1 && 'rounded-tr-lg',
          rowIdx === gridSize - 1 && colIdx === 0 && 'rounded-bl-lg',
          rowIdx === gridSize - 1 && colIdx === gridSize - 1 && 'rounded-br-lg',
        ],
        cellColor ? `bg-game-${cellColor}` : 'bg-game-cream'
      )}
      style={{
        background: undefined,
        boxShadow: cellColor ? '0 2px 8px 0 rgba(0,0,0,0.10)' : undefined,
      }}
      aria-label={`Cell ${rowIdx + 1}, ${colIdx + 1}`}
      onClick={() => onClick(rowIdx, colIdx)}
    >
      {cellState === 1 && <X className="w-6 h-6 text-game-dark" />}
      {cellState === 2 && (
        <img
          src={SnooFaceSVG}
          alt="Snoo Face"
          className="inline w-5 2xs:w-10 aspect-square object-cover"
          draggable={false}
          style={{ display: 'inline', verticalAlign: 'middle' }}
        />
      )}
      {/* Red overlay for violations */}
      {hasViolation && <div className="absolute inset-0 bg-red-500/70 pointer-events-none" />}
    </button>
  );
}
