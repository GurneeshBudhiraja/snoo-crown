import React, { useState } from 'react';
import { HomePage, GameSetup, CreatePage, PostPage } from './pages/page';

export type ApplicationPage = 'home' | 'game-setup' | 'create' | 'post';

export const App = () => {
  const [currentPage, setCurrentPage] = useState<ApplicationPage>('home');

  const navigateTo = (page: ApplicationPage) => {
    setCurrentPage(page);
  };

  return (
    <React.Fragment>
      {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}
      {currentPage === 'game-setup' && <GameSetup onNavigate={navigateTo} />}
      {currentPage === 'create' && <CreatePage onNavigate={navigateTo} />}
      {currentPage === 'post' && <PostPage onNavigate={navigateTo} />}
    </React.Fragment>
  );
};
