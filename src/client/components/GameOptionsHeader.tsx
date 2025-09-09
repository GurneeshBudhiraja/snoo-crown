import IconButton from './IconButton';
import { HomeIcon, MuteSoundIcon, SpeakerIcon } from '../assets/assets';
import useApplicationContext from '../hooks/useApplicationContext';
import useSound from '../hooks/useSound';

function GameOptionsHeader({
  showSoundButton = false,
  showHomeButton = false,
}: {
  showSoundButton?: boolean;
  showHomeButton?: boolean;
}) {
  const { setCurrentPage } = useApplicationContext();
  const { isGameThemeSongPlaying, toggleGameThemeSong, playButtonClickSound } = useSound();
  return (
    <div className="absolute top-2 left-2 flex flex-col gap-2">
      {/* Home button */}
      {showHomeButton && (
        <IconButton icon={HomeIcon} onClick={() => setCurrentPage('home')} altText="Home" />
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
