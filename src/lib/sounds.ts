import { Howl } from 'howler';

// Sounds are disabled or handled safely to prevent 403 errors from external CDNs
const createSound = (src: string, volume: number) => {
  return new Howl({
    src: [src],
    volume: volume,
    onloaderror: () => console.warn(`Sound failed to load: ${src}`),
    onplayerror: () => console.warn(`Sound failed to play: ${src}`)
  });
};

const clickSound = createSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', 0.5);
const successSound = createSound('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', 0.3);
const transitionSound = createSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', 0.2);
const errorSound = createSound('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', 0.3);

export const playClick = () => { try { clickSound.play(); } catch(e) {} };
export const playSuccess = () => { try { successSound.play(); } catch(e) {} };
export const playTransition = () => { try { transitionSound.play(); } catch(e) {} };
export const playError = () => { try { errorSound.play(); } catch(e) {} };
