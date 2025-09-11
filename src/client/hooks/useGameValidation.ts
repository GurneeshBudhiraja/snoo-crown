import { useState, useCallback } from 'react';
import { validateQueensGame, ValidationResult } from '../utils/queenGameValidator';
import { CellColor } from '../components/CustomGridMaker';

type UseGameValidationProps = {
  gridSize: number;
  cellColors: CellColor[][];
};

export function useGameValidation({ gridSize, cellColors }: UseGameValidationProps) {
  const [validationResult, setValidationResult] = useState<ValidationResult | undefined>();
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  const validateGameState = useCallback(
    (snooPositions: number[][]) => {
      const result = validateQueensGame(gridSize, cellColors, snooPositions);
      setValidationResult(result);

      if (result.completionMessage) {
        setShowCompletionMessage(true);
      }
    },
    [gridSize, cellColors]
  );

  const resetValidation = useCallback(() => {
    setValidationResult(undefined);
    setShowCompletionMessage(false);
  }, []);

  return {
    validationResult,
    showCompletionMessage,
    validateGameState,
    resetValidation,
  };
}
