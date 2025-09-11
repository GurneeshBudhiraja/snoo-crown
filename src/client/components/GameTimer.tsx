import { useEffect, useState } from 'react';

type TimerState = {
  hours: number;
  minutes: number;
  seconds: number;
};

type GameTimerProps = {
  isActive?: boolean;
  onTimeUpdate?: (time: TimerState) => void;
};

export default function GameTimer({ isActive = true, onTimeUpdate }: GameTimerProps) {
  const [timer, setTimer] = useState<TimerState>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Updates the timer every second
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds += 1;
        if (seconds >= 60) {
          seconds = 0;
          minutes += 1;
        }
        if (minutes >= 60) {
          minutes = 0;
          hours += 1;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  // Notify parent of time updates
  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(timer);
    }
  }, [timer, onTimeUpdate]);

  return (
    <div className="fixed top-2 right-5 text-2xl flex justify-center items-center gap-0.5 text-game-dark bg-game-cream border-4 border-game-dark rounded-full p-1 px-3">
      <span>{timer.hours.toString().padStart(2, '0')}</span>:
      <span>{timer.minutes.toString().padStart(2, '0')}</span>:
      <span>{timer.seconds.toString().padStart(2, '0')}</span>
    </div>
  );
}
