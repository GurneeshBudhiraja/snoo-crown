import React, { createContext, useEffect, useState } from 'react';

export type ApplicationPage = 'home' | 'rules' | 'leaderboard' | 'createAndShare';

export type ApplicationContextType = {
  currentPage: ApplicationPage;
  isCustomPost: boolean;
  isPostLoading: boolean;
  setIsPostLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<ApplicationPage>>;
  setIsCustomPost: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialValue: ApplicationContextType = {
  currentPage: 'createAndShare',
  setCurrentPage: () => {},
  isCustomPost: false,
  setIsCustomPost: () => {},
  isPostLoading: false,
  setIsPostLoading: () => {},
};

const ApplicationContext = createContext<ApplicationContextType>(initialValue);

export default function ApplicationContextProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<ApplicationPage>('home');
  const [isCustomPost, setIsCustomPost] = useState<boolean>(false);
  const [isPostLoading, setIsPostLoading] = useState<boolean>(true);
  const PAUSE_TIME = 5000;

  useEffect(() => {
    async function pauseAPI() {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, PAUSE_TIME);
      });
      setIsPostLoading(false);
    }
    void pauseAPI();
  }, []);
  return (
    <ApplicationContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        isCustomPost,
        setIsCustomPost,
        isPostLoading,
        setIsPostLoading,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export { ApplicationContext };
