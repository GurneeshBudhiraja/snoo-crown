import { useState } from 'react';

type UpsertLeaderboardParams = {
  timeTaken: number;
  score: number;
};

type UpsertResponse = {
  success: boolean;
  data: any[];
  message: string;
};

export function useLeaderboardUpsert() {
  const [isUpsertLoading, setIsUpsertLoading] = useState(false);
  const [upsertError, setUpsertError] = useState<string | null>(null);

  const upsertLeaderboard = async ({ timeTaken, score }: UpsertLeaderboardParams) => {
    try {
      setIsUpsertLoading(true);
      setUpsertError(null);

      console.log('Upserting leaderboard with:', { timeTaken, score });

      const response = await fetch('/api/leaderboard/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timeTaken, score }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpsertResponse = await response.json();
      console.log('Leaderboard Upsert API Response:', data);

      if (data.success) {
        console.log('✅ Leaderboard updated successfully:', data.message);
        return { success: true, data: data.data };
      } else {
        throw new Error(data.message || 'Failed to update leaderboard');
      }
    } catch (error) {
      console.error('❌ Error upserting leaderboard:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setUpsertError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpsertLoading(false);
    }
  };

  return {
    upsertLeaderboard,
    isUpsertLoading,
    upsertError,
  };
}
