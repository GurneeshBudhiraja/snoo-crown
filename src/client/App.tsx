import { context } from '@devvit/web/client';
import { USER_POST_KEY_SUFFIX } from '../shared/shared-constants';

export const App = () => {
  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen gap-4">
      <div>Hello world</div>
      <button
        onClick={async () => {
          console.log(context.userId);
          const response = await fetch(`/api/redis?key=${USER_POST_KEY_SUFFIX}:${context.userId}`, {
            method: 'GET',
          });
          const data = await response.json();
          console.log(data);
        }}
      >
        Click me
      </button>
    </div>
  );
};
