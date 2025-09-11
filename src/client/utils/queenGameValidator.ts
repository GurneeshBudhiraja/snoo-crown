import { CellColor } from '../components/CustomGridMaker';

export type ValidationResult = {
  isValid: boolean;
  violations: {
    rowViolations: number[];
    columnViolations: number[];
    colorRegionViolations: number[][][];
    adjacencyViolations: number[][];
  };
  completionMessage: string | undefined;
};

/**
 * Validates the Queen's game rules for Snoo face placement
 * Rules:
 * 1. Exactly one Snoo face in every row, column, and color region
 * 2. No two Snoo faces can touch each other (not even diagonally)
 */
export function validateQueensGame(
  gridSize: number,
  cellColors: CellColor[][],
  snooPositions: number[][]
): ValidationResult {
  const violations = {
    rowViolations: [] as number[],
    columnViolations: [] as number[],
    colorRegionViolations: [] as number[][][],
    adjacencyViolations: [] as number[][],
  };

  // Check if we have any Snoo faces placed
  if (snooPositions.length === 0) {
    return {
      isValid: false,
      violations,
      completionMessage: undefined,
    };
  }

  // Rule 1: Exactly one Snoo face in every row
  const rowCounts = new Array(gridSize).fill(0);
  snooPositions.forEach(([row]) => {
    if (row !== undefined) {
      rowCounts[row]++;
    }
  });
  rowCounts.forEach((count, row) => {
    // Only flag as violation if there are more than 1 Snoos in a row
    if (count > 1) {
      violations.rowViolations.push(row);
    }
  });

  // Rule 1: Exactly one Snoo face in every column
  const columnCounts = new Array(gridSize).fill(0);
  snooPositions.forEach(([, col]) => {
    if (col !== undefined) {
      columnCounts[col]++;
    }
  });
  columnCounts.forEach((count, col) => {
    // Only flag as violation if there are more than 1 Snoos in a column
    if (count > 1) {
      violations.columnViolations.push(col);
    }
  });

  // Rule 1: Exactly one Snoo face in every color region
  const colorRegions = getColorRegions(gridSize, cellColors);
  colorRegions.forEach((region) => {
    const snooCountInRegion = region.filter(([row, col]) =>
      snooPositions.some(([snooRow, snooCol]) => snooRow === row && snooCol === col)
    ).length;

    // Only flag as violation if there are more than 1 Snoos in a color region
    if (snooCountInRegion > 1) {
      violations.colorRegionViolations.push(region);
    }
  });

  // Rule 2: No two Snoo faces can touch each other (including diagonally)
  for (let i = 0; i < snooPositions.length; i++) {
    for (let j = i + 1; j < snooPositions.length; j++) {
      const position1 = snooPositions[i];
      const position2 = snooPositions[j];

      if (position1 && position2) {
        const [row1, col1] = position1;
        const [row2, col2] = position2;

        // Check if they are adjacent (including diagonally)
        if (row1 !== undefined && col1 !== undefined && row2 !== undefined && col2 !== undefined) {
          const rowDiff = Math.abs(row1 - row2);
          const colDiff = Math.abs(col1 - col2);

          if (rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0)) {
            violations.adjacencyViolations.push([row1, col1], [row2, col2]);
          }
        }
      }
    }
  }

  const hasViolations =
    violations.rowViolations.length > 0 ||
    violations.columnViolations.length > 0 ||
    violations.colorRegionViolations.length > 0 ||
    violations.adjacencyViolations.length > 0;

  // Check if game is complete: all rows, columns, and color regions have exactly one Snoo
  const allRowsHaveOneSnoo = rowCounts.every((count) => count === 1);
  const allColumnsHaveOneSnoo = columnCounts.every((count) => count === 1);
  const allColorRegionsHaveOneSnoo = colorRegions.every((region) => {
    const snooCountInRegion = region.filter(([row, col]) =>
      snooPositions.some(([snooRow, snooCol]) => snooRow === row && snooCol === col)
    ).length;
    return snooCountInRegion === 1;
  });

  const completionMessage =
    !hasViolations && allRowsHaveOneSnoo && allColumnsHaveOneSnoo && allColorRegionsHaveOneSnoo
      ? '🎉 Game Complete! 🎉'
      : undefined;

  return {
    isValid: !hasViolations,
    violations,
    completionMessage,
  };
}

/**
 * Groups cells by their color to identify color regions
 */
function getColorRegions(gridSize: number, cellColors: CellColor[][]): number[][][] {
  const colorMap = new Map<string, number[][]>();

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const color = cellColors[row]?.[col];
      if (color) {
        if (!colorMap.has(color)) {
          colorMap.set(color, []);
        }
        colorMap.get(color)!.push([row, col]);
      }
    }
  }

  return Array.from(colorMap.values());
}

/**
 * Gets all cells that have violations for visual highlighting
 */
export function getViolationCells(
  gridSize: number,
  violations: ValidationResult['violations']
): number[][] {
  const violationCells: number[][] = [];

  // Add row violations
  violations.rowViolations.forEach((row) => {
    for (let col = 0; col < gridSize; col++) {
      violationCells.push([row, col]);
    }
  });

  // Add column violations
  violations.columnViolations.forEach((col) => {
    for (let row = 0; row < gridSize; row++) {
      violationCells.push([row, col]);
    }
  });

  // Add color region violations
  violations.colorRegionViolations.forEach((region) => {
    region.forEach(([row, col]) => {
      if (row !== undefined && col !== undefined) {
        violationCells.push([row, col]);
      }
    });
  });

  // Add adjacency violations
  violations.adjacencyViolations.forEach(([row, col]) => {
    if (row !== undefined && col !== undefined) {
      violationCells.push([row, col]);
    }
  });

  // Remove duplicates
  const uniqueViolations = violationCells.filter(
    ([row, col], index, self) => index === self.findIndex(([r, c]) => r === row && c === col)
  );

  return uniqueViolations;
}
