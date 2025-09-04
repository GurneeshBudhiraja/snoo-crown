import React, { useState } from 'react';
import { HomePage } from './pages/page';

export type ApplicationPage = 'home';

export const App = () => {
  const [currentPage, setCurrentPage] = useState<ApplicationPage>('home');
  return <React.Fragment>{currentPage === 'home' && <HomePage />}</React.Fragment>;
};
