import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Twitter, Info } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden text-zinc-100">
      {/* Background Elements */}
      <div className="absolute top-1/2 -left-[5%] w-[45vw] h-[45vw] bg-cyan-500/5 rounded-full -translate-y-1/2 blur-[80px]" />
      <div className="absolute top-1/2 -left-[20vw] w-[40vw] h-[40vw] bg-zinc-900/20 border border-white/5 rounded-full -translate-y-1/2 backdrop-blur-3xl shadow-inner" />
      
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full" />
      
      {/* Navigation */}
      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/5 bg-zinc-950/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-pink-500 p-[1px]">
            <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <span className="text-xl font-black text-white italic tracking-tighter">NR</span>
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-[0.3em] leading-none mb-1">Neon Rhythm</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">System v2.4.0-Stable</p>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <div className="hidden md:flex gap-4 mr-4">
             <button className="text-zinc-500 hover:text-cyan-400 transition-colors uppercase text-[10px] font-bold tracking-widest">Arcade</button>
             <button className="text-zinc-500 hover:text-cyan-400 transition-colors uppercase text-[10px] font-bold tracking-widest">Library</button>
             <button className="text-zinc-500 hover:text-cyan-400 transition-colors uppercase text-[10px] font-bold tracking-widest">Visualizer</button>
          </div>
          <div className="flex gap-3">
             <button className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors">
                <Github size={18} />
             </button>
             <button className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors">
                <Twitter size={18} />
             </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col xl:flex-row relative z-10 max-w-7xl mx-auto w-full p-6 gap-8">
        {/* Game Center */}
        <section className="flex-1 flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[500px]"
          >
            <SnakeGame />
          </motion.div>
        </section>

        {/* Music Player Aside */}
        <aside className="w-full xl:w-[450px] flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[650px]"
          >
            <MusicPlayer />
          </motion.div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 flex flex-col md:flex-row justify-between items-center bg-zinc-950/80 border-t border-white/5 gap-4">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Core Online</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Uptime: 00:42:18</span>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-zinc-500 hover:text-cyan-400 transition-colors">
                <Info size={14} />
                About Project
            </button>
            <span className="text-[10px] uppercase tracking-widest text-zinc-700">© 2026 Neural Arcade Systems</span>
        </div>
      </footer>
    </div>
  );
}
