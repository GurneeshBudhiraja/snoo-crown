// Assets
import GameLogo from '../assets/game-logo.png';
import { MenuOptions } from '../components/MenuOptions';
import { ApplicationPage } from '../App';
import * as motion from 'motion/react-client';
import MuteSoundIcon from '../assets/icons/mute-icon.png';
import SpeakerIcon from '../assets/icons/speaker-icon.png';
import useSound from '../hooks/useSound';
import { GameButton } from '../components/index';

type HomePageProps = {
  onNavigate: (page: ApplicationPage) => void;
};

export function SnooCrownBoardImage() {
  return (
    <motion.div
      className="fixed -bottom-12 -right-7 h-80 aspect-square"
      initial={{
        opacity: 0,
        scale: 0.7,
        rotate: -20,
        y: 100,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
        y: 0,
      }}
      transition={{
        duration: 1,
        type: 'spring',
        stiffness: 120,
        damping: 20,
      }}
    >
      <img src={GameLogo} alt="Snoo Crown" className="object-cover h-full w-full" />
    </motion.div>
  );
}

export function SoundButton() {
  const { isGameThemeSongPlaying, toggleGameThemeSong, playButtonClickSound } = useSound();

  return (
    <div
      className="absolute bottom-2 left-2 w-14 aspect-square border-2 border-game-orange rounded-full bg-zinc-950 shadow-[inset_0px_0px_17px_0px_#ffffff47] cursor-pointer"
      onClick={() => {
        void playButtonClickSound();
        void toggleGameThemeSong();
      }}
    >
      {!isGameThemeSongPlaying ? (
        <img src={MuteSoundIcon} alt="Mute Sound" />
      ) : (
        <img src={SpeakerIcon} alt="Unmute Sound" />
      )}
    </div>
  );
}

function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen w-full relative text-gray-800 flex flex-col items-center justify-center ">
      {/* Image of Snoo holding the welcome board */}
      <SnooCrownBoardImage />
      {/* Sound option */}
      <SoundButton />
      <GameButton text="Today's Crossword" />
    </div>
  );
}

export default HomePage;
