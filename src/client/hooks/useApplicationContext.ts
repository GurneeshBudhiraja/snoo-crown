import { useContext } from 'react';
import { ApplicationContext } from '../context/context';

function useApplicationContext() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplicationContext must be used within a ApplicationContextProvider');
  }
  return context;
}

export default useApplicationContext;
