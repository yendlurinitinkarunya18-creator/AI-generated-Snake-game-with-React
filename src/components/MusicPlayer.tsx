import { useState, useRef, useEffect } from 'react';
import { TRACKS } from '../constants';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, ListMusic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Autoplay blocked:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handleBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="flex flex-col h-full glass-panel rounded-[2rem] overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      {/* Header */}
      <div className="p-8 pb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center neon-text-cyan">
                <Music size={16} />
            </div>
            <span className="text-xs uppercase font-bold tracking-widest text-zinc-400">Now Playing</span>
        </div>
        <button className="text-zinc-500 hover:text-cyan-400 transition-colors">
            <ListMusic size={20} />
        </button>
      </div>

      {/* Track Info */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div 
          key={currentTrack.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-48 h-48 mb-8"
        >
          <div 
            className="absolute inset-0 rounded-2xl shadow-2xl opacity-50 blur-2xl"
            style={{ background: currentTrack.cover }}
          />
          <div 
            className="relative w-full h-full rounded-2xl border border-white/10 overflow-hidden shadow-inner flex items-center justify-center"
            style={{ background: currentTrack.cover }}
          >
             <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white/40" />
             </div>
          </div>
        </motion.div>

        <motion.h3 
          key={`title-${currentTrack.id}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold tracking-tight mb-1"
        >
          {currentTrack.title}
        </motion.h3>
        <motion.p 
           key={`artist-${currentTrack.id}`}
           initial={{ y: 10, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="text-zinc-500 font-medium uppercase text-[10px] tracking-[0.2em]"
        >
          {currentTrack.artist}
        </motion.p>
      </div>

      {/* Player Section */}
      <div className="p-8 pt-0">
        {/* Progress Bar */}
        <div className="mb-8">
            <div className="w-full h-1 bg-white/5 rounded-full relative group cursor-pointer">
                <div 
                    className="absolute inset-y-0 left-0 bg-cyan-500 rounded-full transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(6,182,212,1)]"
                    style={{ width: `${progress}%` }}
                />
                <div 
                    className="absolute top-1/2 w-3 h-3 bg-white rounded-full -translate-y-1/2 -ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `${progress}%` }}
                />
            </div>
            <div className="flex justify-between mt-2 text-[9px] font-mono text-zinc-600 uppercase">
                <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
                <span>{audioRef.current ? formatTime(audioRef.current.duration) : '0:00'}</span>
            </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
            <button onClick={handleBack} className="text-zinc-400 hover:text-white transition-colors">
                <SkipBack size={24} />
            </button>
            
            <button 
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="translate-x-0.5" fill="currentColor" />}
            </button>

            <button onClick={handleNext} className="text-zinc-400 hover:text-white transition-colors">
                <SkipForward size={24} />
            </button>
        </div>

        {/* Footer controls */}
        <div className="flex justify-between items-center text-zinc-600">
            <Volume2 size={18} />
            <div className="flex gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">Studio Master</span>
            </div>
        </div>
      </div>

      {/* Track List Mini */}
      <div className="bg-white/[0.02] border-t border-white/5 p-4 hidden lg:block">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {TRACKS.map((track, idx) => (
                <button 
                    key={track.id}
                    onClick={() => {
                        setCurrentTrackIndex(idx);
                        setIsPlaying(true);
                    }}
                    className={`flex-shrink-0 w-12 h-12 rounded-lg border transition-all ${
                        currentTrackIndex === idx ? 'border-cyan-500 scale-105' : 'border-white/10 opacity-40 hover:opacity-100'
                    }`}
                    style={{ background: track.cover }}
                />
            ))}
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
