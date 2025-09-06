import useSound from '../hooks/useSound';
import { cn } from '../util';

export type GameButtonProps = {
  text: string;
  onClick?: (() => void) | null;
  className?: string;
  disabled?: boolean;
};

export default function GameButton({
  text,
  onClick,
  className = '',
  disabled = false,
}: GameButtonProps) {
  const { playButtonClickSound } = useSound();
  const handleClick = async () => {
    await playButtonClickSound();
    if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          // layout & sizing
          'relative max-w-2xs w-full p-2 rounded-md',
          // typography
          'text-2xl tracking-wide font-bold font-ibm',
          // borders
          'border-4 border-black',
          // shadows
          'shadow-game-button active:shadow-none',
          // transitions & animation
          'transition duration-75 ease-linear active:scale-95 active:translate-y-1 active:translate-x-3',
          // state & accessibility
          'focus:outline-none focus-visible:ring focus-visible:ring-game-dark focus-visible:ring-offset-2 focus-visible:ring-offset-game-cream',
          'disabled:cursor-not-allowed cursor-pointer',
          className
        )}
        onClick={handleClick}
        disabled={disabled}
      >
        <span>{text}</span>
      </button>
    </>
  );
}
