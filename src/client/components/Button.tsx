import { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export function Button({ children, onClick, variant = 'primary', className = '' }: ButtonProps) {
  const baseClasses =
    'px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95';

  const variantClasses = {
    primary:
      'bg-[var(--color-game-orange)] text-white shadow-lg hover:shadow-xl hover:bg-[var(--color-game-black)]',
    secondary:
      'bg-[var(--color-game-sky)] text-white shadow-lg hover:shadow-xl hover:bg-[var(--color-game-green)]',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ fontFamily: 'var(--font-game)' }}
    >
      {children}
    </button>
  );
}
