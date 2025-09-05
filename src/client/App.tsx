import React, { useEffect, useState } from 'react';
import { HomePage, GameSetup, CreatePage, PostPage } from './pages/page';
import usePlaySound from './hooks/useSound';

export type ApplicationPage = 'home' | 'game-setup' | 'create' | 'post';

export const App = () => {
  const [currentPage, setCurrentPage] = useState<ApplicationPage>('home');
  const { playGameThemeSong } = usePlaySound();
  const navigateTo = (page: ApplicationPage) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    document.addEventListener('click', async () => {
      await playGameThemeSong();
    });

    return () => {
      document.removeEventListener('click', () => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}
      {currentPage === 'game-setup' && <GameSetup onNavigate={navigateTo} />}
      {currentPage === 'create' && <CreatePage onNavigate={navigateTo} />}
      {currentPage === 'post' && <PostPage onNavigate={navigateTo} />}
    </React.Fragment>
  );
};
