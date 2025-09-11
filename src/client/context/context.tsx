import React, { createContext, useEffect, useState } from 'react';

export type ApplicationPage =
  | 'home'
  | 'rules'
  | 'leaderboard'
  | 'createAndShare'
  | 'dailySnooChallenge';

export type ApplicationContextType = {
  currentPage: ApplicationPage;
  isCustomPost: boolean;
  isPostLoading: boolean;
  setIsPostLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<ApplicationPage>>;
  setIsCustomPost: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialValue: ApplicationContextType = {
  currentPage: 'home',
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

  useEffect(() => {
    async function getPostType() {
      try {
        const response = await fetch('/api/post/get-post-type', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = (await response.json()) as
          | {
              success: true;
              data: 'custom' | 'regular';
              message: string;
            }
          | {
              success: false;
              message: string;
              data: '';
            };
        if (!data.success) {
          throw new Error(data.message);
        }
        const { data: postType } = data;
        console.log('Is it a custom post');
        console.log(postType === 'custom');
        setIsCustomPost(postType === 'custom');
      } catch (error) {
        console.log('Error getting type of the post');
        setIsCustomPost(false);
        return;
      } finally {
        setIsPostLoading(false);
      }
    }

    void getPostType();
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
