import { context } from '@devvit/web/client';
import { USER_POST_KEY_SUFFIX } from '../shared/shared-constants';
import { useState } from 'react';
import GameSetup from './pages/GameSetup';

export const App = () => {
  const [completePost, setCompletePost] = useState(false);
  return (
    <div className="">
      {!completePost ? <GameSetup setCompletePost={setCompletePost} /> : <> </>}
    </div>
  );
};
