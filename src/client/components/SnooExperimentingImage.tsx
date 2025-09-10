import * as motion from 'motion/react-client';
import { SnooExperimenting } from '../assets/assets';
import { cn } from '../util';

export default function SnooExperimentingImage() {
  return (
    <motion.div
      className={cn(
        'absolute right-16 2xs:right-[13%] md:-right-14',
        '-bottom-9 2xs:-bottom-8 md:-bottom-10',
        'h-48 2xs:h-60 lg:h-80 aspect-square',
        'translate-x-1/2 md:translate-x-0'
      )}
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
      <img
        src={SnooExperimenting}
        alt="Snoo Experimenting"
        className="object-cover h-full w-full"
      />
    </motion.div>
  );
}
