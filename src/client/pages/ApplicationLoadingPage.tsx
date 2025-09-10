import { LoaderCircleIcon } from 'lucide-react';

function ApplicationLoadingPage() {
  return (
    <div className="inset-0 flex-col bg-game-cream m-0 z-10 rounded-lg border-game-black h-full w-full relative text-gray-800 p-10 px-4 2xs:px-0 flex overflow-clip polka-dot-dark">
      <div className="w-full flex flex-col h-full items-center justify-center">
        <LoaderCircleIcon className="animate-spin h-16 text-game-dark" size={42} strokeWidth={3} />
      </div>
    </div>
  );
}

export default ApplicationLoadingPage;
