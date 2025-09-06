import React, { createContext, useContext, useState } from 'react';

export type ApplicationPage = 'home' | 'rules' | 'leaderboard';

export type ApplicationContextType = {
  currentPage: ApplicationPage;
  setCurrentPage: React.Dispatch<React.SetStateAction<ApplicationPage>>;
};

const initialValue: ApplicationContextType = {
  currentPage: 'home',
  setCurrentPage: () => {},
};

const ApplicationContext = createContext<ApplicationContextType>(initialValue);

export default function ApplicationContextProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<ApplicationPage>('home');
  return (
    <ApplicationContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export { ApplicationContext };
