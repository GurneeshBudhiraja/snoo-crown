// Assets
import GameLogo from '../assets/game-logo.png';
import { MenuOptions } from '../components/MenuOptions';
import { ApplicationPage } from '../App';
import * as motion from 'motion/react-client';

type HomePageProps = {
  onNavigate: (page: ApplicationPage) => void;
};

function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen w-full relative text-gray-800 flex flex-col items-center justify-center ">
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
    </div>
  );
}

export default HomePage;
