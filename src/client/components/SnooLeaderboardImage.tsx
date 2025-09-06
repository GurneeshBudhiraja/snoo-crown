import * as motion from 'motion/react-client';
import { LeaderboardSnoo } from '../assets/assets';

export default function SnooCrownBoardImage() {
  return (
    <motion.div
      className="absolute -bottom-6 right-10 h-44 translate-x-1/2  2xs:-bottom-5 2xs:right-[9%] md:translate-x-0 md:-right-14 md:-bottom-10  bg-transparent 2xs:h-56 xs:h-64 lg:h-80 aspect-square"
      initial={{
        opacity: 0,
        scale: 0.7,
        y: 200,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
        y: 0,
        transition: {
          duration: 0.3,
        },
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
          duration: 0.3,
        },
      }}
      transition={{
        duration: 0.7,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
    >
      <img src={LeaderboardSnoo} alt="Snoo Crown" className="object-cover h-full w-full" />
    </motion.div>
  );
}
