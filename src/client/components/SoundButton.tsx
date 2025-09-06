import { MuteSoundIcon, SpeakerIcon } from '../assets/assets';
import useSound from '../hooks/useSound';

export default function SoundButton() {
  const { isGameThemeSongPlaying, toggleGameThemeSong, playButtonClickSound } = useSound();

  return (
    <button
      className="absolute top-1 lg:top-2 left-1 lg:left-2 w-10 2xs:w-12 aspect-square border-2 border-game-orange rounded-full bg-zinc-950 shadow-[inset_0px_0px_17px_0px_#ffffff47] cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-game-dark focus-visible:ring-offset-2 focus-visible:ring-offset-game-cream"
      onClick={() => {
        void playButtonClickSound();
        void toggleGameThemeSong();
      }}
      aria-pressed={isGameThemeSongPlaying}
    >
      {!isGameThemeSongPlaying ? (
        <img src={MuteSoundIcon} alt="Mute Sound" />
      ) : (
        <img src={SpeakerIcon} alt="Unmute Sound" />
      )}
    </button>
  );
}
