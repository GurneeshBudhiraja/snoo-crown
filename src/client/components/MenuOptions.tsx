import { Button } from './Button';

type MenuOptionsProps = {
  onPlay: () => void;
  onCreate: () => void;
  onPost: () => void;
};

export function MenuOptions({ onPlay, onCreate, onPost }: MenuOptionsProps) {
  return (
    <div className="space-y-6 max-w-md mx-auto">
      <Button onClick={onPlay} variant="primary" className="w-full text-2xl py-6">
        Play
      </Button>

      <Button onClick={onCreate} variant="secondary" className="w-full text-2xl py-6">
        Create
      </Button>

      <Button onClick={onPost} variant="primary" className="w-full text-2xl py-6">
        Post
      </Button>
    </div>
  );
}
