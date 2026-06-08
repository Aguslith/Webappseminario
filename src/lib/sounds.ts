import { Howl } from 'howler';

// Sounds are disabled or handled safely to prevent 403 errors from external CDNs
const createSound = (src: string, volume: number) => {
  return new Howl({
    src: [src],
    volume: volume,
    html5: true, // Use HTML5 Audio to avoid some CORS issues with Web Audio API
    onloaderror: () => console.warn(`Sound failed to load: ${src}`),
    onplayerror: () => console.warn(`Sound failed to play: ${src}`)
  });
};

// Using more reliable CDN-like links for sounds
const clickSound = createSound('https://raw.githubusercontent.com/codeniko/simple-react-sound-samples/master/src/assets/click.mp3', 0.5);
const successSound = createSound('https://raw.githubusercontent.com/codeniko/simple-react-sound-samples/master/src/assets/success.mp3', 0.3);
const transitionSound = createSound('https://raw.githubusercontent.com/codeniko/simple-react-sound-samples/master/src/assets/click.mp3', 0.2); // Fallback to click
const errorSound = createSound('https://raw.githubusercontent.com/codeniko/simple-react-sound-samples/master/src/assets/error.mp3', 0.3);

export const playClick = () => { 
  try { 
    if (clickSound.state() === 'loaded') clickSound.play(); 
    else clickSound.load();
  } catch(e) {} 
};
export const playSuccess = () => { 
  try { 
    if (successSound.state() === 'loaded') successSound.play(); 
    else successSound.load();
  } catch(e) {} 
};
export const playTransition = () => { 
  try { 
    if (transitionSound.state() === 'loaded') transitionSound.play(); 
    else transitionSound.load();
  } catch(e) {} 
};
export const playError = () => { 
  try { 
    if (errorSound.state() === 'loaded') errorSound.play(); 
    else errorSound.load();
  } catch(e) {} 
};
