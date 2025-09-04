import { Button } from '../components/Button';
import { ApplicationPage } from '../App';

type CreatePageProps = {
  onNavigate: (page: ApplicationPage) => void;
};

function CreatePage({ onNavigate }: CreatePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-game-peach)] via-white to-[var(--color-game-sky)] flex flex-col items-center justify-center p-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 text-center max-w-2xl">
        <h1
          className="text-4xl font-bold text-[var(--color-game-orange)] mb-6"
          style={{ fontFamily: 'var(--font-game)' }}
        >
          Create New Puzzle
        </h1>
        <p
          className="text-lg text-[var(--color-game-black)] mb-8 opacity-80"
          style={{ fontFamily: 'var(--font-ibm)' }}
        >
          Design your own custom puzzle for the community to solve!
        </p>

        <div className="space-y-4">
          <Button onClick={() => onNavigate('home')} variant="secondary" className="w-full">
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
