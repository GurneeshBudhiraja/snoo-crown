import {
  HomePage,
  LeaderboardPage,
  RulesPage,
  CreateAndSharePage,
  ApplicationLoadingPage,
} from './pages/page';
import { AnimatePresence, motion } from 'motion/react';
import useApplicationContext from './hooks/useApplicationContext';
import { MotionAnimationComponentWrapper } from './components';
import { ApplicationPage } from './context/context';

export const App = () => {
  const { currentPage, isPostLoading } = useApplicationContext();

  // Returns the current page component based on the currentPage
  const renderCurrentPage = (currentPage: Exclude<ApplicationPage, 'home'>) => {
    switch (currentPage) {
      case 'rules':
        return <RulesPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'createAndShare':
        return <CreateAndSharePage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center h-screen overflow-clip px-2 lg:px-0">
      <div className="max-w-4xl w-full h-full max-h-[98%] md:max-h-[90%] lg:max-h-[80%] mx-auto flex border-8 lg:border-[8px] border-game-black rounded-2xl relative">
        <div className="relative w-full h-full overflow-auto">
          {isPostLoading ? (
            <ApplicationLoadingPage />
          ) : (
            <>
              {/* HomePage */}
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

              {/* Renders the current page except for HomePage*/}
              <AnimatePresence>
                {currentPage !== 'home' && (
                  <MotionAnimationComponentWrapper key={currentPage}>
                    {renderCurrentPage(currentPage)}
                  </MotionAnimationComponentWrapper>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
