import React, { useState } from 'react';

const DEFAULT_COLORS = [
  '#ffffff', // white
  '#f87171', // red-400
  '#fbbf24', // yellow-400
  '#34d399', // green-400
  '#60a5fa', // blue-400
  '#a78bfa', // purple-400
  '#f472b6', // pink-400
  '#d1d5db', // gray-300
  '#000000', // black
];

// Checks if all blocks are filled with a non-default color
function isGridFilled(blockColors: string[], defaultColor: string) {
  return blockColors.every((color) => color !== defaultColor);
}

// Checks if the grid is solvable
function isQueensSolvable(blockColors: string[], size: number): boolean {
  const allowed: boolean[][] = [];
  for (let r = 0; r < size; r++) {
    allowed[r] = [];
    for (let c = 0; c < size; c++) {
      allowed[r]![c] = blockColors[r * size + c] !== '#000000';
    }
  }

  function solve(row: number, cols: Set<number>, diag1: Set<number>, diag2: Set<number>): boolean {
    if (row === size) return true;
    for (let col = 0; col < size; col++) {
      if (
        allowed[row] &&
        allowed[row][col] &&
        !cols.has(col) &&
        !diag1.has(row - col) &&
        !diag2.has(row + col)
      ) {
        cols.add(col);
        diag1.add(row - col);
        diag2.add(row + col);
        if (solve(row + 1, cols, diag1, diag2)) return true;
        cols.delete(col);
        diag1.delete(row - col);
        diag2.delete(row + col);
      }
    }
    return false;
  }

  return solve(0, new Set(), new Set(), new Set());
}

// Checks if all colored blocks of the same color are grouped together
function areColorBlocksGrouped(blockColors: string[], size: number): boolean {
  console.log('blockColors');
  console.log(blockColors);

  // Only check for non-white, non-black colors
  const colorSet = new Set(
    blockColors.filter((c) => c !== DEFAULT_COLORS[0] && c !== DEFAULT_COLORS[8])
  );
  console.log(colorSet);

  for (const color of colorSet) {
    // Find all indices of this color
    const indices = blockColors.map((c, i) => (c === color ? i : -1)).filter((i) => i !== -1);

    if (indices.length === 0) continue;

    // BFS from the first index
    const queue: number[] = [indices[0] ?? 0];
    const localVisited = new Set<number>([indices[0] ?? 0]);

    while (queue.length > 0) {
      const idx = queue.shift()!;
      const row = Math.floor(idx / size);
      const col = idx % size;

      // Check 4 directions
      const neighbors = [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1],
      ];

      for (const [nr, nc] of neighbors) {
        if (nr !== undefined && nr >= 0 && nr < size && nc !== undefined && nc >= 0 && nc < size) {
          const nIdx = nr * size + nc;
          if (blockColors[nIdx] === color && !localVisited.has(nIdx)) {
            localVisited.add(nIdx);
            queue.push(nIdx);
          }
        }
      }
    }

    // If not all indices of this color are connected, fail
    if (localVisited.size !== indices.length) {
      return false;
    }
  }

  return true;
}

function GridDesign({ gridSelection }: { gridSelection: string | null }) {
  const size = gridSelection ? parseInt(gridSelection, 10) : 0;
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);
  const [blockColors, setBlockColors] = useState<string[]>(
    Array(size * size).fill(DEFAULT_COLORS[0])
  );
  const [showVerify, setShowVerify] = useState(false);
  const [verifyResult, setVerifyResult] = useState<null | boolean>(null);
  const [groupError, setGroupError] = useState<string | null>(null);

  // Reset block colors and verification state when grid size changes
  React.useEffect(() => {
    setBlockColors(Array(size * size).fill(DEFAULT_COLORS[0]));
    setShowVerify(false);
    setVerifyResult(null);
    setGroupError(null);
  }, [size]);

  // Show verify button when all blocks are filled and color groups are valid
  React.useEffect(() => {
    if (isGridFilled(blockColors, DEFAULT_COLORS[0] ?? '')) {
      if (!areColorBlocksGrouped(blockColors, size)) {
        setShowVerify(false);
        setGroupError(
          'All colored blocks (except white/black) must be grouped together, not spread out.'
        );
      } else {
        setShowVerify(true);
        setGroupError(null);
      }
    } else {
      setShowVerify(false);
      setVerifyResult(null);
      setGroupError(null);
    }
  }, [blockColors, size]);

  const handleBlockClick = (idx: number) => {
    setBlockColors((prev) => {
      const next = [...prev];
      next[idx] = selectedColor ?? '';
      return next;
    });
  };

  const handleVerify = () => {
    if (!size) return;
    if (!areColorBlocksGrouped(blockColors, size)) {
      setGroupError(
        'All colored blocks (except white/black) must be grouped together, not spread out.'
      );
      setVerifyResult(null);
      return;
    }
    setGroupError(null);
    const solvable = isQueensSolvable(blockColors, size);
    setVerifyResult(solvable);
  };

  if (!size) {
    return (
      <div className="text-center text-gray-500">
        Please select a grid size to design your grid.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-2xl font-bold mb-2 text-blue-900">Design Your Grid</h2>
      {/* Color Picker */}
      <div className="flex flex-wrap gap-3 mb-4">
        {DEFAULT_COLORS.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color
                ? 'border-yellow-400 scale-110 ring-2 ring-yellow-200'
                : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select color ${color}`}
            type="button"
          />
        ))}
      </div>
      {/* Grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${size}, 2rem)`,
          gridTemplateRows: `repeat(${size}, 2rem)`,
        }}
      >
        {blockColors.map((color, idx) => (
          <button
            key={idx}
            className={`w-8 h-8 shadow-sm focus:outline-none border border-gray-300`}
            style={{ backgroundColor: color }}
            onClick={() => handleBlockClick(idx)}
            aria-label={`Block ${idx + 1}`}
            type="button"
          />
        ))}
      </div>
      {/* Grouping Error */}
      {groupError && (
        <div className="mt-4 text-red-600 text-base font-semibold text-center">{groupError}</div>
      )}
      {/* Verify Button */}
      {showVerify && (
        <button
          className="mt-6 px-6 py-2 bg-yellow-400 text-blue-900 font-bold rounded-lg shadow-lg hover:bg-yellow-300 transition-all"
          onClick={handleVerify}
          type="button"
        >
          Verify Solvability
        </button>
      )}
      {/* Verification Result */}
      {verifyResult !== null && (
        <div
          className={`mt-4 text-lg font-semibold ${
            verifyResult ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {verifyResult
            ? "This grid is solvable for the Queen's Game!"
            : "This grid is NOT solvable for the Queen's Game."}
        </div>
      )}
    </div>
  );
}

export default GridDesign;
