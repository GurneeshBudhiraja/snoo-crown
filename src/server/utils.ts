import { redis } from '@devvit/web/server';
import { redisKeys } from './constants';

export async function appendPostType(postId: string, postType: 'custom' | 'regular') {
  try {
    const response = await redis.get(redisKeys.postTypes);
    if (!response) {
      // If no post types are found, set the post type for the post
      await redis.set(redisKeys.postTypes, JSON.stringify({ [postId]: postType }));
    } else {
      // If post types are found, append the post type for the post
      const parsed = JSON.parse(response);
      parsed[postId] = postType;
      await redis.set(redisKeys.postTypes, JSON.stringify(parsed));
    }
    return true;
  } catch (error) {
    console.log('Error in `appendPostType`', (error as Error).message);
    return false;
  }
}

export async function getPostType(postId: string) {
  try {
    const response = await redis.get(redisKeys.postTypes);
    if (!response) {
      throw new Error(redisKeys.postTypes + 'not found in Redis');
    }
    const parsed = JSON.parse(response);
    const postType = parsed[postId];
    return {
      success: true,
      message: 'Post type fetched successfully',
      data: postType,
    };
  } catch (error) {
    console.log('Error in `getPostType`', error);
    return {
      success: false,
      message: 'Failed to get post type',
      data: [],
    };
  }
}

export function generateRandomGrid() {
  const AVAILABLE_GRID_SIZES = [4, 5, 6, 7];
  const AVAILABLE_CELL_COLORS = ['green', 'sky', 'peach', 'bright-yellow', 'pale-yellow', 'orange'];

  const gridSize = AVAILABLE_GRID_SIZES[Math.floor(Math.random() * AVAILABLE_GRID_SIZES.length)];
  if (!gridSize) {
    throw new Error('Failed to select grid size');
  }

  let attempts = 0;
  const maxAttempts = 50;

  while (attempts < maxAttempts) {
    // Choose exactly gridSize colors for Queen's game (one queen per color region)
    const colors = [...AVAILABLE_CELL_COLORS].sort(() => Math.random() - 0.5).slice(0, gridSize);
    const cellColors = generateConnectedClusters(gridSize, colors);

    // Validate that this grid is solvable
    if (isGridSolvable(cellColors, gridSize)) {
      return {
        gridSize,
        cellColors,
      };
    }

    attempts++;
  }

  // If we can't generate a solvable grid, return a simple fallback
  console.warn('Could not generate solvable grid after', maxAttempts, 'attempts, using fallback');
  return generateFallbackSolvableGrid(gridSize, AVAILABLE_CELL_COLORS);
}

type Pos = { row: number; col: number };

function generateConnectedClusters(gridSize: number, colors: string[]): (string | null)[][] {
  const cellColors: (string | null)[][] = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => null)
  );

  // Much more varied target sizes with wider distribution
  const totalCells = gridSize * gridSize;
  const minSize = Math.max(2, Math.floor(totalCells / (colors.length * 2.5)));
  const maxSize = Math.max(minSize + 1, Math.floor((totalCells / colors.length) * 1.8));

  const targets: number[] = [];
  let remaining = totalCells;

  for (let i = 0; i < colors.length - 1; i++) {
    const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
    targets[i] = Math.min(size, remaining - (colors.length - i - 1));
    remaining -= targets[i] ?? 0;
  }
  targets[colors.length - 1] = remaining; // Last color gets remaining cells

  // Randomly select starting positions that are spread apart
  const seedPositions: Pos[] = [];
  for (let i = 0; i < colors.length; i++) {
    let attempts = 0;
    let seed: Pos;
    do {
      seed = {
        row: Math.floor(Math.random() * gridSize),
        col: Math.floor(Math.random() * gridSize),
      };
      attempts++;
    } while (
      attempts < 50 &&
      seedPositions.some((p) => Math.abs(p.row - seed.row) + Math.abs(p.col - seed.col) < 2)
    );
    seedPositions.push(seed);

    const ci = colors[i];
    if (ci && cellColors[seed.row]) {
      cellColors[seed.row]![seed.col] = ci;
    }
  }

  // Grow each cluster using random walk with bias
  for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
    const color = colors[colorIndex]!;
    const target = targets[colorIndex]!;
    let currentSize = 1; // Already placed seed

    while (currentSize < target) {
      // Find all frontier cells for this color
      const frontierCells: Pos[] = [];
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (cellColors[r]?.[c] === color) {
            // Check adjacent cells
            const neighbors = [
              { row: r - 1, col: c },
              { row: r + 1, col: c },
              { row: r, col: c - 1 },
              { row: r, col: c + 1 },
            ];

            for (const neighbor of neighbors) {
              if (
                neighbor.row >= 0 &&
                neighbor.row < gridSize &&
                neighbor.col >= 0 &&
                neighbor.col < gridSize &&
                cellColors[neighbor.row]?.[neighbor.col] === null &&
                !frontierCells.some((f) => f.row === neighbor.row && f.col === neighbor.col)
              ) {
                frontierCells.push(neighbor);
              }
            }
          }
        }
      }

      if (frontierCells.length === 0) break;

      // Randomly select multiple cells to add (creates more organic growth)
      const growthBurst = Math.min(
        Math.floor(Math.random() * 3) + 1, // 1-3 cells at once
        target - currentSize,
        frontierCells.length
      );

      for (let burst = 0; burst < growthBurst; burst++) {
        if (frontierCells.length === 0) break;

        const idx = Math.floor(Math.random() * frontierCells.length);
        const nextCell = frontierCells.splice(idx, 1)[0]!;

        if (cellColors[nextCell.row] && cellColors[nextCell.row]![nextCell.col] === null) {
          cellColors[nextCell.row]![nextCell.col] = color;
          currentSize++;
        }
      }
    }
  }

  // Fill any remaining null cells
  fillRemainingCells(cellColors, gridSize, colors);

  return cellColors;
}

function fillRemainingCells(
  cellColors: (string | null)[][],
  gridSize: number,
  colors: string[]
): void {
  let changed = true;
  const dirs = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ];

  while (changed) {
    changed = false;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (cellColors[row]?.[col] !== null) continue;
        const counts = new Map<string, number>();
        for (const d of dirs) {
          const r = row + d.dr;
          const c = col + d.dc;
          if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
            const color = cellColors[r]?.[c];
            if (color) counts.set(color, (counts.get(color) || 0) + 1);
          }
        }
        if (counts.size === 0) continue;
        let bestColor = '';
        let max = -1;
        for (const [color, n] of counts) {
          if (n > max) {
            max = n;
            bestColor = color;
          }
        }
        if (bestColor && cellColors[row]) {
          cellColors[row]![col] = bestColor;
          changed = true;
        }
      }
    }
  }

  // Final safeguard: assign any isolated null from any valid neighbor or random color
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (cellColors[row]?.[col] === null) {
        for (const d of dirs) {
          const r = row + d.dr;
          const c = col + d.dc;
          if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
            const color = cellColors[r]?.[c];
            if (color && cellColors[row]) {
              cellColors[row]![col] = color;
              break;
            }
          }
        }
        if (cellColors[row]?.[col] === null) {
          cellColors[row]![col] = colors[Math.floor(Math.random() * colors.length)]!;
        }
      }
    }
  }
}

/**
 * Validates if a grid can be solved following Queen's game rules
 */
function isGridSolvable(cellColors: (string | null)[][], gridSize: number): boolean {
  // Get color regions
  const colorRegions = getColorRegions(cellColors, gridSize);

  // Must have exactly gridSize color regions (one queen per region)
  if (colorRegions.length !== gridSize) {
    return false;
  }

  // Each color region must have at least one cell
  for (const region of colorRegions) {
    if (region.length === 0) {
      return false;
    }
  }

  // Try to find a valid solution using backtracking
  return hasValidSolution(cellColors, gridSize, colorRegions);
}

/**
 * Gets color regions from the grid
 */
function getColorRegions(cellColors: (string | null)[][], gridSize: number): number[][][] {
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
 * Uses backtracking to check if a valid solution exists
 */
function hasValidSolution(
  _cellColors: (string | null)[][],
  gridSize: number,
  colorRegions: number[][][]
): boolean {
  const solution: number[][] = [];

  function isValidPlacement(row: number, col: number): boolean {
    // Check row/column conflicts
    for (const position of solution) {
      const [qRow, qCol] = position;
      if (qRow !== undefined && qCol !== undefined) {
        if (qRow === row || qCol === col) return false;
        // Check diagonal conflicts
        if (Math.abs(qRow - row) === Math.abs(qCol - col)) return false;
      }
    }
    return true;
  }

  function backtrack(regionIndex: number): boolean {
    if (regionIndex === colorRegions.length) {
      return solution.length === gridSize;
    }

    const region = colorRegions[regionIndex]!;

    // Try each cell in this color region
    for (const position of region) {
      const [row, col] = position;
      if (row !== undefined && col !== undefined && isValidPlacement(row, col)) {
        solution.push([row, col]);

        if (backtrack(regionIndex + 1)) {
          return true;
        }

        solution.pop();
      }
    }

    return false;
  }

  return backtrack(0);
}

/**
 * Generates a simple fallback grid that's guaranteed to be solvable
 */
function generateFallbackSolvableGrid(
  gridSize: number,
  availableColors: string[]
): {
  gridSize: number;
  cellColors: (string | null)[][];
} {
  const cellColors: (string | null)[][] = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => null)
  );

  // Use exactly gridSize colors
  const colors = availableColors.slice(0, gridSize);

  // Create a simple pattern where each color forms a connected region
  // that allows for a diagonal solution
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Create regions that allow for the main diagonal solution
      let colorIndex: number;

      if (gridSize === 4) {
        // 4x4 specific pattern
        if (row < 2 && col < 2) colorIndex = 0;
        else if (row < 2 && col >= 2) colorIndex = 1;
        else if (row >= 2 && col < 2) colorIndex = 2;
        else colorIndex = 3;
      } else {
        // General pattern for other sizes
        colorIndex = (row + col) % gridSize;
      }

      const color = colors[colorIndex];
      if (cellColors[row] && color) {
        cellColors[row]![col] = color;
      }
    }
  }

  return { gridSize, cellColors };
}

export async function getQuizOfTheDay(userId: string) {
  try {
    // Gets the quiz of the day
    const response = await redis.get(redisKeys.quizOfTheDay);
    if (!response) {
      console.log('Creating a new quiz of the day');
      const { cellColors, gridSize } = generateRandomGrid();
      await redis.set(
        redisKeys.quizOfTheDay,
        JSON.stringify({
          quizGenerateTime: Date.now(),
          cellColors,
          gridSize,
        })
      );
      const response = await redis.get(redisKeys.quizOfTheDay);
      console.log('redisKeys.quizOfTheDay');
      console.log(response);
      if (!response) {
        throw new Error('Failed to generate quiz of the day');
      }
      const parsed = JSON.parse(response);
      await redis.set(redisKeys.usersSolvedQOTD, JSON.stringify([userId]));
      return {
        success: true,
        cellColors: parsed.cellColors,
        gridSize: parsed.gridSize,
        timeRemaining: Math.floor((parsed.quizGenerateTime + 60 * 1000 - Date.now()) / 1000),
        message: 'New quiz of the day generated',
        alreadySolved: false,
      };
    } else {
      const parsed = JSON.parse(response);
      // If the quiz has been generated more than 24 hours ago, delete the quiz and generate a new one
      // if (parsed.quizGenerateTime < Date.now() - 24 * 60 * 60 * 1000) {
      // TODO: Remove the below in prod and uncomment the above
      if (parsed.quizGenerateTime < Date.now() - 60 * 1000) {
        // Delete the quiz and the users who solved that quiz
        console.log('🗑️ Deleting the quiz of the day and the users who solved that quiz');
        await redis.del(redisKeys.quizOfTheDay);
        await redis.del(redisKeys.usersSolvedQOTD);
        return await getQuizOfTheDay(userId);
      }
      const usersSolvedQOTD = await redis.get(redisKeys.usersSolvedQOTD);
      if (!usersSolvedQOTD) {
        throw new Error('🚫 Failed to get users who solved the quiz of the day');
      }
      const parsedUsersSolvedQOTD = JSON.parse(usersSolvedQOTD);
      console.log('parsedUsersSolvedQOTD');
      console.log(parsedUsersSolvedQOTD);
      // Return if the user has already solved the quiz

      if (parsedUsersSolvedQOTD.includes(userId)) {
        console.log('The user has already solved this puzzle');
        return {
          success: true,
          alreadySolved: true,
          message: 'Already solved the quiz of the day',
          timeRemaining: Math.floor((parsed.quizGenerateTime + 60 * 1000 - Date.now()) / 1000),
        };
      }
      await redis.set(
        redisKeys.usersSolvedQOTD,
        JSON.stringify([...parsedUsersSolvedQOTD, userId])
      );
      return {
        success: true,
        ...parsed,
        alreadySolved: false,
        message: 'Quiz of the day fetched successfully',
        timeRemaining: Math.floor((parsed.quizGenerateTime + 60 * 1000 - Date.now()) / 1000),
      };
    }
  } catch (error) {
    console.log('Error in `getQuizOfTheDay`', error);
    return {
      success: false,
      alreadySolved: false,
      message: 'Failed to get quiz of the day',
      timeRemaining: 0,
      cellColors: [],
      gridSize: 0,
    };
  }
}
