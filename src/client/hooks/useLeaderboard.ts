import { useState, useEffect } from 'react';
import { LeaderboardStats } from '../../shared/types/api';

type LeaderboardResponse = {
  success: boolean;
  data: LeaderboardStats[];
  currentUserId?: string;
  message: string;
};

export function useLeaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardStats[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/leaderboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LeaderboardResponse = await response.json();
      console.log('Leaderboard API Response:', data);

      if (data.success) {
        setLeaderboardData(data.data || []);
        setCurrentUserId(data.currentUserId || null);
      } else {
        throw new Error(data.message || 'Failed to fetch leaderboard data');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setLeaderboardData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: LeaderboardResponse = await response.json();
      console.log('Leaderboard API Response:', data);
    } catch (error) {
      console.error('Error deleting leaderboard:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setLeaderboardData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchLeaderboard();
  }, []);

  return {
    leaderboardData,
    currentUserId,
    isLoading,
    error,
    refetch: fetchLeaderboard,
    deleteLeaderboard,
  };
}
