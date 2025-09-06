import React from 'react';
import useSound from '../hooks/useSound';

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
        className={`relative p-2 text-2xl tracking-wide transition duration-75 ease-linear disabled:cursor-not-allowed font-bold font-ibm border-4 border-black active:scale-95 shadow-game-button active:shadow-none active:translate-y-1 active:translate-x-3 focus:outline-none focus-visible:ring focus-visible:ring-game-dark focus-visible:ring-offset-2 focus-visible:ring-offset-game-cream cursor-pointer max-w-2xs w-full rounded-md   ${className}`}
        onClick={handleClick}
        disabled={disabled}
      >
        <span>{text}</span>
      </button>
    </>
  );
}
