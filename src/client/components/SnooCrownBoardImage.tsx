import * as motion from 'motion/react-client';
import { GameLogo } from '../assets/assets';

export default function SnooCrownBoardImage() {
  return (
    <motion.div
      className="absolute -bottom-14 right-1/2 translate-x-1/2 lg:-translate-x-10 lg:-bottom-20 lg:-right-20 h-64 sm:h-80 lg:h-96 aspect-square"
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
      exit={{
        opacity: 0,
        scale: 0.7,
        rotate: -20,
        y: 100,
        transition: {
          type: 'spring',
          stiffness: 200,
          damping: 20,
        },
      }}
      transition={{
        duration: 0.7,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
    >
      <img src={GameLogo} alt="Snoo Crown" className="object-cover h-full w-full" />
    </motion.div>
  );
}
