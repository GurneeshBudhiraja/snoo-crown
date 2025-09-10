import { LoaderCircleIcon } from 'lucide-react';
import useSound from '../hooks/useSound';
import { cn } from '../util';

export type GameButtonProps = {
  text: string;
  onClick?: (() => void) | null;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  forCustomPost?: boolean;
};

export default function GameButton({
  text,
  onClick,
  className = '',
  disabled = false,
  loading = false,
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
          'relative max-w-2xs w-full p-2 rounded-md flex items-center justify-center',
          'text-2xl tracking-wide font-bold font-ibm',
          'border-4 border-black',
          'shadow-game-button',
          'transition duration-75 ease-linear',
          'focus:outline-none',
          !disabled && [
            'active:shadow-none',
            'active:scale-95 active:translate-y-1 active:translate-x-3',
            'focus-visible:ring-4 focus-visible:ring-game-dark focus-visible:ring-offset-2 focus-visible:ring-offset-game-cream',
            'cursor-pointer',
          ],
          disabled && ['opacity-50', 'cursor-not-allowed'],
          className
        )}
        onClick={handleClick}
        disabled={disabled}
      >
        <span>
          {loading ? (
            <LoaderCircleIcon className="animate-spin h-8 text-game-dark" strokeWidth={4} />
          ) : (
            text
          )}
        </span>
      </button>
    </>
  );
}
