import { useCallback, useEffect, useRef, useState } from 'react';

function useSound() {
  const themeSongRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const [isGameThemeSongPlaying, setIsGameThemeSongPlaying] = useState(false);

  useEffect(() => {
    // Initialize global sound
    themeSongRef.current = new Audio('/sounds/theme-song.mp3');
    themeSongRef.current.loop = true;
    themeSongRef.current.volume = 0.5;

    // Initialize button click sound
    clickSoundRef.current = new Audio('/sounds/button-click.mp3');
    clickSoundRef.current.volume = 0.5;

    // Cleanup function
    return () => {
      // Reset the state
      setIsGameThemeSongPlaying(false);

      // Reset the theme song ref
      if (themeSongRef.current) {
        themeSongRef.current.pause();
        themeSongRef.current = null;
      }
      // Reset the button click sound ref

      if (clickSoundRef.current) {
        clickSoundRef.current.pause();
        clickSoundRef.current = null;
      }
    };
  }, []);

  // Plays the theme song
  const playGameThemeSong = useCallback(async () => {
    if (themeSongRef.current) {
      try {
        await themeSongRef.current.play();
        setIsGameThemeSongPlaying(true);
        console.log('Theme song playing');
      } catch (error) {
        console.log('Failed to play theme song', error);
        setIsGameThemeSongPlaying(false);
      }
    }
  }, []);

  // Stops the theme song
  const stopGameThemeSong = useCallback(() => {
    if (themeSongRef.current) {
      themeSongRef.current.pause();
      setIsGameThemeSongPlaying(false);
    }
  }, []);

  // Utility function to toggle the theme song
  const toggleGameThemeSong = useCallback(async () => {
    if (isGameThemeSongPlaying) {
      stopGameThemeSong();
    } else {
      await playGameThemeSong();
    }
  }, [isGameThemeSongPlaying, stopGameThemeSong, playGameThemeSong]);

  // Plays the button click sound
  const playButtonClickSound = useCallback(async () => {
    if (clickSoundRef.current) {
      try {
        clickSoundRef.current.currentTime = 0;
        await clickSoundRef.current.play();
      } catch (error) {
        console.warn('Error playing button click sound', error);
      }
    }
  }, []);

  return {
    playButtonClickSound,
    isGameThemeSongPlaying,
    setIsGameThemeSongPlaying,
    playGameThemeSong,
    stopGameThemeSong,
    toggleGameThemeSong,
  };
}

export default useSound;
