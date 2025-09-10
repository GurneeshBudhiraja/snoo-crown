import { cn } from '../util';

function IconButton({
  icon,
  onClick,
  altText,
  className,
  imageClassName,
}: {
  icon: string;
  onClick?: () => void;
  altText?: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <>
      <button
        className={cn(
          'w-10 2xs:w-12 aspect-square border-2 border-game-orange rounded-full bg-zinc-950 shadow-[inset_0px_0px_17px_0px_#ffffff47] cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-game-dark focus-visible:ring-offset-2 focus-visible:ring-offset-game-cream',
          className
        )}
        onClick={onClick}
      >
        <img src={icon} alt={altText ?? icon} className={imageClassName} />
      </button>
    </>
  );
}

export default IconButton;
