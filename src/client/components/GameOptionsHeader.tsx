import IconButton from './IconButton';
import { BackArrowIcon, HomeIcon, MuteSoundIcon, SpeakerIcon } from '../assets/assets';
import useApplicationContext from '../hooks/useApplicationContext';
import useSound from '../hooks/useSound';

function GameOptionsHeader({
  showSoundButton = false,
  showHomeButton = false,
  showBackButton = false,
  onBackButtonClick,
}: {
  showSoundButton?: boolean;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
}) {
  const { setCurrentPage } = useApplicationContext();
  const { isGameThemeSongPlaying, toggleGameThemeSong, playButtonClickSound } = useSound();
  return (
    <div className="absolute top-2 left-2 flex flex-col gap-2">
      {showBackButton && (
        <IconButton
          imageClassName="w-auto h-8 2xs:h-10 object-contain"
          className='flex items-center justify-center'
          icon={BackArrowIcon}
          onClick={() => {
            void playButtonClickSound();
            onBackButtonClick?.();
          }}
          altText="Back"
        />
      )}

      {/* Home button */}
      {showHomeButton && (
        <IconButton
          icon={HomeIcon}
          onClick={() => {
            void playButtonClickSound();
            setCurrentPage('home');
          }}
          altText="Home"
        />
      )}
      {/* Sound button */}
      {showSoundButton && (
        <IconButton
          icon={isGameThemeSongPlaying ? SpeakerIcon : MuteSoundIcon}
          onClick={() => {
            void playButtonClickSound();
            void toggleGameThemeSong();
          }}
          altText={isGameThemeSongPlaying ? 'Unmute Sound' : 'Mute Sound'}
        />
      )}
    </div>
  );
}

export default GameOptionsHeader;
