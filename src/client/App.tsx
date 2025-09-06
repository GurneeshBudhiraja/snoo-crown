import { HomePage, LeaderboardPage, RulesPage } from './pages/page';
import { AnimatePresence, motion } from 'motion/react';
import useApplicationContext from './hooks/useApplicationContext';

export const App = () => {
  const { currentPage } = useApplicationContext();

  return (
    <div className="flex justify-center items-center h-screen overflow-clip px-2 lg:px-0">
      <div className="max-w-4xl w-full h-full max-h-[98%] md:max-h-[90%] lg:max-h-[80%] mx-auto flex border-8 lg:border-[8px] border-game-black rounded-2xl relative">
        <div className="relative w-full h-full overflow-auto">
          {/* HomePage - Always present, scales when RulesPage is active */}
          <motion.div
            animate={{
              scale: currentPage !== 'home' ? 0.95 : 1,
              y: currentPage !== 'home' ? -20 : 0,
            }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="w-full h-full"
          >
            <HomePage />
          </motion.div>

          {/* RulesPage - Slides in from bottom like a card */}
          <AnimatePresence>
            {currentPage === 'rules' && (
              <motion.div
                key="rules"
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
                <RulesPage />
              </motion.div>
            )}
          </AnimatePresence>

          {/* LeaderboardPage */}
          <AnimatePresence>
            {currentPage === 'leaderboard' && (
              <motion.div
                key="leaderboard"
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
                <LeaderboardPage />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
