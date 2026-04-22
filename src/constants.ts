import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Echoes',
    artist: 'Cyber Pulse AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)',
    color: '#06b6d4',
  },
  {
    id: '2',
    title: 'Synthwave Velocity',
    artist: 'Digital Dreamer',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
    color: '#a855f7',
  },
  {
    id: '3',
    title: 'Data Stream',
    artist: 'Neural Network',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    color: '#10b981',
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const MIN_SPEED = 60;
export const SPEED_INCREMENT = 2;
