import { GameButton } from './index';

type MenuOptionsProps = {
  onPlay: () => void;
  onCreate: () => void;
  onPost: () => void;
};

export function MenuOptions({ onPlay, onCreate, onPost }: MenuOptionsProps) {
  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* <GameButton onClick={onPlay} variant="primary" className="w-full text-2xl py-6">
        Play
      </GameButton>

      <GameButton onClick={onCreate} variant="secondary" className="w-full text-2xl py-6">
        Create
      </GameButton>

      <GameButton onClick={onPost} variant="primary" className="w-full text-2xl py-6">
        Post
      </GameButton> */}
    </div>
  );
}
