import React from 'react';
import useSound from '../hooks/useSound';

type GameButtonProps = {
  text: string;
  onClick?: () => void;
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
        className={`relative px-8 py-3 text-2xl tracking-wide transition duration-75 ease-linear disabled:cursor-not-allowed font-bold font-ibm border-4 border-black active:scale-95 shadow-game-button active:shadow-none active:translate-y-1 active:translate-x-3 focus:outline-none focus-visible:ring focus-visible:ring-game-dark focus-visible:ring-offset-2 focus-visible:ring-offset-game-cream cursor-pointer rounded-xs ${className}`}
        onClick={handleClick}
        disabled={disabled}
      >
        <span>{text}</span>
      </button>
    </>
  );
}
