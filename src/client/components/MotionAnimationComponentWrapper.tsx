// Creates a wrapper function for the page entry and exit animations

import { motion } from 'motion/react';
import React from 'react';

function MotionAnimationComponentWrapper({
  children,
  key,
}: {
  children: React.ReactNode;
  key: string;
}) {
  return (
    <motion.div
      key={key}
      initial={{
        y: '100%',
        scale: 1.2,
        opacity: 0,
        rotateX: 15,
      }}
      animate={{
        y: 0,
        scale: 1,
        opacity: 1,
        rotateX: 0,
      }}
      exit={{
        y: '100%',
        scale: 0.9,
        opacity: 0,
        rotateX: 15,
        transition: {
          duration: 0.2,
        },
      }}
      transition={{
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      className="absolute inset-0 w-full h-full z-10"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {children}
    </motion.div>
  );
}

export default MotionAnimationComponentWrapper;
