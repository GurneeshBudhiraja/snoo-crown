import { useCallback, useEffect, useRef } from 'react';

function usePlaySound() {
  const globalSoundRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize global sound
    globalSoundRef.current = new Audio('/sounds/theme-song.mp3');
    globalSoundRef.current.loop = true;
    globalSoundRef.current.volume = 0.4;

    // Initialize click sound
    clickSoundRef.current = new Audio('/sounds/button-click.mp3');
    clickSoundRef.current.volume = 0.5;

    // Cleanup
    return () => {
      if (globalSoundRef.current) {
        globalSoundRef.current.pause();
        globalSoundRef.current = null;
      }
      if (clickSoundRef.current) {
        clickSoundRef.current = null;
      }
    };
  }, []);

  const playGameThemeSong = useCallback(async () => {
    if (globalSoundRef.current) {
      try {
        await globalSoundRef.current.play();
      } catch (error) {
        console.warn('Could not play global sound:', error);
      }
    }
  }, []);

  const stopGlobalSound = useCallback(() => {
    if (globalSoundRef.current) {
      globalSoundRef.current.pause();
      globalSoundRef.current.currentTime = 0;
    }
  }, []);

  const playButtonClickSound = useCallback(async () => {
    if (clickSoundRef.current) {
      try {
        // Reset to beginning and play
        clickSoundRef.current.currentTime = 0;
        await clickSoundRef.current.play();
      } catch (error) {
        console.warn('Could not play click sound:', error);
      }
    }
  }, []);

  return {
    playGameThemeSong,
    stopGlobalSound,
    playButtonClickSound,
  };
}

export default usePlaySound;
